import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  addNewSubscription,
  getSingleSubscription,
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

const PricingPage = () => {
  console.log("Rendering PricingPage"); // Log ajouté
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

  useEffect(() => {
    if (isLoaded && user) {
      fnSingleSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  //De cette façon, fnSingleSubscription ne sera appelé que lorsque l'utilisateur est chargé et que les données ne sont pas déjà en train de se charger.
  // useEffect(() => {
  //   if (isLoaded && user && !loadingSingleSubscription) {
  //     fnSingleSubscription();
  //   }
  // }, [isLoaded, user, loadingSingleSubscription]); // Ajoutez 'loadingSingleSubscription' comme dépendance

  // Hook pour la gestion de la création d'abonnement
  const {
    loading: loadingCreateSubscription,
    error: errorCreateSubscription,
    data: dataCreateSubscription,
    fn: fnCreateSubscription,
  } = useFetch(addNewSubscription);

  // useEffect(() => {
  //   if (dataCreateSubscription?.success) {
  //     setShowLimitAlert(true); // Afficher la modale de succès
  //     fnSingleSubscription(); // Recharger les données de l'abonnement
  //   }
  // }, [dataCreateSubscription]); // Déclencher la modale dès que la donnée est mise à jour

  useEffect(() => {
    if (dataCreateSubscription?.success && !loadingCreateSubscription) {
      setShowSuccessAlert(true); // Afficher la modale de succès
      fnSingleSubscription(); // Recharger les données de l'abonnement
    }
  }, [dataCreateSubscription, loadingCreateSubscription]); // Ajoutez une condition supplémentaire

  // Fonction pour vérifier si l'abonnement est expiré
  // const isSubscriptionExpired = () => {
  //   if (!SingleSubscription || !SingleSubscription.end_date) return true;
  //   const currentDate = new Date();
  //   const endDate = parseISO(SingleSubscription.end_date);
  //   return isAfter(currentDate, endDate);
  // };

  // Fonction pour vérifier si l'abonnement est expiré
  const isSubscriptionExpired = useCallback(() => {
    if (!SingleSubscription || !SingleSubscription.end_date) return true;
    const currentDate = new Date();
    const endDate = parseISO(SingleSubscription.end_date);
    return isAfter(currentDate, endDate);
  }, [SingleSubscription]);

  // Validation avant de soumettre le paiement via PayPal
  // const canSubmit = () => {
  //   if (!user || !isLoaded || loadingSingleSubscription) return false;

  //   if (SingleSubscription?.plan_id === 2 && !isSubscriptionExpired()) {
  //     setShowLimitAlert(true); // Afficher la modale si déjà abonné au plan Pro
  //     return false;
  //   }

  //   return true; // Peut soumettre le paiement
  // };

  // Validation avant de soumettre le paiement via PayPal
  const canSubmit = useCallback(() => {
    if (!user || !isLoaded || loadingSingleSubscription) return false;
    if (SingleSubscription?.plan_id === 2 && !isSubscriptionExpired()) {
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
    if (!user || !user.id) {
      console.error("User not authenticated");
      return;
    }

    // Vérifier si l'utilisateur est éligible à la création d'un abonnement
    if (!canSubmit()) return;

    // Assurer que l'utilisateur est bien chargé
    // if (!isLoaded || !user) {
    //   console.error("L'utilisateur n'est pas encore chargé.");
    //   return;
    // }

    // Vérifier si l'utilisateur a déjà un abonnement Pro actif
    // if (SingleSubscription?.plan_id === 2) {
    //   const expired = isSubscriptionExpired();
    //   if (!expired) {
    //     console.log("L'utilisateur a déjà un abonnement Pro actif.");
    //     setShowLimitAlert(true); // Afficher la modale de limite
    //     return;
    //   } else {
    //     console.log(
    //       "L'abonnement Pro est expiré. Création d'un nouvel abonnement."
    //     );
    //   }
    // }

    // Si l'utilisateur a un abonnement Starter et que son abonnement est expiré ou non
    // if (SingleSubscription?.plan_id === 1) {
    //   const expired = isSubscriptionExpired();
    //   if (!expired && selectedPlan === "Pro") {
    //     console.log("L'utilisateur passe de Starter à Pro.");
    //     // Implémenter la logique de mise à jour ici si nécessaire
    //   } else if (expired && selectedPlan === "Pro") {
    //     console.log(
    //       "L'abonnement Starter est expiré. Création d'un abonnement Pro."
    //     );
    //     // Logique pour créer un nouvel abonnement Pro
    //   }
    // }
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
        setShowSuccessAlert(true); // Afficher la modale de succès
      } else {
        console.log(
          "Erreur lors de la création d'abonnement:",
          dataCreateSubscription
        );
        setErrorMessage(
          errorCreateSubscription?.message || "An error occurred"
        );
        setShowErrorAlert(true); // Afficher la modale d'erreur
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement:", error);
      setErrorMessage("Erreur lors de la création de l'abonnement");
      setShowErrorAlert(true);
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
  }, [
    user,
    canSubmit,
    SingleSubscription,
    selectedPlan,
    fnCreateSubscription,
    dataCreateSubscription,
    errorCreateSubscription,
    // setShowLimitAlert,
    setErrorMessage,
    setShowErrorAlert,
  ]);

  // if (!isLoaded || loadingSingleSubscription) {
  //   return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  // }

  // const renderPlanCard = useMemo(
  //   // eslint-disable-next-line react/display-name
  //   () => (plan) => {
  //     console.log(`Rendu de la carte pour le plan: ${plan}`);
  //     const isPro = plan === "Pro";
  //     return (
  //       <div
  //         key={plan} // Cela aide React à identifier quels éléments ont changé, ont été ajoutés ou supprimés.
  //         onClick={() => setSelectedPlan(plan)}
  //         className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
  //           selectedPlan === plan
  //             ? "border-indigo-600 ring-8 ring-indigo-600"
  //             : "border-gray-200"
  //         }`}
  //       >
  //         <div className="text-center">
  //           <h2 className="text-lg font-medium text-gray-900">
  //             {plan}
  //             <span className="sr-only">Plan</span>
  //           </h2>
  //           <p className="mt-2 sm:mt-4">
  //             <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
  //               {isPro ? "30 FCFA" : "Gratuit"}
  //             </strong>
  //             {isPro && (
  //               <span className="text-sm font-medium text-gray-700">/mois</span>
  //             )}
  //           </p>
  //         </div>
  //         <ul className="mt-6 space-y-2">
  //           {isPro ? (
  //             <>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">Annonces illimitées</span>
  //               </li>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">5GB de stockage</span>
  //               </li>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">Assistance par e-mail</span>
  //               </li>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">Assistance téléphonique</span>
  //               </li>
  //             </>
  //           ) : (
  //             <>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">1 annonce gratuite</span>
  //               </li>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">1GB de stockage</span>
  //               </li>
  //               <li className="flex items-center gap-2">
  //                 <Check className="w-5 h-5 text-indigo-700" />
  //                 <span className="text-gray-700">Assistance par e-mail</span>
  //               </li>
  //             </>
  //           )}
  //         </ul>
  //         {isPro && (
  //           <PayPalButton
  //             style={{ layout: "horizontal" }}
  //             amount="30.00"
  //             onPaymentSuccess={handleSubmit}
  //             disabled={!canSubmit()}
  //             className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
  //           />
  //         )}
  //         {SingleSubscription && (
  //           <p className="mt-4 text-sm text-gray-600">
  //             {isSubscriptionExpired()
  //               ? "Votre abonnement actuel est expiré."
  //               : `Abonnement actif jusqu'au ${new Date(
  //                   SingleSubscription?.end_date
  //                 ).toLocaleDateString()}.`}
  //           </p>
  //         )}
  //       </div>
  //     );
  //   },
  //   [
  //     selectedPlan,
  //     canSubmit,
  //     handleSubmit,
  //     SingleSubscription,
  //     isSubscriptionExpired,
  //   ]
  // );

  const renderPlanCard = useMemo(
    // eslint-disable-next-line react/display-name
    () => (plan) => {
      console.log(`Rendu de la carte pour le plan: ${plan}`);
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

      <AlertDialog
        open={showAlreadySubscribed}
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
                setShowAlreadySubscribed(false); // Fermer l'alerte
                navigate("/"); // Rediriger vers l'accueil
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
// return (
//   <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
//       {/* Plan Pro */}
//       <div
//         onClick={() => setSelectedPlan("Pro")}
//         className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
//           selectedPlan === "Pro"
//             ? "border-indigo-600 ring-8 ring-indigo-600"
//             : "border-gray-200"
//         }`}
//       >
//         <div className="text-center">
//           <h2 className="text-lg font-medium text-gray-900">
//             Pro
//             <span className="sr-only">Plan</span>
//           </h2>

//           <p className="mt-2 sm:mt-4">
//             <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
//               30 FCFA{" "}
//             </strong>
//             <span className="text-sm font-medium text-gray-700">/mois</span>
//           </p>
//         </div>
//         <ul className="mt-6 space-y-2">
//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> Annonces illimitées </span>
//           </li>

//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> 5GB de stockage </span>
//           </li>

//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> Assistance par e-mail </span>
//           </li>

//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> Assistance téléphonique </span>
//           </li>
//         </ul>
//         {/* <Button
//           onClick={handleSubmit}
//           disabled={loadingCreateSubscription} // Désactiver pendant le chargement
//           className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
//         > */}
//         {/* {loadingCreateSubscription ? "Chargement..." : "Commencer"} */}
//         {/* <PayPalButtons
//           style={{ layout: "horizontal" }}
//           disabled={loadingCreateSubscription} // Désactiver pendant le chargement
//           onApprove={handleSubmit}
//           className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
//           createOrder={(data, action) => {
//             return action.order.create({
//               purchase_units: [
//                 {
//                   amount: {
//                     value: 30,
//                     // Montant que tu veux facturer
//                     currency_code: "USD",
//                   },
//                 },
//               ],
//             });
//           }}
//         /> */}
//         {/* </Button> */}
//         <PayPalButton
//           amount="30.00" // Montant du paiement
//           onPaymentSuccess={handleSubmit}
//           disabled={!canSubmit()} // Désactiver si l'utilisateur ne peut pas soumettre
//           className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
//         />

//         {errorCreateSubscription && (
//           <p className="mt-4 text-red-500">
//             Erreur : {errorCreateSubscription.message}
//           </p>
//         )}
//         {dataCreateSubscription && (
//           <p className="mt-4 text-green-500">Abonnement créé avec succès !</p>
//         )}
//         {/* Indicateur de l'état de l'abonnement actuel */}
//         {SingleSubscription && (
//           <p className="mt-4 text-sm text-gray-600">
//             {isSubscriptionExpired()
//               ? "Votre abonnement actuel est expiré."
//               : `Abonnement actif jusqu'au ${new Date(
//                   SingleSubscription?.end_date
//                 ).toLocaleDateString()}.`}
//           </p>
//         )}
//       </div>

//       {/* Plan Starter */}
//       <div
//         onClick={() => setSelectedPlan("Starter")}
//         className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
//           selectedPlan === "Starter"
//             ? "border-indigo-600 ring-8 ring-indigo-600"
//             : "border-gray-200"
//         }`}
//       >
//         <div className="text-center">
//           <h2 className="text-lg font-medium text-gray-900">
//             Starter
//             <span className="sr-only">Plan</span>
//           </h2>

//           <p className="mt-2 sm:mt-4">
//             <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
//               Gratuit
//             </strong>
//           </p>
//         </div>

//         <ul className="mt-6 space-y-2">
//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> 1 annonce gratuite </span>
//           </li>

//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> 1GB de stockage </span>
//           </li>

//           <li className="flex items-center gap-2">
//             <Check className="w-5 h-5 text-indigo-700" />
//             <span className="text-gray-700"> Assistance par e-mail </span>
//           </li>
//         </ul>

//         {/* <Button
//           onClick={handleSubmit}
//           disabled={loadingCreateSubscription}
//           className="block px-12 py-3 mt-8 text-sm font-medium text-center text-indigo-600 transition duration-200 bg-white border border-indigo-600 rounded-full hover:bg-indigo-100 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
//         >
//           {loadingCreateSubscription ? "Chargement..." : "Commencer"}
//         </Button> */}
//       </div>
//     </div>
//     {/* Modale pour la limite d'abonnements actifs */}
//     <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Abonnement déjà actif</AlertDialogTitle>
//           <AlertDialogDescription>
//             Vous avez déjà un abonnement Pro actif jusqu&apos;au {}
//             {new Date(SingleSubscription?.end_date).toLocaleDateString()}.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogAction onClick={() => setShowLimitAlert(false)}>
//             OK
//           </AlertDialogAction>
//           {/* Vous pouvez ajouter une action supplémentaire si nécessaire */}
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>

//     {/* Modale pour le succès de création d'abonnement */}
//     <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Abonnement Créé</AlertDialogTitle>
//           <AlertDialogDescription>
//             Votre abonnement Pro a été créé avec succès !
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogAction onClick={() => navigate("/userProfilePage")}>
//             OK
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>

//     {/* Modale pour les erreurs lors de la création d'abonnement */}
//     <AlertDialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Erreur</AlertDialogTitle>
//           <AlertDialogDescription>
//             {errorMessage ||
//               "Une erreur s'est produite lors de la création de votre abonnement."}
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogAction onClick={() => setShowErrorAlert(false)}>
//             OK
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   </div>
// );
