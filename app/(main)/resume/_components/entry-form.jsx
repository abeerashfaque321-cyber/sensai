"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"; // ✅ Controller added
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMM yyyy");
  } catch {
    return "";
  }
};

export function EntryForm({ type, entries = [], onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    control, // ✅ IMPORTANT
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleSubmit((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...(entries || []), formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved!");
    }
    if (improveError) {
      toast.error("Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) return toast.error("Enter description first");

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing Entries */}
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Title + Org */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Title" />
                  )}
                />
                {errors.title && (
                  <p className="text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Controller
                  name="organization"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Organization" />
                  )}
                />
                {errors.organization && (
                  <p className="text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Input type="month" {...field} />
                  )}
                />
                {errors.startDate && (
                  <p className="text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Input type="month" {...field} disabled={current} />
                  )}
                />
                {errors.endDate && (
                  <p className="text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={current}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) setValue("endDate", "");
                }}
              />
              <label>Current {type}</label>
            </div>

            {/* Description */}
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Description" />
                )}
              />
              {errors.description && (
                <p className="text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* AI */}
            <Button
              type="button"
              onClick={handleImproveDescription}
              disabled={isImproving}
            >
              {isImproving ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Improve with AI
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>

            <Button onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}