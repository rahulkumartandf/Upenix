# UpeNix Email Consultation Setup Guide

## Overview
The consultation form is now configured to send emails using **EmailJS**, a free service that sends emails directly from your website without requiring a backend server.

## Setup Instructions

### Step 1: Create an EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **Sign Up** and create a free account
3. Verify your email address

### Step 2: Set Up Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Follow the prompts to authorize your email account
   - For Gmail: You may need to use an [App Password](https://support.google.com/accounts/answer/185833)
5. Copy your **Service ID** (looks like: `service_xxx...`)

### Step 3: Create Email Templates
#### Main Consultation Template:
1. Go to **Email Templates** in EmailJS
2. Click **Create New Template**
3. Name it: `consultation_request` (or your preferred name)
4. Set **To Email**: `{{to_email}}`
5. Set **Subject**: `New Consultation Request from {{from_name}}`
6. Use this template:

```html
<h2>New Consultation Request</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Company:</strong> {{company_name}}</p>
<p><strong>Job Title:</strong> {{job_title}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Company Size:</strong> {{company_size}}</p>
<p><strong>Service Interest:</strong> {{service_interest}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><small>Submitted on: {{timestamp}}</small></p>
```

7. Copy your **Template ID** (looks like: `template_xxx...`)

#### Confirmation Template (Optional):
1. Create another template named: `consultation_confirmation`
2. Set **To Email**: `{{to_email}}`
3. Set **Subject**: `We received your consultation request - UpeNix`
4. Use this template:

```html
<p>Hi {{customer_name}},</p>

<p>Thank you for submitting your consultation request! We've received your message and will review your needs for {{company_name}}.</p>

<p>Our team will contact you within <strong>24 hours</strong> to schedule your free strategic assessment.</p>

<p>If you have any immediate questions, feel free to reach out to us at:</p>
<ul>
<li>📧 Email: upenixtechnologies@gmail.com</li>
<li>📞 Phone: +91 9958664330</li>
</ul>

<p>Best regards,<br/>
The UpeNix Team</p>
```

7. Copy this **Template ID** as well

### Step 4: Get Your Public Key
1. Go to **Account** → **API Keys** in EmailJS dashboard
2. Copy your **Public Key** (looks like: `xyz...`)

### Step 5: Update Configuration File
Edit `config.js` and replace these values:

```javascript
const EMAIL_CONFIG = {
  SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',  // e.g., 'service_abc123...'
  TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',  // e.g., 'template_xyz789...'
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',  // e.g., 'abc123xyz...'
  
  RECIPIENT_EMAIL: 'upenixtechnologies@gmail.com',  // Your business email
  
  SEND_COPY_TO_SUBMITTER: true,  // Send confirmation to user
  // ... rest of config
};
```

### Step 6: Update Confirmation Template ID (Optional)
If you created a confirmation template, update this line in `email-service.js`:

Find (around line 75):
```javascript
'CONFIRMATION_TEMPLATE_ID'
```

Replace with your confirmation template ID:
```javascript
'template_your_confirmation_id_here'
```

## Testing

1. Navigate to your website's contact/consultation page
2. Fill out the form with test data
3. Click "Schedule My Free Assessment"
4. Check your email inbox for the consultation request

## Troubleshooting

### Email not sending?
- Check browser console (F12 → Console) for error messages
- Verify all config values are correct
- Ensure EmailJS account is active and verified
- Check spam/junk folder

### Form submits but no email?
- Verify Service ID and Template ID are correct
- Check that template variables match those in `email-service.js`
- Ensure your email service is authorized in EmailJS

### Rate Limiting
- EmailJS free plan allows 200 emails/month
- Upgrade plan if you expect higher volume

## File Structure

```
config.js              # Email configuration (UPDATE THIS)
email-service.js       # Email sending logic
script.js              # Updated form handler
contact.html           # Updated with new scripts
```

## Customization

### Change Success Message
Edit `config.js`:
```javascript
MESSAGES: {
  SUCCESS: 'Your custom success message here'
}
```

### Add More Form Fields
1. Add field to HTML form
2. Add to `formData` object in `script.js`
3. Add validation in `email-service.js` if needed
4. Add to email template in EmailJS dashboard

### Disable Confirmation Emails
Edit `config.js`:
```javascript
SEND_COPY_TO_SUBMITTER: false
```

## Security Notes

- Never commit actual API keys to version control
- EmailJS keys are public-facing (this is normal and secure)
- Form data is validated client-side; add server-side validation in production

## Support

For EmailJS issues: [EmailJS Documentation](https://www.emailjs.com/docs/)
For UpeNix website: upenixtechnologies@gmail.com
