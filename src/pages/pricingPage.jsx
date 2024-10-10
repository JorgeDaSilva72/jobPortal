import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import {
  addNewSubscription,
  getSingleSubscription,
} from "@/api/apiSubscription";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { isAfter, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom"; // Import de useNavigate
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro"); // Par défaut, le plan "Pro" est sélectionné
  const { user, isLoaded } = useUser();
  const navigate = useNavigate(); // Initialisation de useNavigate
  const [showLimitAlert, setShowLimitAlert] = useState(false); // Pour afficher la modale de limite
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Pour afficher la modale de succès
  const [showErrorAlert, setShowErrorAlert] = useState(false); // Pour afficher la modale d'erreur
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur dynamique

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
    if (isLoaded && user) {
      fnSingleSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  // Hook pour la gestion de la création d'abonnement
  const {
    loading: loadingCreateSubscription,
    error: errorCreateSubscription,
    data: dataCreateSubscription,
    fn: fnCreateSubscription,
  } = useFetch(addNewSubscription);

  useEffect(() => {
    if (dataCreateSubscription?.success) {
      setShowLimitAlert(true); // Afficher la modale de succès
      fnSingleSubscription(); // Recharger les données de l'abonnement
    }
  }, [dataCreateSubscription]); // Déclencher la modale dès que la donnée est mise à jour

  // Fonction pour vérifier si l'abonnement est expiré
  const isSubscriptionExpired = () => {
    if (!SingleSubscription || !SingleSubscription.end_date) return true;
    const currentDate = new Date();
    const endDate = parseISO(SingleSubscription.end_date);
    return isAfter(currentDate, endDate);
  };

  // Fonction pour gérer la soumission de l'abonnement
  const handleSubmit = async () => {
    if (!user || !user.id) {
      console.error("User not authenticated");
      return;
    }
    // Assurer que l'utilisateur est bien chargé
    if (!isLoaded || !user) {
      console.error("L'utilisateur n'est pas encore chargé.");
      return;
    }

    // Vérifier si l'utilisateur a déjà un abonnement Pro actif
    if (SingleSubscription?.plan_id === 2) {
      const expired = isSubscriptionExpired();
      if (!expired) {
        console.log("L'utilisateur a déjà un abonnement Pro actif.");
        setShowLimitAlert(true); // Afficher la modale de limite
        return;
      } else {
        console.log(
          "L'abonnement Pro est expiré. Création d'un nouvel abonnement."
        );
      }
    }

    // Si l'utilisateur a un abonnement Starter et que son abonnement est expiré ou non
    if (SingleSubscription?.plan_id === 1) {
      const expired = isSubscriptionExpired();
      if (!expired && selectedPlan === "Pro") {
        console.log("L'utilisateur passe de Starter à Pro.");
        // Implémenter la logique de mise à jour ici si nécessaire
      } else if (expired && selectedPlan === "Pro") {
        console.log(
          "L'abonnement Starter est expiré. Création d'un abonnement Pro."
        );
        // Logique pour créer un nouvel abonnement Pro
      }
    }
    // Gérer les erreurs de l'abonnement existant
    if (SingleSubscription && !SingleSubscription.success) {
      console.error(SingleSubscription.message);
      setErrorMessage(SingleSubscription.message);
      setShowErrorAlert(true); // Afficher la modale d'erreur
      return;
    }
    // Si aucun abonnement actif n'est trouvé ou si l'abonnement est expiré, créez un nouvel abonnement
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

    try {
      await fnCreateSubscription({
        user_id: user.id,
        plan_id: planIdMap[selectedPlan],
        status_subscription: statusSubscription,
        start_date: startDate,
        end_date: endDateISOString,
        renewal_date: renewalDateISOString,
      });

      if (dataCreateSubscription?.success) {
        setShowLimitAlert(true); // Afficher la modale de succès
      } else {
        console.log("Erreur de création d'abonnement:", dataCreateSubscription);
        setErrorMessage(errorCreateSubscription.message);
        setShowErrorAlert(true); // Afficher la modale d'erreur
      }
      if (errorCreateSubscription) {
        setErrorMessage(errorCreateSubscription.message);
        setShowErrorAlert(true); // Afficher la modale d'erreur
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement:", error);
    }
    // Appeler la fonction de création d'abonnement
    // fnCreateSubscription({
    //   user_id: user.id, // Récupérer l'ID utilisateur
    //   plan_id: planIdMap[selectedPlan], // Utilise le plan sélectionné
    //   status_subscription: statusSubscription,
    //   start_date: startDate,
    //   end_date: endDateISOString,
    //   renewal_date: renewalDateISOString,
    // }).then(() => {
    //   if (dataCreateSubscription) {
    //     setShowSuccessAlert(true); // Afficher la modale de succès
    //   }
    //   if (errorCreateSubscription) {
    //     setErrorMessage(errorCreateSubscription.message);
    //     setShowErrorAlert(true); // Afficher la modale d'erreur
    //   }
    // });
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

          <Button
            onClick={handleSubmit}
            disabled={loadingCreateSubscription} // Désactiver pendant le chargement
            className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
          >
            {loadingCreateSubscription ? "Chargement..." : "Commencer"}
          </Button>

          {errorCreateSubscription && (
            <p className="mt-4 text-red-500">
              Erreur : {errorCreateSubscription.message}
            </p>
          )}

          {dataCreateSubscription && (
            <p className="mt-4 text-green-500">Abonnement créé avec succès !</p>
          )}

          {/* Indicateur de l'état de l'abonnement actuel */}
          {SingleSubscription && (
            <p className="mt-4 text-sm text-gray-600">
              {isSubscriptionExpired()
                ? "Votre abonnement actuel est expiré."
                : `Abonnement actif jusqu'au ${new Date(
                    SingleSubscription?.end_date
                  ).toLocaleDateString()}.`}
            </p>
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
      {/* Modale pour la limite d'abonnements actifs */}
      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnement Actif</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez déjà un abonnement Pro actif jusqu'au {}
              {new Date(SingleSubscription?.end_date).toLocaleDateString()}.
              Pour créer un nouvel abonnement, veuillez d'abord annuler votre
              abonnement actuel ou attendre son expiration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLimitAlert(false)}>
              Fermer
            </AlertDialogCancel>
            {/* Vous pouvez ajouter une action supplémentaire si nécessaire */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale pour le succès de création d'abonnement */}
      <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnement Créé</AlertDialogTitle>
            <AlertDialogDescription>
              Votre abonnement Pro a été créé avec succès !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSuccessAlert(false)}>
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale pour les erreurs lors de la création d'abonnement */}
      <AlertDialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Erreur</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage ||
                "Une erreur s'est produite lors de la création de votre abonnement."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorAlert(false)}>
              Fermer
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PricingPage;
