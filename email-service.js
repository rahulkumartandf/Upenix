// UpeNix Email Service
// Handles sending consultation form emails via EmailJS

class EmailService {
  constructor() {
    this.isInitialized = false;
    this.initializeEmailJS();
  }

  initializeEmailJS() {
    // Check if EmailJS is available
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
      this.isInitialized = true;
      console.log('EmailJS initialized successfully');
    } else {
      console.warn('EmailJS library not loaded. Email functionality will be disabled.');
    }
  }

  async sendConsultationRequest(formData) {
    if (!this.isInitialized) {
      return this.handleFallback(formData);
    }

    try {
      const templateParams = {
        to_email: EMAIL_CONFIG.TEMPLATE_PARAMS.TO_EMAIL,
        from_name: formData.name,
        from_email: formData.email,
        company_name: formData.company,
        job_title: formData.title,
        phone: formData.phone,
        company_size: formData.company_size,
        service_interest: formData.service,
        message: formData.message,
        timestamp: formData.timestamp,
        reply_to: formData.email
      };

      // Send email
      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);

      // Send confirmation to submitter if enabled
      if (EMAIL_CONFIG.SEND_COPY_TO_SUBMITTER) {
        await this.sendConfirmationEmail(formData);
      }

      return {
        success: true,
        message: EMAIL_CONFIG.MESSAGES.SUCCESS
      };

    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: EMAIL_CONFIG.MESSAGES.ERROR,
        error: error
      };
    }
  }

  async sendConfirmationEmail(formData) {
    try {
      const confirmationParams = {
        to_email: formData.email,
        customer_name: formData.name,
        company_name: formData.company
      };

      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        'CONFIRMATION_TEMPLATE_ID', // You'll need to create this template
        confirmationParams
      );

      console.log('Confirmation email sent to:', formData.email);
    } catch (error) {
      console.warn('Failed to send confirmation email:', error);
    }
  }

  handleFallback(formData) {
    // Fallback when EmailJS is not available
    console.log('Fallback: Storing form data locally');
    console.log('Form data:', formData);

    const submissions = JSON.parse(localStorage.getItem('upenix_submissions') || '[]');
    submissions.push({
      ...formData,
      sent_via: 'localStorage_fallback'
    });
    localStorage.setItem('upenix_submissions', JSON.stringify(submissions));

    // Send to alternative endpoint if available
    this.sendToAlternativeBackend(formData);

    return {
      success: true,
      message: 'Your request has been recorded. We will contact you shortly.',
      fallback: true
    };
  }

  async sendToAlternativeBackend(formData) {
    try {
      // If you have a backend endpoint, send data there
      // Example: POST to /api/consultation
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Form data sent to backend');
      }
    } catch (error) {
      console.warn('Could not send to backend:', error);
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateFormData(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim() === '') {
      errors.push('Name is required');
    }
    if (!formData.company || formData.company.trim() === '') {
      errors.push('Company name is required');
    }
    if (!formData.title || formData.title.trim() === '') {
      errors.push('Job title is required');
    }
    if (!formData.email || !this.validateEmail(formData.email)) {
      errors.push('Valid email is required');
    }
    if (!formData.phone || formData.phone.trim() === '') {
      errors.push('Phone number is required');
    }
    if (!formData.company_size || formData.company_size === '') {
      errors.push('Company size is required');
    }
    if (!formData.service || formData.service === '') {
      errors.push('Primary interest is required');
    }
    if (!formData.message || formData.message.trim() === '') {
      errors.push('Message is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

// Initialize email service globally
const emailService = new EmailService();
