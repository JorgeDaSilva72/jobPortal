import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  // const [data, setData] = useState(undefined);
  const [data, setData] = useState(null);

  // const [loading, setLoading] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      const response = await cb(supabaseAccessToken, options, ...args);
      console.log("API response:", response); // Ajout d'un log pour voir la réponse
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error); // Log pour voir les erreurs
      setError(error);
      throw error; // Permet de gérer l'erreur dans handleSubmit
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
