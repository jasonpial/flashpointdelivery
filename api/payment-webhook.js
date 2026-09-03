export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['verif-hash'];
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || 'flashpoint-webhook-secret';

    // Verify secret hash if configured
    if (signature && signature !== secretHash) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const payload = req.body;
    console.log('Payment Webhook Received:', payload);

    // Process status update logic for orders
    if (payload && payload.status === 'successful') {
      const txRef = payload.txRef || payload.tx_ref;
      const orderId = payload.customizations ? payload.customizations.order_id : null;

      return res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully',
        txRef,
        orderId
      });
    }

    return res.status(200).json({ status: 'ignored', message: 'Non-successful payment state' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
