/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

// transforme la première lettre d'une chaîne en majuscule et les suivantes en minuscules :
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Le nom de l'entreprise est obligatoire" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Seules les images png ou jpeg sont autorisées",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    // Capitaliser le premier caractère du nom de l'entreprise
    data.name = capitalizeFirstLetter(data.name);

    console.log(data);
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Ajouter une entreprise
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">
            Ajouter une nouvelle entreprise
          </DrawerTitle>
        </DrawerHeader>

        <form className="flex flex-col w-full gap-4 p-4 pb-0 sm:flex-row">
          {/* Company Name */}
          {/* <Input placeholder="Nom de l'entreprise" {...register("name")} /> */}
          {/* Nom de l'entreprise */}
          <div className="flex-1 w-full sm:w-auto">
            <Input
              placeholder="Nom de l'entreprise"
              {...register("name")}
              className="w-full"
            />
          </div>
          {/* Company Logo */}
          {/* <Input
            type="file"
            accept="image/*"
            className=" file:text-gray-500"
            {...register("logo")}
          /> */}
          {/* Logo de l'entreprise */}
          <div className="flex-1 w-full sm:w-auto">
            <Input
              type="file"
              accept="image/*"
              className="w-full file:text-gray-500"
              {...register("logo")}
            />
          </div>
          {/* Add Button */}
          {/* <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Ajouter
          </Button> */}
          {/* Bouton Ajouter */}
          <div className="w-full sm:w-auto">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="destructive"
              className="w-full sm:w-40"
            >
              Ajouter
            </Button>
          </div>
        </form>
        <DrawerFooter>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
