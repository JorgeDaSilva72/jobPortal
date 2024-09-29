import { useEffect, useState } from "react";
import { getCompanies } from "@/api/apiCompanies";

import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
import { Link } from "react-router-dom";
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
import { Search } from "lucide-react";
import { africanCountires } from "@/data/africanCountries";

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
  const { isLoaded } = useUser();

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
  }, [isLoaded, location, company_id, searchQuery]);
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
        <Input
          type="text"
          placeholder="Rechercher des emplois par titre..."
          name="search-query"
          className="flex-1 h-full px-4 py-2 transition duration-200 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
              {africanCountires.map((country) => (
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
        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-700">
                Aucune offre d&apos;emploi trouvée 😢
              </h2>
              <p className="mb-6 text-gray-500">
                Désolé, nous n&apos;avons trouvé aucune offre correspondant à
                votre recherche.
              </p>
              {/* <div className="flex gap-4">
                <Link to="/jobs">
                  <Button variant="blue" className="rounded-lg">
                    Retour à l&apos;accueil
                  </Button>
                </Link>
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
