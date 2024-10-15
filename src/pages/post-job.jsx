import { getCompanies } from "@/api/apiCompanies";
import { addNewJob, getMyJobs } from "@/api/apiJobs";
import { getSingleSubscription } from "@/api/apiSubscription";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { africanCountries } from "@/data/africanCountries";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isAfter, parseISO } from "date-fns";

// Schéma de validation
const schema = z.object({
  title: z.string().min(1, { message: "Le titre est obligatoire" }),
  description: z.string().min(1, { message: "La description est obligatoire" }),
  location: z.string().min(1, { message: "Sélectionnez un pays" }),
  company_id: z
    .string()
    .min(1, { message: "Sélectionnez ou ajoutez une nouvelle entreprise" }),
  requirements: z.string().min(1, { message: "Les exigences sont requises" }),
});

const PostJob = () => {
  const LIMIT_ANNONCE_PLAN_STARTER = 1;
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  // États pour gérer les alertes
  const [showExpiredSubscription, setShowExpiredSubscription] = useState(false); // Pour contrôler la modale d'aboonement expiré
  const [showLimitAlert, setShowLimitAlert] = useState(false); // Pour contrôler la modale de limite 1 annonce postée gratuite

  // Custom hooks pour les données API

  //Hook pour récupérer l'abonnement existant
  const {
    loading: loadingSingleSubscription,
    data: singleSubscription,
    fn: fetchSingleSubscription,
  } = useFetch(getSingleSubscription, { user_id: user?.id }); // Assure-toi que l'utilisateur est défini

  // Hook pour récupérer les annonces de l'utilisateur
  const {
    loading: loadingUserJobs,
    data: userJobs,
    fn: fetchUserJobs,
  } = useFetch(getMyJobs, { recruiter_id: user?.id });

  // Hook pour créer 1 annoncer
  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: createJob,
  } = useFetch(addNewJob);

  // Hook pour récupérer les nom d'entreprises
  const {
    loading: loadingCompanies,
    data: companies,
    fn: fetchCompanies,
  } = useFetch(getCompanies);

  // Fonction pour vérifier si l'abonnement est expiré
  const isSubscriptionExpired = useCallback(() => {
    if (!singleSubscription || !singleSubscription.end_date) return true;
    const currentDate = new Date();
    const endDate = parseISO(singleSubscription.end_date);
    return isAfter(currentDate, endDate);
  }, [singleSubscription]);

  // Optimisation pour éviter des appels répétés

  useEffect(() => {
    if (isLoaded && user) {
      fetchSingleSubscription();
      fetchUserJobs(); // Récupére les annonces déjà créées par l'utilisateur
      fetchCompanies();
    }
    // }, [isLoaded, user, fetchSingleSubscription, fetchUserJobs, fetchCompanies]);
  }, [isLoaded, user]);

  // const onSubmit = (data) => {
  //   // Vérifier si l'utilisateur est bien authentifié
  //   if (!user || !user.id) {
  //     console.error("User not authenticated");
  //     return;
  //   }
  //   // Assurer que l'utilisateur est bien chargé
  //   if (!isLoaded || !user) {
  //     console.error("L'utilisateur n'est pas encore chargé.");
  //     return;
  //   }

  //   // Vérifier si l'utilisateur n'a pas le plan Pro && a déjà publié une annonce
  //   if (
  //     !(SingleSubscription?.plan_id === 2) &&
  //     userJobs?.length >= LIMIT_ANNONCE_PLAN_STARTER
  //   ) {
  //     console.log(
  //       "L'utilisateur n'a pas le plan Pro et a déjà publié une annonce"
  //     );
  //     // setShowProAlert(true); // Afficher l'alerte
  //     setShowLimitAlert(true);
  //     return;
  //   }
  //   // Vérifier si l'utilisateur a déjà un abonnement Pro actif
  //   if (SingleSubscription?.plan_id === 2) {
  //     const expired = isSubscriptionExpired();
  //     if (expired) {
  //       console.log(
  //         "L'abonnement Pro est expiré.L'utilisateur doit prendre un nouvel abonnement"
  //       );

  //       setShowExpiredSubscription(true); // Afficher la modale d'abonnement expiré
  //       return;
  //     } else {
  //       console.log(
  //         "L'utilisateur a  un abonnement Pro actif. Il peut créer une annonce"
  //       );
  //     }
  //   }
  // };
  // Validation avant soumission
  const onSubmit = useCallback(
    (data) => {
      if (!user || !user.id) {
        console.error("User not authenticated");
        return;
      }

      if (!isLoaded) {
        console.error("L'utilisateur n'est pas encore chargé.");
        return;
      }

      if (
        !(singleSubscription?.plan_id === 2) &&
        userJobs?.length >= LIMIT_ANNONCE_PLAN_STARTER
      ) {
        setShowLimitAlert(true);
        return;
      }

      if (singleSubscription?.plan_id === 2 && isSubscriptionExpired()) {
        setShowExpiredSubscription(true);
        return;
      }

      createJob({
        ...data,
        recruiter_id: user.id,
        isOpen: true,
      });
    },
    [
      user,
      isLoaded,
      singleSubscription,
      userJobs,
      isSubscriptionExpired,
      createJob,
    ]
  );
  // // Vérifier si l'utilisateur a déjà publié une annonce
  // if (userJobs?.length >= LIMIT_ANNONCE_PLAN_STARTER) {
  //   console.log("L'utilisateur a déjà publié une annonce.", userJobs?.length);
  //   setShowLimitAlert(true); // Afficher l'alerte de limite d'annonces
  //   return;
  // }
  // fnCreateJob({
  //   ...data,
  //   recruiter_id: user.id,
  //   isOpen: true,
  // });

  // Après la créetion d'un job, je retourne à la page listing des jobs
  // useEffect(() => {
  //   if (dataCreateJob?.length > 0) navigate("/jobs");
  // }, [loadingCreateJob, dataCreateJob]);

  // Après la créetion d'un job, je retourne à la page listing des jobs
  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [dataCreateJob, navigate]);

  // useEffect(() => {
  //   if (isLoaded) {
  //     fnCompanies();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoaded]);

  // Memorisation pour les listes statiques
  const countryOptions = useMemo(
    () =>
      africanCountries.map((country) => (
        <SelectItem key={country} value={country}>
          {country}
        </SelectItem>
      )),
    []
  );

  // const companyOptions = useMemo(
  //   () =>
  //     companies?.map(({ name, id }) => (
  //       <SelectItem key={id} value={id}>
  //         {name}
  //       </SelectItem>
  //     )),
  //   [companies]
  // );

  if (
    loadingCompanies ||
    loadingUserJobs ||
    loadingSingleSubscription ||
    !isLoaded
  ) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // je protège la route.Uniquement les recruteurs ont le droit de publier une annonce.
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="pb-8 text-4xl font-extrabold text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
        Publier une offre d&apos;emploi
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Titre de l'annonce" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea
          placeholder="Description du poste"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex flex-col items-center w-full gap-4 sm:flex-row">
          {/* Sélection de la localisation */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{countryOptions}</SelectGroup>
                  {/* <SelectGroup>
                    {africanCountires.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectGroup> */}
                </SelectContent>
              </Select>
            )}
          />

          {/* Sélection de l'entreprise 1 ere version*/}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Entreprise">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Entreprise"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Sélection de l'entreprise 2 eme version*/}
          {/* <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{companyOptions}</SelectGroup>
                </SelectContent>
              </Select>
            )}
          /> */}

          {/* Bouton d'ajout d'entreprise */}
          {/* <AddCompanyDrawer fetchCompanies={fnCompanies} /> */}
          <AddCompanyDrawer fetchCompanies={fetchCompanies} />
        </div>

        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Publier
        </Button>
      </form>
      {/* Modal AlertDialog pour l'abonnement Pro */}
      <AlertDialog
        open={showExpiredSubscription}
        onOpenChange={setShowExpiredSubscription}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnement requis</AlertDialogTitle>
            <AlertDialogDescription>
              Votre abonnement a expiré le
              {/* {new Date(SingleSubscription?.end_date).toLocaleDateString()}. */}
              {new Date(singleSubscription?.end_date).toLocaleDateString()}.
              Vous devez souscrire de nouveau pour pouvoir publier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowExpiredSubscription(false)}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/pricingPage")}>
              Voir les abonnements
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal AlertDialog pour la limite d'annonces */}
      <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limite atteinte</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez déjà publié une annonce. Pour publier plus d&quot;une
              annonce, veuillez mettre à jour votre abonnement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLimitAlert(false)}>
              OK
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/pricingPage")}>
              Voir les abonnements
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostJob;
