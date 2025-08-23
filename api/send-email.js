// Vercel serverless function for sending emails
// This will be deployed to /api/send-email

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, formType } = req.body;

    // Validate required fields
    if (!formData || !formType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    // Generate email content based on form type
    let emailContent;
    let subject;

    if (formType === 'contact') {
      subject = `New Contact Form Submission - ${formData.projectType || 'General Inquiry'}`;
      emailContent = generateContactEmail(formData);
    } else if (formType === 'lead') {
      subject = `New Lead Capture - ${formData.source || 'Website'}`;
      emailContent = generateLeadEmail(formData);
    } else {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // Send email
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@lccontainer.com',
      to: 'info@lccontainer.com',
      subject: subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}

function generateContactEmail(data) {
  const html = `
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

  const text = `
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

  return { html, text };
}

function generateLeadEmail(data) {
  const html = `
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

  const text = `
New Lead Capture - LC Container Website

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Source: ${data.source}
Date: ${new Date().toLocaleString()}
  `;

  return { html, text };
}
