import { getSingleSubscription } from "@/api/apiSubscription";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { UserIcon } from "lucide-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const UserProfilePage = () => {
  const { user, isLoaded } = useUser();

  const profileImageUrl = user?.imageUrl || "https://via.placeholder.com/100"; // Image par défaut

  const {
    loading: loadingSingleSubscription,
    data: SingleSubscription,
    fn: fnSingleSubscription,
  } = useFetch(getSingleSubscription, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded && user) {
      console.log("user", user);
      fnSingleSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  if (!isLoaded || loadingSingleSubscription) {
    // return (
    //   <div className="flex items-center justify-center h-screen">
    //     <BarLoader width={"100%"} color="#36d7b7" />
    //   </div>
    // );
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="max-w-lg px-6 py-12 mx-auto rounded-lg shadow-lg sm:px-8 bg-gray-50">
      <h1 className="pb-6 text-4xl font-bold text-center text-gray-800 sm:text-5xl">
        Mon Profil
      </h1>
      <div className="p-8 space-y-6 rounded-lg shadow-md">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-32 h-32 mx-auto mb-6 rounded-full shadow-md"
          />
        ) : (
          <UserIcon size={120} className="mx-auto mb-6 text-gray-400" />
        )}
        <div className="space-y-4 text-left">
          <p className="text-xl font-semibold text-gray-700">
            <span className="font-bold">Nom complet :</span> {user.fullName}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-bold">Email principal :</span>{" "}
            {user.primaryEmailAddress.emailAddress}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-bold">Date de création du compte :</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-bold">Dernière connexion :</span>{" "}
            {new Date(user.lastSignInAt).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-bold">Rôle :</span>{" "}
            {user?.unsafeMetadata?.role === "recruiter"
              ? "Recruteur"
              : "Candidat"}
          </p>

          {user?.unsafeMetadata?.role === "recruiter" ? (
            <>
              <p className="text-lg text-gray-600">
                <span className="font-bold">Abonnement :</span>{" "}
                {SingleSubscription?.plan_id === 2
                  ? "Vous avez un abonnement pro"
                  : "Vous n'avez pas d'abonnement"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-bold">Expire le :</span>{" "}
                {SingleSubscription?.end_date
                  ? new Date(SingleSubscription?.end_date).toLocaleDateString()
                  : "Non disponible"}
              </p>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
