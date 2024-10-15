import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  // ancienne version

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  //  Amélioration et si la fonction fnSavedJobs est stable et ne change pas, tu peux utiliser le hook useCallback pour mémoriser la fonction et ainsi éviter des appels inutiles à l'API.
  // useEffect(() => {
  //   if (isLoaded) {
  //     fnSavedJobs();
  //   }
  // }, [isLoaded, fnSavedJobs]);

  // if (!isLoaded || loadingSavedJobs) {
  //   return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  // }

  //  Amélioration : Dans le cas précedent le BarLoader est affiché tant que !isLoaded ou loadingSavedJobs. Cela signifie que le loader sera visible même si l'API est en train de charger les emplois, mais aussi si l'utilisateur n'est pas encore chargé.
  if (!isLoaded) {
    return <div>Chargement des informations utilisateur...</div>;
  }

  if (loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="pb-8 text-4xl font-extrabold text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
        Emplois sauvegardés
      </h1>

      {loadingSavedJobs === false && (
        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-5 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg min-h-[300px]">
              <img
                // src="https://img.icons8.com/emoji/48/000000/eyes-emoji.png"
                src="eyes-emoji.png"
                alt="Emoji Yeux"
                className="mb-2 animate-bounce"
              />
              <p className="text-lg font-semibold">Aucun emploi sauvegardé</p>
              <p className="mt-1 text-sm text-gray-500">
                Commencez à sauvegarder des emplois pour les voir ici !
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
