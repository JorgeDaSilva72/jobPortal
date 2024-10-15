import { useEffect, useRef } from "react";

const PayPalButton = (amount, onPaymentSuccess) => {
  // const PayPalButton = (amount) => {
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: "30.00",
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log("Paiement réussi : ", order);
          onPaymentSuccess(order); // Appelle une fonction pour traiter l'abonnement
        },
        onError: (err) => {
          console.error("Erreur lors du paiement : ", err);
        },
      })
      .render(paypalRef.current);
  }, [amount, onPaymentSuccess]);
  //   }, [amount]);
  return <div ref={paypalRef} />;
};

export default PayPalButton;
