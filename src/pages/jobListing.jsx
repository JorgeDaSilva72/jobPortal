import { useEffect, useState } from "react";
import { getCompanies } from "@/api/apiCompanies";

import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
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
// import { Country } from "country-state-city";
import { Search, X } from "lucide-react";
import { africanCountries } from "@/data/africanCountries";
import NojobsFound from "@/components/NojobsFound";
import Pagination from "@/components/pagination";

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
  const [inputValue, setInputValue] = useState("");
  const { isLoaded } = useUser();

  // Ajout pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 2; // Nombre d'emplois par page

  // Liste des codes ISO des pays africains
  // const africanCountryCodes = [
  //   "DZ",
  //   "AO",
  //   "BJ",
  //   "BW",
  //   "BF",
  //   "BI",
  //   "CM",
  //   "CV",
  //   "CF",
  //   "TD",
  //   "KM",
  //   "CD",
  //   "DJ",
  //   "EG",
  //   "GQ",
  //   "ER",
  //   "SZ",
  //   "ET",
  //   "GA",
  //   "GM",
  //   "GH",
  //   "GN",
  //   "GW",
  //   "CI",
  //   "KE",
  //   "LS",
  //   "LR",
  //   "LY",
  //   "MG",
  //   "MW",
  //   "ML",
  //   "MR",
  //   "MU",
  //   "MA",
  //   "MZ",
  //   "NA",
  //   "NE",
  //   "NG",
  //   "RW",
  //   "ST",
  //   "SN",
  //   "SC",
  //   "SL",
  //   "SO",
  //   "ZA",
  //   "SS",
  //   "SD",
  //   "TZ",
  //   "TG",
  //   "TN",
  //   "UG",
  //   "EH",
  //   "ZM",
  //   "ZW",
  // ];

  // Récupérer tous les pays
  // const allCountries = Country.getAllCountries();

  // Filtrer uniquement les pays africains
  // const africanCountries = allCountries.filter((country) =>
  //   africanCountryCodes.includes(country.isoCode)
  // );
  // Extraire uniquement les noms des pays africains
  // const africanCountryNames = africanCountries.map((country) => country.name);

  // console.log(africanCountryNames);

  const {
    // loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
    page: currentPage,
    jobsPerPage: jobsPerPage,
  });

  // console.log(jobs);
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery, currentPage, jobsPerPage]);
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setInputValue("");
  };

  const handleClear = () => {
    setInputValue("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      {/* <h1 className="pb-8 text-4xl font-extrabold text-center gradient-title sm:text-5xl md:text-6xl lg:text-7xl">
        Dernières annonces
      </h1> */}

      <form
        onSubmit={handleSearch}
        className="flex flex-col items-center w-full h-16 gap-3 p-4 mb-4 rounded-lg shadow-lg sm:flex-row sm:gap-2"
      >
        <div className="relative flex-1 w-full">
          <Input
            type="text"
            placeholder="Rechercher des emplois par titre..."
            name="search-query"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 h-full px-4 py-2 transition duration-200 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute text-white transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="flex items-center justify-center w-full h-full px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-md sm:w-28 hover:bg-blue-600"
          variant="blue"
        >
          <Search className="w-5 h-5" />
        </Button>
      </form>

      <div className="flex flex-col gap-2 mt-8 sm:flex-row sm:mt-4">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {africanCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
              {/* {africanCountryNames.map((countryName) => {
                return (
                  <SelectItem key={countryName} value={countryName}>
                    {countryName}
                  </SelectItem>
                );
              })} */}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par société" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Effacer les filtres
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <>
          <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs?.data?.length ? (
              jobs?.data?.map((job) => {
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedInit={job?.saved?.length > 0}
                  />
                );
              })
            ) : (
              <NojobsFound />
              // <div className="flex flex-col items-center justify-center p-5 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg min-h-[300px]">
              //   <p className="text-lg font-semibold">
              //     Aucune offre d&apos;emploi trouvée 😢
              //   </p>
              //   <p className="mt-1 text-sm text-gray-500">
              //     Désolé, nous n&apos;avons trouvé aucune offre correspondant à
              //     votre recherche.
              //   </p>
              // </div>

              // <div className="flex flex-col items-center justify-center h-64 text-center">
              //   <h2 className="mb-4 text-2xl font-bold text-gray-700">
              //     Aucune offre d&apos;emploi trouvée 😢
              //   </h2>
              //   <p className="mb-6 text-gray-500">
              //     Désolé, nous n&apos;avons trouvé aucune offre correspondant à
              //     votre recherche.
              //   </p>
              //   {/* <div className="flex gap-4">
              //     <Link to="/jobs">
              //       <Button variant="blue" className="rounded-lg">
              //         Retour à l&apos;accueil
              //       </Button>
              //     </Link>
              //   </div> */}
              // </div>
            )}
          </div>
          {/* Pagination */}
          {jobs?.totalJobs > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination
                totalItems={jobs.totalJobs}
                itemsPerPage={jobsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)} // Met à jour la page
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListing;
