// UpeNix Website JavaScript
// Handles form submission, navigation, interactions, and blog filtering

document.addEventListener('DOMContentLoaded', function() {
  initializeForm();
  setActiveNavLink();
  initializeBlogFilters();
  initializeNewsletterForm();
  renderBlogPosts();
  renderBlogPostDetail();
});

// ============================================
// Blog Rendering
// ============================================

function renderBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid || typeof window.blogPosts === 'undefined') return;

  const posts = window.blogPosts;
  blogGrid.innerHTML = posts.map(post => `
    <article class="blog-card" data-category="${post.categoryKey}">
      <div class="blog-header">
        <span class="blog-category">${post.category}</span>
        <span class="blog-date">${post.date}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="blog-meta">
        <span class="blog-author">By ${post.author}</span>
        <span class="blog-read-time">${post.readTime}</span>
      </div>
      <a href="blog-post.html?slug=${post.slug}" class="read-more">Read Full Article →</a>
    </article>
  `).join('');
}

function renderBlogPostDetail() {
  const detailRoot = document.getElementById('blogPostDetail');
  if (!detailRoot || typeof window.blogPosts === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const post = window.blogPosts.find(item => item.slug === slug);

  if (!post) {
    detailRoot.innerHTML = '<p class="form-note">The requested article could not be found.</p>';
    return;
  }

  detailRoot.innerHTML = `
    <article class="blog-post-content">
      <p class="resource-type">${post.category}</p>
      <h1>${post.title}</h1>
      <div class="featured-post-meta">
        <span>By ${post.author}</span>
        <span>${post.readTime}</span>
        <span>${post.date}</span>
      </div>
      ${post.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
      <a href="blog.html" class="btn btn-primary">Back to all articles</a>
    </article>
  `;
}

// ============================================
// Blog Filtering
// ============================================

function initializeBlogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (filterBtns.length === 0) return; // Not on blog page
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter blog posts
      filterBlogPosts(filter);
    });
  });
}

function filterBlogPosts(filter) {
  const blogCards = document.querySelectorAll('.blog-card');
  let visibleCount = 0;
  
  blogCards.forEach(card => {
    const category = card.getAttribute('data-category');
    
    if (filter === 'all' || category === filter) {
      card.classList.remove('hidden');
      visibleCount++;
      // Add animation
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = 'fadeIn 0.5s ease';
      }, 10);
    } else {
      card.classList.add('hidden');
    }
  });
  
  console.log(`Showing ${visibleCount} posts for filter: ${filter}`);
}

// ============================================
// Newsletter Form Handling
// ============================================

function initializeNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleNewsletterSubmit(newsletterForm);
    });
  }
}

function handleNewsletterSubmit(form) {
  const email = form.querySelector('input[type="email"]').value;
  
  const newsletterData = {
    email: email,
    timestamp: new Date().toISOString(),
    source: 'blog_newsletter'
  };

  console.log('Newsletter signup:', newsletterData);

  // Store in localStorage
  const signups = JSON.parse(localStorage.getItem('upenix_newsletter_signups') || '[]');
  signups.push(newsletterData);
  localStorage.setItem('upenix_newsletter_signups', JSON.stringify(signups));

  // Show success message
  const button = form.querySelector('button');
  const originalText = button.textContent;
  button.textContent = '✓ Subscribed!';
  button.disabled = true;

  setTimeout(() => {
    form.reset();
    button.textContent = originalText;
    button.disabled = false;
  }, 3000);
}

// ============================================
// Form Handling
// ============================================

function initializeForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit(form);
    });
  }
}

async function handleFormSubmit(form) {
  // Get form data
  const formData = {
    name: form.querySelector('#name').value,
    company: form.querySelector('#company').value,
    title: form.querySelector('#title').value,
    email: form.querySelector('#email').value,
    phone: form.querySelector('#phone').value,
    company_size: form.querySelector('#company-size').value,
    service: form.querySelector('#service').value,
    message: form.querySelector('#message').value,
    timestamp: new Date().toISOString()
  };

  // Validate form data
  if (emailService) {
    const validation = emailService.validateFormData(formData);
    if (!validation.isValid) {
      showFormError(form, validation.errors.join(', '));
      return;
    }
  }

  // Disable submit button and show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = EMAIL_CONFIG.MESSAGES.SENDING;

  // Send email via EmailService
  try {
    const result = await emailService.sendConsultationRequest(formData);
    
    if (result.success) {
      console.log('Form submission successful:', formData);
      showFormSuccess(form, result.message);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset();
        hideFormSuccess();
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }, 3000);
    } else {
      console.error('Form submission failed:', result.error);
      showFormError(form, result.message);
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  } catch (error) {
    console.error('Unexpected error during form submission:', error);
    showFormError(form, EMAIL_CONFIG.MESSAGES.ERROR);
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

function showFormSuccess(form, message) {
  const successMessage = form.nextElementSibling;
  if (successMessage && successMessage.classList.contains('success-message')) {
    // Update message text if provided
    if (message) {
      const messageP = successMessage.querySelector('p');
      if (messageP) {
        messageP.textContent = message;
      }
    }
    successMessage.style.display = 'block';
    form.style.display = 'none';
  }
}

function showFormError(form, errorMessage) {
  // Remove previous error if exists
  const existingError = form.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Create and show error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = `
    background-color: #f8d7da;
    color: #721c24;
    padding: 12px 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
  `;
  errorDiv.textContent = errorMessage;

  form.parentElement.insertBefore(errorDiv, form);

  // Auto-remove error after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function hideFormSuccess() {
  const form = document.getElementById('contactForm');
  const successMessage = form?.nextElementSibling;
  if (successMessage && successMessage.classList.contains('success-message')) {
    successMessage.style.display = 'none';
    form.style.display = 'block';
  }
}

// ============================================
// Navigation
// ============================================

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// Mobile Menu Toggle (if needed in future)
// ============================================

function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// ============================================
// Analytics Helper (for future implementation)
// ============================================

function trackEvent(eventName, eventData = {}) {
  console.log(`Event: ${eventName}`, eventData);
  // In production, send to analytics service
}

// Track CTA button clicks
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = this.textContent.trim();
    trackEvent('CTA_Click', { buttonText });
  });
});

// ============================================
// Utility Functions
// ============================================

// Check if form has been previously submitted
function hasFormBeenSubmitted() {
  const submissions = JSON.parse(localStorage.getItem('upenix_submissions') || '[]');
  return submissions.length > 0;
}

// Get recent submissions (for admin purposes)
function getRecentSubmissions(limit = 5) {
  const submissions = JSON.parse(localStorage.getItem('upenix_submissions') || '[]');
  return submissions.slice(-limit).reverse();
}

// Get newsletter signups
function getNewsletterSignups(limit = 5) {
  const signups = JSON.parse(localStorage.getItem('upenix_newsletter_signups') || '[]');
  return signups.slice(-limit).reverse();
}
    <p>Here you can publish latest news and updates.</p>
  `
};

// Load a page
function loadPage(page) {
  document.getElementById("content").innerHTML = pages[page];

  // Update active tab
  document.querySelectorAll("nav a").forEach(link => {
    link.classList.remove("active");
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });

  // Save current page in URL hash
  window.location.hash = page;
}

// Setup navigation
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    loadPage(link.dataset.page);
  });
});

// Load page from hash or default to home
window.addEventListener("load", () => {
  const page = window.location.hash.replace("#", "") || "home";
  loadPage(page);
});
