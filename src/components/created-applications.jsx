import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (!applications || applications.length === 0) {
    return <NoApplications />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

const NoApplications = () => (
  <div className="flex flex-col items-center justify-center p-6 text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-lg min-h-[300px] w-full max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
    <Inbox size={48} className="mb-4 text-gray-400" />
    <h2 className="text-xl font-bold text-center">
      Aucune candidature trouvée
    </h2>
    <p className="max-w-xs mt-2 text-sm text-center text-gray-500">
      Vous n&apos;avez pas encore soumis de candidatures. Commencez à postuler
      pour voir vos candidatures ici.
    </p>
    <Link
      to="/jobs"
      // className="px-4 py-2 mt-6 text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <button className="px-4 py-2 mt-6 text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Chercher des emplois
      </button>
    </Link>
  </div>
);

export default CreatedApplications;
