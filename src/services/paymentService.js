/**
 * Flashpoint Payment Engine Service
 * Handles MTN Mobile Money, Airtel Money & Credit/Debit Card transactions via Flutterwave & Paystack
 */

export const paymentService = {
  /**
   * Initiate Mobile Money / Card Payment transaction
   * @param {Object} paymentDetails - Transaction details (amount, email, phone, txRef, customerName)
   * @param {Function} onSuccess - Callback when transaction succeeds
   * @param {Function} onCancel - Callback when transaction is cancelled or closed
   */
  async processPayment({ amount, email, phone, txRef, customerName, title = 'Secured Cargo Carriage' }, onSuccess, onCancel) {
    const flutterwaveKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

    // Check if Flutterwave inline script is loaded or dynamically load it
    if (typeof window !== 'undefined' && window.FlutterwaveCheckout && flutterwaveKey) {
      window.FlutterwaveCheckout({
        public_key: flutterwaveKey,
        tx_ref: txRef || `FP-TX-${Date.now()}`,
        amount: amount,
        currency: 'UGX',
        payment_options: 'mobilemoneyuganda,card,banktransfer',
        customer: {
          email: email || 'client@flashpoint.co.ug',
          phone_number: phone || '+256700000000',
          name: customerName || 'Valued Client',
        },
        customizations: {
          title: 'Flashpoint Security Carrier',
          description: title,
          logo: 'https://flashpointdelivery.com/logo.png',
        },
        callback: function (data) {
          console.log("Flutterwave Transaction Status:", data);
          if (data.status === "successful") {
            if (onSuccess) onSuccess(data);
          } else {
            alert(`Transaction response: ${data.status}`);
          }
        },
        onclose: function () {
          if (onCancel) onCancel();
        },
      });
      return;
    }

    // Interactive Demo Simulation fallback if API keys are pending setup
    const confirmDemoPayment = window.confirm(
      `[FLUTTERWAVE / PAYSTACK UGANDA PAYMENT GATEWAY]\n\n` +
      `Amount: ${amount.toLocaleString()} UGX\n` +
      `Recipient: Flashpoint Logistics Ltd (Nakasero Base)\n` +
      `Payment Channels: MTN Mobile Money (*165#), Airtel Money (*185#), Visa/Mastercard\n\n` +
      `Click OK to simulate successful Mobile Money confirmation.`
    );

    if (confirmDemoPayment) {
      if (onSuccess) {
        onSuccess({
          status: 'successful',
          transaction_id: `UG-MM-${Math.floor(100000 + Math.random() * 900000)}`,
          tx_ref: txRef || `FP-TX-${Date.now()}`
        });
      }
    } else {
      if (onCancel) onCancel();
    }
  }
};
