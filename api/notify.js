export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, to, subject, text, phone, message } = req.body;

  try {
    if (type === 'email') {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.NOTIFICATION_FROM_EMAIL || 'notifications@flashpoint.co.ug',
            to: [to],
            subject: subject || 'Flashpoint Security Carrier Notification',
            html: `<div style="font-family: sans-serif; padding: 20px; background: #fcfcf9; color: #18181b;">
              <h2 style="color: #ca8a04;">Flashpoint Security Carrier</h2>
              <p>${text}</p>
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
              <small style="color: #71717a;">Nakasero Central Command • Kampala, Uganda</small>
            </div>`,
          }),
        });

        const data = await response.json();
        return res.status(200).json({ success: true, provider: 'Resend', data });
      }
    }

    if (type === 'sms') {
      const atApiKey = process.env.AFRICASTALKING_API_KEY;
      const atUsername = process.env.AFRICASTALKING_USERNAME || 'sandbox';

      if (atApiKey) {
        const params = new URLSearchParams();
        params.append('username', atUsername);
        params.append('to', phone);
        params.append('message', `[FLASHPOINT CARRIER] ${message}`);

        const response = await fetch('https://api.africastalking.com/version1/messaging', {
          method: 'POST',
          headers: {
            'apiKey': atApiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: params,
        });

        const data = await response.json();
        return res.status(200).json({ success: true, provider: "Africa's Talking", data });
      }
    }

    // Default response if credentials aren't configured on server
    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'Notification logged successfully (add API keys in Render/Vercel dashboard for live dispatch)'
    });
  } catch (error) {
    console.error('Notification API Error:', error);
    return res.status(500).json({ error: error.message || 'Notification sending failed' });
  }
}
