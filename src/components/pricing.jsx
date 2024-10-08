import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";
import {
  addNewSubscription,
  getSingleSubscription,
} from "@/api/apiSubscription";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro"); // Par défaut, le plan "Pro" est sélectionné
  const { user, isLoaded } = useUser();

  // console.log("user", user);
  // console.log("isLoaded", isLoaded);

  // console.log("selectedPlan", selectedPlan);

  //Hook pour récupérer l'abonnement existant
  const {
    loading: loadingSingleSubscription,
    data: SingleSubscription,
    fn: fnSingleSubscription,
  } = useFetch(getSingleSubscription, {
    user_id: user?.id, // Assure-toi que l'utilisateur est défini
  });

  useEffect(() => {
    fnSingleSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  // useEffect(() => {
  //   if (isLoaded && user) fnJob(); // Appelle fnJob uniquement si l'utilisateur est chargé, Appelle fnJob sans paramètres car les options sont déjà définies dans le hook
  // }, [isLoaded, user]);

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     console.log("User loaded, calling fnJob");
  //     fnJob({ user_id: user.id }); // Appel de fnJob avec user_id
  //   }
  // }, [isLoaded, user]);

  // Hook pour la gestion de la création d'abonnement
  const {
    loading: loadingCreateSubscription,
    error: errorCreateSubscription,
    data: dataCreateSubscription,
    fn: fnCreateSubscription,
  } = useFetch(addNewSubscription);

  // Fonction pour gérer la soumission de l'abonnement
  const handleSubmit = () => {
    if (!user || !user.id) {
      console.error("User not authenticated");
      return;
    }
    // Assurer que l'utilisateur est bien chargé
    if (!isLoaded || !user) {
      console.error("L'utilisateur n'est pas encore chargé.");
      return;
    }

    // Si l'utilisateur a un abonnement "Pro", empêcher l'ajout d'un nouvel abonnement
    console.log("SingleSubscription", SingleSubscription);
    if (SingleSubscription?.plan_id === 2) {
      console.log("L'utilisateur a déjà le plan Pro.");
      return;
    }

    // Si l'utilisateur a un abonnement "Starter", il peut passer à "Pro"
    if (SingleSubscription?.plan_id === 1 && selectedPlan === "Pro") {
      console.log("L'utilisateur passe de Starter à Pro.");
      // Code pour mettre à jour l'abonnement ici (modifie les dates et le statut si nécessaire)
    }

    if (SingleSubscription && !SingleSubscription.success) {
      console.error(SingleSubscription.message);
      return;
    }
    // Si aucun abonnement n'est trouvé, créez un nouvel abonnement

    // Map selectedPlan to plan_id
    const planIdMap = {
      Pro: 2, // ID du plan "Pro"
      Starter: 1, // ID du plan "Starter"
      // Ajoute d'autres plans si nécessaire
    };

    // Date de début de l'abonnement
    const startDate = new Date().toISOString();

    // Date de fin de l'abonnement (par exemple, un mois après la date de début)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Ajouter un mois
    const endDateISOString = endDate.toISOString();

    // Statut de l'abonnement (par exemple, "actif" lorsque l'utilisateur prend un abonnement)
    const statusSubscription = "active";

    // Si tu veux gérer le renouvellement automatique, tu peux définir une date de renouvellement ici
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1); // Exemple d'un renouvellement mensuel
    const renewalDateISOString = renewalDate.toISOString();

    // Appeler la fonction de création d'abonnement
    fnCreateSubscription({
      user_id: user.id, // Récupérer l'ID utilisateur
      plan_id: planIdMap[selectedPlan], //  Utilise le plan sélectionné
      status_subscription: statusSubscription,
      start_date: startDate,
      end_date: endDateISOString,
      renewal_date: renewalDateISOString,
    });
  };

  if (!isLoaded || loadingSingleSubscription) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
        {/* Plan Pro */}
        <div
          onClick={() => setSelectedPlan("Pro")}
          className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
            selectedPlan === "Pro"
              ? "border-indigo-600 ring-8 ring-indigo-600"
              : "border-gray-200"
          }`}
        >
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pro
              <span className="sr-only">Plan</span>
            </h2>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                30 FCFA{" "}
              </strong>
              <span className="text-sm font-medium text-gray-700">/mois</span>
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Annonces illimitées </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> 5GB de stockage </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Assistance par e-mail </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Assistance téléphonique </span>
            </li>
          </ul>

          {/* <Button
            onClick={handleSubmit}
            disabled={loadingCreateSubscription} // Désactiver pendant le chargement
            className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
          >
            {loadingCreateSubscription ? "Chargement..." : "Commencer"}
          </Button> */}

          {errorCreateSubscription && (
            <p className="mt-4 text-red-500">
              Erreur : {errorCreateSubscription.message}
            </p>
          )}

          {dataCreateSubscription && (
            <p className="mt-4 text-green-500">Abonnement créé avec succès !</p>
          )}
        </div>

        {/* Plan Starter */}
        <div
          onClick={() => setSelectedPlan("Starter")}
          className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
            selectedPlan === "Starter"
              ? "border-indigo-600 ring-8 ring-indigo-600"
              : "border-gray-200"
          }`}
        >
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              Starter
              <span className="sr-only">Plan</span>
            </h2>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Gratuit
              </strong>
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> 1 annonce gratuite </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> 1GB de stockage </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Assistance par e-mail </span>
            </li>
          </ul>

          {/* <Button
            onClick={handleSubmit}
            disabled={loadingCreateSubscription}
            className="block px-12 py-3 mt-8 text-sm font-medium text-center text-indigo-600 transition duration-200 bg-white border border-indigo-600 rounded-full hover:bg-indigo-100 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          >
            {loadingCreateSubscription ? "Chargement..." : "Commencer"}
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
