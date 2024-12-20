import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  addNewSubscription,
  getSingleSubscription,
  updateSubscription,
} from "@/api/apiSubscription";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
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
import PlanCard from "@/components/PlanCard";
// import { PayPalButtons } from "@paypal/react-paypal-js";

const planIdMap = {
  Pro: 2, // ID du plan "Pro"
  Starter: 1, // ID du plan "Starter"
  // Ajoute d'autres plans si nécessaire
};

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro"); // Par défaut, le plan "Pro" est sélectionné
  const { user, isLoaded } = useUser();
  const navigate = useNavigate(); // Initialisation de useNavigate
  // const [showLimitAlert, setShowLimitAlert] = useState(false); // Pour afficher la modale de limite
  const [showAlreadySubscribed, setShowAlreadySubscribed] = useState(false); // Pour afficher la modale de limite
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Pour afficher la modale de succès
  const [showErrorAlert, setShowErrorAlert] = useState(false); // Pour afficher la modale d'erreur
  const [errorMessage, setErrorMessage] = useState(""); // Message d'erreur dynamique

  //Hook pour récupérer l'abonnement existant
  const {
    loading: loadingSingleSubscription,
    data: SingleSubscription,
    fn: fnSingleSubscription,
  } = useFetch(getSingleSubscription, {
    user_id: user?.id, // Assure-toi que l'utilisateur est défini
  });

  //De cette façon, fnSingleSubscription ne sera appelé que lorsque l'utilisateur est chargé
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

  // Hook pour la gestion de mise à jour d'abonnement
  // Hook for updating subscription (initializes even if `user_subscriptions_id` is initially unavailable)
  const {
    loading: loadingUpdateSubscription,
    error: errorUpdateSubscription,
    data: dataUpdateSubscription,
    fn: fnUpdateSubscription,
  } = useFetch(updateSubscription, {
    user_subscriptions_id: SingleSubscription?.id || null, // Initially pass null or undefined
  });

  // Pour afficher une seule modale en fonction de la situation
  useEffect(() => {
    if (SingleSubscription?.plan_id === 2 && !isSubscriptionExpired()) {
      setShowAlreadySubscribed(true); // Affiche la modale de "déjà abonné"
    } else if (
      (dataCreateSubscription?.length > 0 ||
        dataUpdateSubscription?.length > 0) &&
      !loadingCreateSubscription &&
      !loadingUpdateSubscription
    ) {
      setShowSuccessAlert(true); // Affiche la modale de succès si aucune autre condition ne s'applique
      fnSingleSubscription(); // Recharger les données de l'abonnement
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    SingleSubscription,
    dataCreateSubscription,
    loadingCreateSubscription,
    dataUpdateSubscription,
    loadingUpdateSubscription,
  ]);

  // Fonction pour vérifier si l'abonnement est expiré
  const isSubscriptionExpired = useCallback(() => {
    if (!SingleSubscription || !SingleSubscription.end_date) return true;
    const currentDate = new Date();
    const endDate = parseISO(SingleSubscription.end_date);
    return isAfter(currentDate, endDate);
  }, [SingleSubscription]);

  // Validation avant de soumettre le paiement via PayPal
  const canSubmit = useCallback(() => {
    if (!user || !isLoaded || loadingSingleSubscription) return false;
    if (
      SingleSubscription?.plan_id === planIdMap.Pro &&
      !isSubscriptionExpired()
    ) {
      setShowAlreadySubscribed(true); // Afficher la modale si déjà abonné au plan Pro
      return false;
    }
    return true;
  }, [
    user,
    isLoaded,
    loadingSingleSubscription,
    SingleSubscription,
    isSubscriptionExpired,
    setShowAlreadySubscribed,
  ]);

  // Fonction pour gérer la soumission de l'abonnement après le paiement
  const handleSubmit = useCallback(async () => {
    // Assurer que l'utilisateur est bien chargé
    if (!user || !user.id) {
      console.error("User not authenticated");
      return;
    }

    // Vérifier si l'utilisateur est éligible à la création d'un abonnement
    if (!canSubmit()) return;

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

    // console.log("user_id", user.id);
    // console.log("plan_id", planIdMap[selectedPlan]);
    // console.log("statusSubscription", statusSubscription);
    // console.log("startDate", startDate);
    // console.log("endDateISOString", endDateISOString);

    // Si l'abonnement existe mais est expiré, faites une mise à jour
    if (SingleSubscription && isSubscriptionExpired()) {
      try {
        console.log("UpdateSubscription");
        await fnUpdateSubscription({
          plan_id: planIdMap[selectedPlan],
          status_subscription: statusSubscription,
          start_date: startDate,
          end_date: endDateISOString,
          renewal_date: renewalDateISOString,
        });
        if (dataUpdateSubscription && dataUpdateSubscription.length > 0) {
          setShowSuccessAlert(true);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'abonnement:", error);
        setErrorMessage(
          error.message || "Erreur lors de la mise à jour de l'abonnement"
        );
        setShowErrorAlert(true);
      }
    } else {
      try {
        console.log("CreateSubscription");
        await fnCreateSubscription({
          user_id: user.id,
          plan_id: planIdMap[selectedPlan],
          status_subscription: statusSubscription,
          start_date: startDate,
          end_date: endDateISOString,
          renewal_date: renewalDateISOString,
        });

        if (dataCreateSubscription && dataCreateSubscription.length > 0) {
          setShowSuccessAlert(true);
        }
      } catch (error) {
        console.error("Erreur lors de la création de l'abonnement:", error);
        setErrorMessage(
          error.message || "Erreur lors de la création de l'abonnement"
        );
        setShowErrorAlert(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    canSubmit,
    SingleSubscription,
    selectedPlan,
    fnCreateSubscription,
    dataCreateSubscription,
    errorCreateSubscription,
    setErrorMessage,
    setShowErrorAlert,
  ]);

  const renderPlanCard = useMemo(
    // eslint-disable-next-line react/display-name
    () => (plan) => {
      return (
        <PlanCard
          key={plan}
          plan={plan}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          handleSubmit={handleSubmit}
          canSubmit={canSubmit}
          SingleSubscription={SingleSubscription}
          isSubscriptionExpired={isSubscriptionExpired}
        />
      );
    },
    [
      selectedPlan,
      canSubmit,
      handleSubmit,
      SingleSubscription,
      isSubscriptionExpired,
    ]
  );

  if (!isLoaded || loadingSingleSubscription) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
        {renderPlanCard("Pro")}
        {renderPlanCard("Starter")}
      </div>

      {/* Modale pour abonnement déjà actif */}
      <AlertDialog
        open={showAlreadySubscribed && !showSuccessAlert}
        onOpenChange={setShowAlreadySubscribed}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnement déjà actif</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez déjà un abonnement Pro actif jusqu&apos;au{" "}
              {new Date(SingleSubscription?.end_date).toLocaleDateString()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowAlreadySubscribed(false);
                navigate("/");
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale de succès */}
      <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnement Créé</AlertDialogTitle>
            <AlertDialogDescription>
              Votre abonnement Pro a été créé avec succès !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/userProfilePage")}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale d'erreur */}
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
            <AlertDialogAction onClick={() => setShowErrorAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PricingPage;
