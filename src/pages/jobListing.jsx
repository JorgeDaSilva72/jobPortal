import { useEffect, useState } from "react";

import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const JobListing = () => {
  // avant le hook useFetch()
  // const { session } = useSession();
  // const fetchJobs = async () => {
  //   const supabaseAccessToken = await session.getToken({
  //     template: "supabase",
  //   });
  //   const data = await getJobs(supabaseAccessToken);
  //   console.log(data);
  // };

  // useEffect(() => {
  //   fetchJobs();
  // }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  console.log(jobs);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Dernières annonces
      </h1>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Aucune offre d'emploi trouvée 😢
              </h2>
              <p className="text-gray-500 mb-6">
                Désolé, nous n'avons trouvé aucune offre correspondant à votre
                recherche.
              </p>
              <div className="flex gap-4">
                <Link to="/jobs">
                  <Button variant="blue" className="rounded-lg">
                    Parcourir les offres
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
