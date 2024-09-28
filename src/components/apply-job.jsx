/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "L'expérience doit être d'au moins 0" })
    .int(),
  skills: z.string().min(1, { message: "Des compétences sont requises" }),
  education: z.enum(
    ["Bac +8", "Bac +5", "Bac +3e", "Bac +2", "Lycée", "Collége", "Autre"],
    {
      message: "Le niveau d'étude est requise",
    }
  ),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Seuls les documents PDF ou Word sont autorisés." }
    ),
});

export function ApplyJobDrawer({ user, job, fetchJob, applied = false }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen
            ? applied
              ? "Déjà postulé"
              : "Postuler"
            : "Annonce indisponible"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Postuler pour {job?.title} pour {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>
            Veuillez remplir le formulaire ci-dessous
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="number"
            placeholder="Années d'expérience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}
          <Input
            type="text"
            placeholder="Compétences (séparées par des virgules)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bac +8" id="Bac +8" />
                  <Label htmlFor="Bac +8">Bac +8</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bac +5" id="Bac +5" />
                  <Label htmlFor="Bac +5">Bac +5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bac +3" id="Bac +3" />
                  <Label htmlFor="Bac +3">Bac +3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bac +2" id="Bac +2" />
                  <Label htmlFor="Bac +2">Bac +2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Lycée" id="Lycée" />
                  <Label htmlFor="Lycée">Lycée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Collége" id="Collége" />
                  <Label htmlFor="Collége">Collége</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Autre" id="Autre" />
                  <Label htmlFor="Autre">Autre</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}
          {errorApply?.message && (
            <p className="text-red-500">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button type="submit" variant="blue" size="lg">
            Postuler
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
