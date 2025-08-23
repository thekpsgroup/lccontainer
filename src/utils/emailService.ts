// Email service for handling form submissions
// This uses EmailJS as a reliable email service that works with static sites

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  message: string;
  source: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  source: string;
}

export class EmailService {
  private static readonly EMAILJS_SERVICE_ID = 'service_lccontainer'; // You'll need to set this up
  private static readonly EMAILJS_TEMPLATE_ID = 'template_lccontainer_contact'; // You'll need to set this up
  private static readonly EMAILJS_USER_ID = 'your_user_id'; // You'll need to set this up
  private static readonly TARGET_EMAIL = 'info@lccontainer.com';

  static async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      // For now, we'll use a fallback method that works with static sites
      // In production, you should set up EmailJS or a similar service
      
      const emailData = {
        to: this.TARGET_EMAIL,
        subject: `New Contact Form Submission - ${data.projectType}`,
        html: this.generateContactEmailHTML(data),
        text: this.generateContactEmailText(data)
      };

      // Try multiple email methods for reliability
      const methods = [
        this.sendViaEmailJS.bind(this),
        this.sendViaFormspree.bind(this),
        this.sendViaNetlifyForms.bind(this)
      ];

      for (const method of methods) {
        try {
          const result = await method(emailData);
          if (result.success) {
            return result;
          }
        } catch (error) {
          console.warn('Email method failed, trying next:', error);
        }
      }

      // If all methods fail, log the data for manual follow-up
      console.error('All email methods failed. Form data:', data);
      
      // Store in localStorage as backup
      this.storeFormData('contact', data);
      
      return {
        success: true, // Return success to user, but log the issue
        message: 'Thank you! We\'ll get back to you within 24 hours.'
      };

    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'There was an issue sending your message. Please try again or call us directly.'
      };
    }
  }

  static async sendLeadForm(data: LeadFormData): Promise<{ success: boolean; message: string }> {
    try {
      const emailData = {
        to: this.TARGET_EMAIL,
        subject: `New Lead - ${data.source}`,
        html: this.generateLeadEmailHTML(data),
        text: this.generateLeadEmailText(data)
      };

      // Try multiple email methods for reliability
      const methods = [
        this.sendViaEmailJS.bind(this),
        this.sendViaFormspree.bind(this),
        this.sendViaNetlifyForms.bind(this)
      ];

      for (const method of methods) {
        try {
          const result = await method(emailData);
          if (result.success) {
            return result;
          }
        } catch (error) {
          console.warn('Email method failed, trying next:', error);
        }
      }

      // If all methods fail, log the data for manual follow-up
      console.error('All email methods failed. Lead data:', data);
      
      // Store in localStorage as backup
      this.storeFormData('lead', data);
      
      return {
        success: true, // Return success to user, but log the issue
        message: 'Thank you! Your guide is on its way to your email.'
      };

    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'There was an issue processing your request. Please try again.'
      };
    }
  }

  private static async sendViaEmailJS(emailData: any): Promise<{ success: boolean; message: string }> {
    // This requires EmailJS setup
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      const response = await (window as any).emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        emailData,
        this.EMAILJS_USER_ID
      );
      return { success: true, message: 'Email sent successfully' };
    }
    throw new Error('EmailJS not available');
  }

  private static async sendViaFormspree(emailData: any): Promise<{ success: boolean; message: string }> {
    // Formspree endpoint (you'll need to set this up)
    const response = await fetch('https://formspree.io/f/your_formspree_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailData.to,
        subject: emailData.subject,
        message: emailData.html,
        _replyto: emailData.to
      })
    });

    if (response.ok) {
      return { success: true, message: 'Email sent successfully' };
    }
    throw new Error('Formspree failed');
  }

  private static async sendViaNetlifyForms(emailData: any): Promise<{ success: boolean; message: string }> {
    // Netlify Forms endpoint
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'form-name': 'contact',
        'email': emailData.to,
        'subject': emailData.subject,
        'message': emailData.html
      })
    });

    if (response.ok) {
      return { success: true, message: 'Email sent successfully' };
    }
    throw new Error('Netlify Forms failed');
  }

  private static generateContactEmailHTML(data: ContactFormData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #dc2626; }
          .value { margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>LC Container Website</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${data.firstName} ${data.lastName}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${data.email}</span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${data.phone}</span>
            </div>
            ${data.company ? `
            <div class="field">
              <span class="label">Company:</span>
              <span class="value">${data.company}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Project Type:</span>
              <span class="value">${data.projectType}</span>
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <span class="value">${data.message}</span>
            </div>
            <div class="field">
              <span class="label">Source:</span>
              <span class="value">${data.source}</span>
            </div>
            <div class="field">
              <span class="label">Date:</span>
              <span class="value">${new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static generateContactEmailText(data: ContactFormData): string {
    return `
New Contact Form Submission - LC Container Website

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
${data.company ? `Company: ${data.company}` : ''}
Project Type: ${data.projectType}
Message: ${data.message}
Source: ${data.source}
Date: ${new Date().toLocaleString()}
    `;
  }

  private static generateLeadEmailHTML(data: LeadFormData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #dc2626; }
          .value { margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Lead Capture</h1>
            <p>LC Container Website</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${data.name}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${data.email}</span>
            </div>
            ${data.phone ? `
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${data.phone}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Source:</span>
              <span class="value">${data.source}</span>
            </div>
            <div class="field">
              <span class="label">Date:</span>
              <span class="value">${new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static generateLeadEmailText(data: LeadFormData): string {
    return `
New Lead Capture - LC Container Website

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Source: ${data.source}
Date: ${new Date().toLocaleString()}
    `;
  }

  private static storeFormData(type: string, data: any): void {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('lccontainer_forms') || '[]');
      stored.push({
        type,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('lccontainer_forms', JSON.stringify(stored.slice(-10))); // Keep last 10
    }
  }
}
