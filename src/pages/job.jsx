import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-300 p-4 rounded-lg shadow-lg gap-4 sm:gap-8 w-full">
        {/* Section localisation */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPinIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm sm:text-base  text-blue-500">
            {job?.location}
          </span>
        </div>

        {/* Section candidats */}
        <div className="flex items-center gap-2 text-gray-700">
          <Briefcase className="w-5 h-5 text-green-500" />
          <span className="text-sm sm:text-base  text-green-500">
            {job?.applications?.length} Candidat(s)
          </span>
        </div>

        {/* Section disponibilité */}
        <div className="flex items-center gap-2 text-gray-700">
          {job?.isOpen ? (
            <>
              <DoorOpen className="w-5 h-5 text-green-500" />
              <span className="text-sm sm:text-base text-green-600">
                Disponible
              </span>
            </>
          ) : (
            <>
              <DoorClosed className="w-5 h-5 text-red-500" />
              <span className="text-sm sm:text-base text-red-600">
                Non disponible
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPage;
