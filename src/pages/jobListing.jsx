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
import { State } from "country-state-city";
import { Country } from "country-state-city";
import { Search } from "lucide-react";

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
  const africanCountryCodes = [
    "DZ",
    "AO",
    "BJ",
    "BW",
    "BF",
    "BI",
    "CM",
    "CV",
    "CF",
    "TD",
    "KM",
    "CD",
    "DJ",
    "EG",
    "GQ",
    "ER",
    "SZ",
    "ET",
    "GA",
    "GM",
    "GH",
    "GN",
    "GW",
    "CI",
    "KE",
    "LS",
    "LR",
    "LY",
    "MG",
    "MW",
    "ML",
    "MR",
    "MU",
    "MA",
    "MZ",
    "NA",
    "NE",
    "NG",
    "RW",
    "ST",
    "SN",
    "SC",
    "SL",
    "SO",
    "ZA",
    "SS",
    "SD",
    "TZ",
    "TG",
    "TN",
    "UG",
    "EH",
    "ZM",
    "ZW",
  ];

  // Récupérer tous les pays
  const allCountries = Country.getAllCountries();

  // Filtrer uniquement les pays africains
  const africanCountries = allCountries.filter((country) =>
    africanCountryCodes.includes(country.isoCode)
  );
  // Extraire uniquement les noms des pays africains
  const africanCountryNames = africanCountries.map((country) => country.name);

  console.log(africanCountryNames);

  const {
    // loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  console.log(jobs);

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
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center pb-8">
        Dernières annonces
      </h1>

      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-col sm:flex-row w-full gap-3 sm:gap-2 items-center mb-4 p-4 shadow-lg rounded-lg"
      >
        <Input
          type="text"
          placeholder="Rechercher des emplois par titre..."
          name="search-query"
          className="h-full flex-1 px-4 py-2 text-md border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        />
        <Button
          type="submit"
          className="h-full w-full sm:w-28 bg-blue-500 text-white rounded-md px-4 py-2 flex items-center justify-center hover:bg-blue-600 transition duration-200"
          variant="blue"
        >
          <Search className="w-5 h-5" />
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 mt-8 sm:mt-4">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {africanCountryNames.map((countryName) => {
                return (
                  <SelectItem key={countryName} value={countryName}>
                    {countryName}
                  </SelectItem>
                );
              })}
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
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Aucune offre d&apos;emploi trouvée 😢
              </h2>
              <p className="text-gray-500 mb-6">
                Désolé, nous n&apos;avons trouvé aucune offre correspondant à
                votre recherche.
              </p>
              <div className="flex gap-4">
                <Link to="/">
                  <Button variant="blue" className="rounded-lg">
                    Retour à l&apos;accueil
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
