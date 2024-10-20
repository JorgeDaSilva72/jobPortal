import { getSingleSubscription } from "@/api/apiSubscription";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { UserIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const UserProfilePage = () => {
  const { user, isLoaded } = useUser();

  const profileImageUrl = user?.imageUrl || "https://via.placeholder.com/100"; // Image par défaut

  const {
    loading: loadingSingleSubscription,
    data: SingleSubscription,
    error: errorSingleSubscription,
    fn: fnSingleSubscription,
  } = useFetch(getSingleSubscription, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded && user?.id) {
      fnSingleSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  if (!isLoaded || loadingSingleSubscription) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const isExpired = SingleSubscription?.end_date
    ? new Date(SingleSubscription.end_date) < new Date()
    : false;

  return (
    <div className="max-w-lg px-4 py-8 mx-auto rounded-lg shadow-lg sm:px-6 sm:py-12 md:max-w-2xl lg:max-w-4xl bg-gray-50">
      <h1 className="pb-4 text-2xl font-bold text-center text-gray-800 sm:text-4xl md:text-5xl">
        Mon Profil
      </h1>

      <div className="p-6 space-y-6 bg-white rounded-lg shadow-md md:p-8">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={`Photo de profil de ${user?.fullName}`}
            className="w-24 h-24 mx-auto mb-6 transition-all duration-300 rounded-full shadow-md sm:w-32 sm:h-32 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <UserIcon size={120} className="mx-auto mb-6 text-gray-400" />
        )}
        <div className="space-y-4 text-left">
          <p className="text-base font-semibold text-gray-700 sm:text-lg">
            <span className="font-bold">Nom complet :</span> {user?.fullName}
          </p>
          <p className="text-sm text-gray-600 sm:text-base">
            <span className="font-bold">Email principal :</span>{" "}
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          <p className="text-sm text-gray-600 sm:text-base">
            <span className="font-bold">Date de création du compte :</span>{" "}
            {new Date(user?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 sm:text-base">
            <span className="font-bold">Dernière connexion :</span>{" "}
            {new Date(user?.lastSignInAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 sm:text-base">
            <span className="font-bold">Rôle :</span>{" "}
            {user?.unsafeMetadata?.role === "recruiter"
              ? "Recruteur"
              : "Candidat"}
          </p>

          {user?.unsafeMetadata?.role === "recruiter" && (
            <>
              {errorSingleSubscription ? (
                <p className="text-sm text-red-500">
                  Une erreur s&apos;est produite lors de la récupération des
                  données de l&apos;abonnement:{" "}
                  {errorSingleSubscription.message}.
                </p>
              ) : SingleSubscription ? (
                <>
                  <p className="text-sm text-gray-600 sm:text-base">
                    <span className="font-bold">Abonnement : </span>
                    {SingleSubscription.plan_id === 2
                      ? "Vous avez un abonnement pro"
                      : "Vous n'avez pas d'abonnement"}
                  </p>
                  <p className="text-sm text-gray-600 sm:text-base">
                    <span className="font-bold">Expire le : </span>
                    {SingleSubscription.end_date
                      ? new Date(
                          SingleSubscription.end_date
                        ).toLocaleDateString()
                      : "Non disponible"}
                  </p>

                  {isExpired && (
                    <p className="text-sm text-red-500">
                      Votre abonnement a expiré.{" "}
                      <Link
                        to="/pricingPage"
                        className="inline-block px-4 py-2 ml-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Renouveler l&apos;abonnement
                      </Link>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600 sm:text-base">
                  <span className="font-bold">Abonnement : </span>
                  Vous n&apos;avez pas d&apos;abonnement.
                  <Link
                    to="/pricingPage"
                    className="inline-block px-4 py-2 ml-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Voir les abonnements
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

// import { getSingleSubscription } from "@/api/apiSubscription";
// import useFetch from "@/hooks/use-fetch";
// import { useUser } from "@clerk/clerk-react";
// import { UserIcon } from "lucide-react";
// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { BarLoader } from "react-spinners";

// const UserProfilePage = () => {
//   const { user, isLoaded } = useUser();

//   const profileImageUrl = user?.imageUrl || "https://via.placeholder.com/100"; // Image par défaut

//   const {
//     loading: loadingSingleSubscription,
//     data: SingleSubscription,
//     error: errorSingleSubscription,
//     fn: fnSingleSubscription,
//   } = useFetch(getSingleSubscription, {
//     user_id: user?.id,
//   });

//   useEffect(() => {
//     if (isLoaded && user) {
//       fnSingleSubscription(); // Récupère l'abonnement une fois que l'utilisateur est chargé
//     }
//   }, [user, isLoaded]);

//   if (!isLoaded || loadingSingleSubscription) {
//     return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
//   }

//   // skeleton loaders
//   {
//     /* {loadingSingleSubscription && (
//         <div className="animate-pulse">
//           <div className="w-24 h-24 mx-auto mb-6 bg-gray-300 rounded-full"></div>
//           <div className="space-y-4">
//             <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
//             <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
//           </div>
//         </div>
//       )} */
//   }

//   return (
//     <div className="max-w-lg px-4 py-8 mx-auto rounded-lg shadow-lg sm:px-6 sm:py-12 md:max-w-2xl lg:max-w-4xl bg-gray-50">
//       <h1 className="pb-4 text-2xl font-bold text-center text-gray-800 sm:text-4xl md:text-5xl">
//         Mon Profil
//       </h1>

//       <div className="p-6 space-y-6 bg-white rounded-lg shadow-md md:p-8">
//         {profileImageUrl ? (
//           <img
//             src={profileImageUrl}
//             alt={`Photo de profil de ${user?.fullName}`} // attributs ARIA pour améliorer l'accessibilité
//             className="w-24 h-24 mx-auto mb-6 transition-all duration-300 rounded-full shadow-md sm:w-32 sm:h-32 hover:scale-105"
//             loading="lazy"
//           />
//         ) : (
//           <UserIcon size={120} className="mx-auto mb-6 text-gray-400" />
//         )}
//         <div className="space-y-4 text-left">
//           <p className="text-base font-semibold text-gray-700 sm:text-lg">
//             <span className="font-bold">Nom complet :</span> {user?.fullName}
//           </p>
//           <p className="text-sm text-gray-600 sm:text-base">
//             <span className="font-bold">Email principal :</span>{" "}
//             {user?.primaryEmailAddress?.emailAddress}
//           </p>
//           <p className="text-sm text-gray-600 sm:text-base">
//             <span className="font-bold">Date de création du compte :</span>{" "}
//             {new Date(user?.createdAt).toLocaleDateString()}
//           </p>
//           <p className="text-sm text-gray-600 sm:text-base">
//             <span className="font-bold">Dernière connexion :</span>{" "}
//             {new Date(user?.lastSignInAt).toLocaleDateString()}
//           </p>
//           <p className="text-sm text-gray-600 sm:text-base">
//             <span className="font-bold">Rôle :</span>{" "}
//             {user?.unsafeMetadata?.role === "recruiter"
//               ? "Recruteur"
//               : "Candidat"}
//           </p>

//           {user?.unsafeMetadata?.role === "recruiter" && (
//             <>
//               {errorSingleSubscription ? (
//                 <p className="text-sm text-red-500">
//                   Une erreur s&apos;est produite lors de la récupération des
//                   données de l&apos;abonnement:{" "}
//                   {errorSingleSubscription.message}.
//                 </p>
//               ) : (
//                 <>
//                   {/* <p className="text-sm text-gray-600 sm:text-base">
//                     <span className="font-bold">Abonnement :</span>{" "}
//                     {SingleSubscription?.plan_id === 2
//                       ? "Vous avez un abonnement pro"
//                       : "Vous n'avez pas d'abonnement"}
//                   </p> */}
//                   <p className="text-sm text-gray-600 sm:text-base">
//                     <span className="font-bold">Abonnement :</span>{" "}
//                     {SingleSubscription?.plan_id === 2 ? (
//                       "Vous avez un abonnement pro"
//                     ) : (
//                       <>
//                         Vous n&apos;avez pas d&apos;abonnement.
//                         <Link
//                           to="/pricingPage"
//                           className="inline-block px-4 py-2 ml-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                         >
//                           Voir les abonnements
//                         </Link>
//                       </>
//                     )}
//                   </p>
//                   <p className="text-sm text-gray-600 sm:text-base">
//                     <span className="font-bold">Expire le :</span>{" "}
//                     {SingleSubscription?.end_date
//                       ? new Date(
//                           SingleSubscription?.end_date
//                         ).toLocaleDateString()
//                       : "Non disponible"}
//                   </p>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
