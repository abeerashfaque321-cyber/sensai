"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EntryForm } from "./entry-form";
import { entriesToMarkdown } from "@/app/lib/helper";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent || "");

  const { control, register, watch } = useForm({
    defaultValues: {
      contactInfo: {
        name: "",
        email: "",
        mobile: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const formValues = watch();

  // 🔄 Generate preview
  useEffect(() => {
    const { summary, skills, experience, education, projects, contactInfo } =
      formValues;

    const content = [
      contactInfo?.name && `# ${contactInfo.name}`,
      (contactInfo?.email || contactInfo?.mobile) &&
        `📧 ${contactInfo.email || ""}   📱 ${contactInfo.mobile || ""}`,

      summary && `## Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience || [], "Experience"),
      entriesToMarkdown(education || [], "Education"),
      entriesToMarkdown(projects || [], "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");

    setPreviewContent(content);
  }, [formValues]);

  // ✅ PDF GENERATE
  const generatePDF = async () => {
    const element = document.getElementById("resume-pdf");

    if (!element) {
      toast.error("PDF content not found");
      return;
    }

    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "resume.pdf",
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-end">
        <Button onClick={generatePDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* FORM */}
        <TabsContent value="edit">
          <form className="space-y-4">
            <Input {...register("contactInfo.name")} placeholder="Full Name" />

            <Input {...register("contactInfo.email")} placeholder="Email" />

            <Input
              {...register("contactInfo.mobile")}
              placeholder="Contact Number"
            />

            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Summary" />
              )}
            />

            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Skills" />
              )}
            />

            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <EntryForm
                  type="Experience"
                  entries={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <EntryForm
                  type="Education"
                  entries={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="projects"
              control={control}
              render={({ field }) => (
                <EntryForm
                  type="Project"
                  entries={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </form>
        </TabsContent>

        {/* PREVIEW */}
        <TabsContent value="preview">
          <div className="p-4 border rounded">
            <pre className="whitespace-pre-wrap">{previewContent}</pre>
          </div>
        </TabsContent>
      </Tabs>

      {/* ✅ PDF CONTENT */}
      <div style={{ display: "none" }}>
        <div
          id="resume-pdf"
          style={{
            padding: "40px",
            fontFamily: "Arial, sans-serif",
            color: "#111",
            background: "#fff",
            lineHeight: "1.6",
          }}
        >
          <style>
            {`
              h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
                text-align: center;
              }

              h2 {
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 4px;
              }

              p {
                font-size: 14px;
                margin: 5px 0;
              }

              .contact {
                text-align: center;
                font-size: 14px;
                margin-bottom: 15px;
              }
            `}
          </style>

          <div
            dangerouslySetInnerHTML={{
              __html: previewContent
                .replace(/# (.*)/g, "<h1>$1</h1>")
                .replace(/## (.*)/g, "<h2>$1</h2>")
                .replace(/\n\n/g, "</p><p>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      </div>
    </div>
  );
}