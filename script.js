// UpeNix Website JavaScript
// Handles form submission, navigation, and interactions

document.addEventListener('DOMContentLoaded', function() {
  initializeForm();
  setActiveNavLink();
});

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

function handleFormSubmit(form) {
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

  // Log the form data (in production, send to backend)
  console.log('Form submitted:', formData);

  // Store in localStorage for demonstration
  const submissions = JSON.parse(localStorage.getItem('upenix_submissions') || '[]');
  submissions.push(formData);
  localStorage.setItem('upenix_submissions', JSON.stringify(submissions));

  // Show success message
  showFormSuccess(form);

  // Reset form after 2 seconds
  setTimeout(() => {
    form.reset();
    hideFormSuccess();
  }, 2000);
}

function showFormSuccess(form) {
  const successMessage = form.nextElementSibling;
  if (successMessage && successMessage.classList.contains('success-message')) {
    successMessage.style.display = 'block';
    form.style.display = 'none';
  }
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
