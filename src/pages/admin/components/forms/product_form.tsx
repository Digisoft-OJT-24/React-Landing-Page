import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import request, { gql } from "graphql-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Product code is required"),
  title: z.string().min(1, "Product name is required"),
  short: z.string().optional(),
  description: z.string().optional(),
});

type ProductFormProps = {
  data?: Product;
  className?: string;
};
export default function ProductForm({ data, className }: ProductFormProps) {
  const queryClient = useQueryClient();
  const { closeAlert } = useAlertDialog();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || undefined,
      code: data?.code || "",
      title: data?.title || "",
      short: data?.short || "",
      description: data?.description || "",
    },
  });

  useEffect(() => {
    form.reset({
      id: data?.id || undefined,
      code: data?.code || "",
      title: data?.title || "",
      short: data?.short || "",
      description: data?.description || "",
    });
  }, [data, form]);

  const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      await request(
        import.meta.env.VITE_API_URL,
        gql`
          mutation {
            createProduct(input: {
              id: 0,
              code: "${input.code}",
              title: "${input.title}",
              short: "${input.short}",
              description: "${input.description}"
            }) {
              code
              description
              short
              title
            }
          }
        `,
      ),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Product created successfully");
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });

  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      await request(
        import.meta.env.VITE_API_URL,
        gql`
          mutation {
            updateProduct(id: ${input.id} input: {  
            id: ${input.id},
              code: "${input.code}",
              title: "${input.title}",
              short: "${input.short}",
              description: "${input.description}"
            }) {
              code
              description
              short
              title
            }
          }
        `,
      ),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });

  const handelSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data?.id) {
      await updateProduct(data);
    } else {
      await createProduct(data);
    }
  };

  return (
    <form
      id="product-form"
      onSubmit={form.handleSubmit(handelSubmit)}
      className={`w-full ${className}`}
    >
      {!data && (
        <>
          <Label>Product Code</Label>
          <Input
            type="text"
            className="mb-3"
            placeholder="Enter product code"
            {...form.register("code")}
          />
        </>
      )}

      <Label>Product Name</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter product name"
        {...form.register("title")}
      />

      <Label>Product Short</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter product short description"
        {...form.register("short")}
      />

      <Label>Product Description</Label>
      <Textarea
        className="mb-3"
        placeholder="Enter product description"
        {...form.register("description")}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isCreating || isUpdating}
        variant={isCreating || isUpdating ? "outline" : "default"}
      >
        {isCreating || isUpdating ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
