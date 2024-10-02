import CreatedApplications from "@/components/created-applications";
// import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();
  console.log("user", user);
  console.log("isLoaded", isLoaded);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="pb-4 text-4xl font-extrabold text-center gradient-title sm:text-6xl ">
        {user?.unsafeMetadata?.role === "candidate"
          ? "Mes candidatures"
          : "Mes annonces créées"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <h1 className="">CreatedJobs</h1>
        // <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;
