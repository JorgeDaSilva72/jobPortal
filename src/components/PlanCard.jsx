import { Check } from "lucide-react";
// import PayPalButton from "@/components/PayPalButton";
import PropTypes from "prop-types";
import { Button } from "./ui/button";

const PlanCard = ({
  plan,
  selectedPlan,
  setSelectedPlan,
  handleSubmit,
  canSubmit,
  SingleSubscription,
  isSubscriptionExpired,
}) => {
  const isPro = plan === "Pro";
  const isSelected = selectedPlan === plan;

  return (
    <div
      onClick={() => setSelectedPlan(plan)}
      className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
        isSelected
          ? "border-indigo-600 ring-8 ring-indigo-600"
          : "border-gray-200"
      }`}
    >
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">
          {plan}
          <span className="sr-only">Plan</span>
        </h2>
        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {isPro ? "30 FCFA" : "Gratuit"}
          </strong>
          {isPro && (
            <span className="text-sm font-medium text-gray-700">/mois</span>
          )}
        </p>
      </div>
      <ul className="mt-6 space-y-2">
        {isPro ? (
          <>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">Annonces illimitées</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">5GB de stockage</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">Assistance par e-mail</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">Assistance téléphonique</span>
            </li>
          </>
        ) : (
          <>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">1 annonce gratuite</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">1GB de stockage</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700">Assistance par e-mail</span>
            </li>
          </>
        )}
      </ul>
      {/* Rendre le PayPalButton uniquement si ce plan est sélectionné */}
      {isPro && isSelected && (
        <Button
          onClick={handleSubmit}
          // disabled={loadingCreateSubscription  || !canSubmit()} // Désactiver pendant le chargement
          disabled={!canSubmit()}
          className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
        >
          Acheter{" "}
        </Button>
        //* {loadingCreateSubscription ? "Chargement..." : "Commencer"} */}
        // <PayPalButton
        //   amount="30.00"
        //   onPaymentSuccess={handleSubmit}
        //   disabled={!canSubmit()}
        //   className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
        // />
      )}
      {isPro && SingleSubscription && SingleSubscription.plan_id === 2 && (
        <p
          className={`mt-4 text-sm ${
            isSubscriptionExpired() ? "text-red-600" : "text-gray-600"
          }`}
        >
          {isSubscriptionExpired()
            ? "Votre abonnement actuel est expiré."
            : `Vous avez un abonnement actif jusqu'au ${new Date(
                SingleSubscription?.end_date
              ).toLocaleDateString()}.`}
        </p>
      )}
    </div>
  );
};

export default PlanCard;

PlanCard.propTypes = {
  plan: PropTypes.string.isRequired, // 'plan' est une chaîne de caractères et obligatoire
  selectedPlan: PropTypes.string.isRequired, // 'selectedPlan' est une chaîne de caractères et obligatoire
  setSelectedPlan: PropTypes.func.isRequired, // 'setSelectedPlan' est une fonction et obligatoire
  handleSubmit: PropTypes.func.isRequired, // 'handleSubmit' est une fonction et obligatoire
  canSubmit: PropTypes.func.isRequired, // 'canSubmit' est une fonction et obligatoire
  SingleSubscription: PropTypes.shape({
    end_date: PropTypes.string,
    plan_id: PropTypes.number,
    success: PropTypes.bool,
    message: PropTypes.string,
    // Ajoutez d'autres propriétés si nécessaire
  }),
  isSubscriptionExpired: PropTypes.func.isRequired, // 'isSubscriptionExpired' est une fonction et obligatoire
};

PlanCard.defaultProps = {
  SingleSubscription: null, // Valeur par défaut si 'SingleSubscription' n'est pas fourni
};
