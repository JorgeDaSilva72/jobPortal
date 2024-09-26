import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import companies from "../data/companies.json";

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
      <Carousel
        plugins={[
          Autoplay({
            delay: 1000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <img src="/banner.jpeg" className="w-full" />
    </main>
  );
};

export default LandingPage;
