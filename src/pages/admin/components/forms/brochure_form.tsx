import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductBrochure } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { toast } from "sonner";
import { useState } from "react";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";

const formSchema = z.object({
  id: z.number().optional(),
  productCode: z.string().optional(),
  title: z.string().min(1, "Version name is required"),
  link: z.string().optional(),
});

type BrochureFormProps = {
  productCode: string;
  data?: ProductBrochure;
};
export default function BrochureForm({ productCode, data }: BrochureFormProps) {
  const queryClient = useQueryClient();
  const { closeAlert } = useAlertDialog();

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || undefined,
      productCode: productCode || data?.productCode || "",
      title: data?.title   || "",
      link: data?.link || undefined,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      request(import.meta.env.VITE_API_URL, gql`
        mutation {
            createProductDownload(input:  {
                id: 0
                productCode: "${input.productCode}"
                title: "${input.title}"
                link: "${input.link}"
            }) {
                productCode
                title
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
        `${import.meta.env.VITE_FILE_URL}/api/Files/upload`,
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
    form.setValue("title", "");
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

      <Label>Brochure Name:</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter brochure name"
        {...form.register("title")}
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
