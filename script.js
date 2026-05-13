// Define page content
const pages = {
  home: `
    <section class="hero">
      <h1>Welcome to Team UpeNix</h1>
      <p>Empowering innovation, collaboration, and growth. Discover our journey and join our vibrant community!</p>
      <a href="#blogs" class="cta-btn" data-page="blogs">Read Our Blogs</a>
    </section>
    <section class="features">
      <h2>Why Choose Us?</h2>
      <div class="feature-list">
        <div class="feature">
          <h3>Innovative Ideas</h3>
          <p>We foster creativity and bring fresh perspectives to every project.</p>
        </div>
        <div class="feature">
          <h3>Collaborative Team</h3>
          <p>Our team works together to achieve common goals and celebrate success.</p>
        </div>
        <div class="feature">
          <h3>Continuous Growth</h3>
          <p>We believe in learning and evolving to stay ahead in the industry.</p>
        </div>
      </div>
    </section>
    <section class="team">
      <h2>Meet Our Team</h2>
      <div class="team-list">
        <div class="member">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rahul Kumar" />
          <h4>Rahul Kumar</h4>
          <p>Founder & Visionary</p>
        </div>
        <div class="member">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Priya Singh" />
          <h4>Priya Singh</h4>
          <p>Lead Developer</p>
        </div>
        <div class="member">
          <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Amit Patel" />
          <h4>Amit Patel</h4>
          <p>Marketing Head</p>
        </div>
      </div>
    </section>
    <section class="testimonials">
      <h2>What People Say</h2>
      <div class="testimonial-list">
        <blockquote>
          "Team UpeNix helped us achieve our goals faster than we imagined!"<br>
          <span>- Startup Founder</span>
        </blockquote>
        <blockquote>
          "A truly inspiring group of professionals. Highly recommended!"<br>
          <span>- Community Member</span>
        </blockquote>
      </div>
    </section>
    <section class="cta">
      <h2>Ready to Join?</h2>
      <p>Connect with us and become part of our UpeNix-driven journey.</p>
      <a href="#news" class="cta-btn" data-page="news">See Latest News</a>
    </section>
  `,
  blogs: `
    <h1>Blogs</h1>
    <p>Here you can add your blog posts.</p>
  `,
  news: `
    <h1>News</h1>
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
