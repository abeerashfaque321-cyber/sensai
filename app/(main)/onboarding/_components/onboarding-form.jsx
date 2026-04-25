"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import useFetch from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";

const OnboardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: "",
      subIndustry: "",
      experience: "",
      skills: "",
      bio: "",
    },
  });

  const watchIndustry = watch("industry");

  // ✅ Redirect after success
  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile Created!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, router]);

  const onSubmit = async (values) => {
    try {
      // ✅ IMPORTANT FIX (no formatting)
      const formattedIndustry = values.industry;

      const skillArray = values.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
        skills: skillArray,
        experience: Number(values.experience),
      });
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg mt-10">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Setup your career dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Industry */}
            <div className="space-y-2">
              <Label>Industry</Label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      setSelectedIndustry(
                        industries.find((i) => i.name === v)
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>

                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind.id} value={ind.name}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.industry && (
                <p className="text-red-500 text-sm">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Specialization */}
            {watchIndustry && (
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Controller
                  name="subIndustry"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>

                      <SelectContent>
                        {selectedIndustry?.subIndustries.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subIndustry && (
                  <p className="text-red-500 text-sm">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label>Experience (Years)</Label>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="e.g. 3"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="React, Python, SQL"
                    {...field}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-red-500 text-sm">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>Bio</Label>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Tell us about yourself"
                    {...field}
                  />
                )}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              disabled={updateLoading}
              type="submit"
              className="w-full"
            >
              {updateLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;