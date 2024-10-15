// TestPayPal.jsx
import PayPalButton from "@/components/PayPalButton";

const TestPayPal = () => {
  const handlePaymentSuccess = (details) => {
    console.log("Paiement réussi :", details);
  };

  return (
    <div>
      <h1>Test PayPal Button</h1>
      <PayPalButton
        amount="30.00"
        onPaymentSuccess={handlePaymentSuccess}
        disabled={false}
        className="test-paypal-button"
      />
    </div>
  );
};

export default TestPayPal;
