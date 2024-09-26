import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // const navigateUser = (currRole) => {
  //   navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  // };

  const navigateUser = useCallback(
    (currRole) => {
      navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
    },
    [navigate]
  );

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to: ${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  // useEffect(() => {
  //   if (user?.unsafeMetadata?.role) {
  //     navigateUser(user.unsafeMetadata.role);
  //   }
  // }, [user]);

  useEffect(() => {
    const userRole = user?.unsafeMetadata?.role;
    if (userRole) {
      navigateUser(userRole);
    }
  }, [user?.unsafeMetadata?.role, navigateUser]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20 sm:mt-40 px-4">
      <h2 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter text-center">
        Je suis un ...
      </h2>
      <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Button
          variant="blue"
          className="h-24 sm:h-36 text-xl sm:text-2xl rounded-lg shadow-lg transition-transform transform hover:scale-105"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidat
        </Button>
        <Button
          variant="destructive"
          className="h-24 sm:h-36 text-xl sm:text-2xl rounded-lg shadow-lg transition-transform transform hover:scale-105"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruteur
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
