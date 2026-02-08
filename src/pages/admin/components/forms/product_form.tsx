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
  id: z.coerce.number().optional(),
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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ 
      input, 
      mutation, 
      variables 
    }: { 
      input: z.infer<typeof formSchema>; 
      mutation: string;
      variables: Record<string, unknown>;
    }) =>
      await request(
        import.meta.env.VITE_API_URL,
        gql`${mutation}`,
        variables
      ),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success(`Product ${data ? "updated" : "created"} successfully`);
    },
    onError: () => {
      toast.error(`Failed to ${data ? "update" : "create"} product`);
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    const isUpdate = !!data;
    const mutationType = isUpdate ? "updateProduct" : "createProduct";
    
    const mutationQuery = isUpdate
      ? `mutation UpdateProduct($id: ID!, $input: ProductInput!) {
          ${mutationType}(id: $id, input: $input) {
            code
            description
            short
            title
          }
        }`
      : `mutation CreateProduct($input: ProductInput!) {
          ${mutationType}(input: $input) {
            code
            description
            short
            title
          }
        }`;
    
    const variables = isUpdate
      ? {
          id: values.id,
          input: {
            code: values.code,
            title: values.title,
            short: values.short,
            description: values.description,
          },
        }
      : {
          input: {
            code: values.code,
            title: values.title,
            short: values.short,
            description: values.description,
          },
        };
    
    await mutateAsync({ input: values, mutation: mutationQuery, variables });
  };

  return (
    <form
      id="product-form"
      onSubmit={form.handleSubmit(handleSubmit)}
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
        disabled={isPending}
        variant={isPending ? "outline" : "default"}
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
