import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductVersion } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
import { api_url, file_url } from "@/api_url";

const formSchema = z.object({
  id: z.number().optional(),
  productCode: z.string().optional(),
  version: z.string().min(1, "Version name is required"),
  note: z.string().optional(),
  link: z.string().optional(),
});

type VersionFormProps = {
  productCode: string;
  data?: ProductVersion;
};
export default function VersionForm({ productCode, data }: VersionFormProps) {
  const queryClient = useQueryClient();
  const { closeAlert } = useAlertDialog();

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || undefined,
      productCode: productCode || data?.productCode || "",
      version: data?.version || "",
      note: data?.note || "",
      link: data?.link || undefined,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      request(api_url, gql`
        mutation {
            createProductVersion(input:  {
                id: 0
                productCode: "${input.productCode}"
                version: "${input.version}"
                link: "${input.link}"
                note: "${input.note}"
            }) {
                productCode
                version
            }
        }
        `),
    onSuccess: () => {
      form.reset();
      setSelectedFile(undefined);
      setFileUrl(undefined);
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Version created successfully");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });

  const { mutateAsync: fileUpload, isPending: isFileUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${file_url}/api/Files/upload`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },

    onSuccess: (data) => {
      form.setValue(
        "link",
        `${import.meta.env.VITE_FILE_URL}/api/Files/download/${data.id}`,
      );
    },

    onError: (error) => {
      console.error("File upload failed:", error);
      toast.error("Failed to upload file");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
    if (file) {
      setFileUrl(URL.createObjectURL(file));

      await fileUpload(file);
    } else {
      setFileUrl(undefined);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutateAsync(data);
  };

  const handleRemoveFile = () => {
    setSelectedFile(undefined);
    setFileUrl(undefined);
    form.setValue("link", undefined);
    // Optionally reset the file input value
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="relative mb-3">
        <input
          type="file"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
          accept="*"
        />

        {selectedFile && fileUrl ? (
          <div className="mt-2 text-center relative">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute right-2 top-2 bg-white/80 hover:bg-red-100 text-red-500 rounded-full w-7 h-7 flex items-center justify-center shadow border border-gray-200"
              aria-label="Remove file"
              title="Remove file"
            >
              ×
            </button>
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={fileUrl}
                alt="Preview"
                className="mx-auto mt-2 max-h-40 rounded"
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Open file
              </a>
            )}
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="flex justify-center items-center h-24 w-full rounded-md border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition"
          >
            <small>Click to upload</small>
          </label>
        )}
      </div>

      <Label>Version:</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter product version"
        {...form.register("version")}
      />

      <Label>Notes:</Label>
      <Textarea
        rows={3}
        placeholder="Enter notes"
        {...form.register("note")}
        className="mb-3"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isFileUploading}
        variant={isPending ? "outline" : "default"}
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
