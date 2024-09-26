import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center ">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Trouvez l'emploi de vos rêves.
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Afrique Avenir : Révélez votre potentiel, bâtissez l'Afrique de demain
          avec les meilleures opportunités d'emploi.
        </p>
      </section>
      <div className="flex flex-col gap-6 justify-center sm:flex-row">
        <Link to={"/jobs"}>
          <Button
            variant="blue"
            size="xl"
            className="w-full sm:w-auto py-3 px-6 text-sm sm:text-lg"
          >
            Trouver un emploi
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button
            variant="destructive"
            size="xl"
            className="w-full sm:w-auto py-3 px-6 text-sm sm:text-lg"
          >
            Publier un emploi
          </Button>
        </Link>
      </div>

      <img src="/banner.jpeg" className="w-full" />
    </main>
  );
};

export default LandingPage;
