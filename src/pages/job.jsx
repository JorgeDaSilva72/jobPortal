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
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import MDEditor from "@uiw/react-md-editor";

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

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse items-center justify-center gap-6">
        <h1 className="pb-3 text-4xl font-extrabold text-center gradient-title md:text-left sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex flex-col items-center justify-between w-full gap-4 p-4 bg-gray-300 rounded-lg shadow-lg sm:flex-row sm:gap-8">
        {/* Section localisation */}
        <div className="flex items-center gap-2 text-gray-700">
          <MapPinIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-blue-500 sm:text-base">
            {job?.location}
          </span>
        </div>

        {/* Section candidats */}
        <div className="flex items-center gap-2 text-gray-700">
          <Briefcase className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-500 sm:text-base">
            {job?.applications?.length} Candidat(s)
          </span>
        </div>

        {/* Section disponibilité */}
        <div className="flex items-center gap-2 text-gray-700">
          {job?.isOpen ? (
            <>
              <DoorOpen className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 sm:text-base">
                Disponible
              </span>
            </>
          ) : (
            <>
              <DoorClosed className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600 sm:text-base">
                Non disponible
              </span>
            </>
          )}
        </div>
      </div>

      {/* hiring status */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Statut de l'annonce :" +
                (job?.isOpen ? " Disponible" : " Non disponible")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Disponible</SelectItem>
            <SelectItem value="closed">Non disponible</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Section description */}
      <h2 className="text-2xl font-bold sm:text-3xl">À propos du poste</h2>
      <p className="sm:text-lg">{job?.description}</p>

      {/* Section requirements */}
      <h2 className="text-2xl font-bold sm:text-3xl">
        Ce que nous recherchons :
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg" // add global ul styles in index.css
      />
    </div>
  );
};

export default JobPage;
