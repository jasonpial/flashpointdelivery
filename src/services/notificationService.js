/**
 * Flashpoint Notification Service
 * Dispatches Resend Email alerts and Africa's Talking / Twilio SMS notifications
 */

export const notificationService = {
  /**
   * Send Email Notification via Serverless API handler
   * @param {Object} emailData - { to, subject, htmlText, recipientName }
   */
  async sendEmail({ to, subject, bodyText, recipientName }) {
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          to,
          subject,
          text: bodyText,
          recipientName
        })
      });
      return await response.json();
    } catch (err) {
      console.log('Email Notification simulated (offline/local):', { to, subject, bodyText });
      return { success: true, simulated: true };
    }
  },

  /**
   * Send SMS Notification via Serverless API handler
   * @param {Object} smsData - { phone, message }
   */
  async sendSMS({ phone, message }) {
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sms',
          phone,
          message
        })
      });
      return await response.json();
    } catch (err) {
      console.log('SMS Notification simulated (offline/local):', { phone, message });
      return { success: true, simulated: true };
    }
  }
};
