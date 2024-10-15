import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NoJobsCreated = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-5 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg min-h-[300px]">
      <img
        // src="https://img.icons8.com/emoji/48/000000/eyes-emoji.png"
        src="eyes-emoji.png"
        alt="Emoji Yeux"
        className="mb-2 animate-bounce"
      />
      <p className="text-lg font-semibold">
        Aucune annonce d&apos;emploi créée
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Il semble que vous n&apos;ayez pas encore créé d&apos;annonce
        d&apos;emploi.
      </p>
      <Button
        variant="blue"
        size="lg"
        onClick={() => navigate("/post-job")} // Remplacez par la route correcte pour créer un job
        className="mt-4 text-white bg-blue-600"
      >
        Créer une annonce d&apos;emploi
      </Button>
    </div>
  );
};

export default NoJobsCreated;
