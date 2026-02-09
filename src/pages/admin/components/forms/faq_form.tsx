import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { toast } from "sonner";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";

const formSchema = z.object({
  id: z.number().optional(),
  productCode: z.string().optional(),
  faq: z.string().min(1, "FAQ is required"),
});

type FAQFormProps = {
  productCode: string;
  data?: {
    id: number;
    productCode: string;
    faq: string;
  };
};
export default function FAQForm({ productCode, data }: FAQFormProps) {
  const queryClient = useQueryClient();
  const { closeAlert } = useAlertDialog();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || undefined,
      productCode: productCode || data?.productCode || "",
      faq: data?.faq || "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      request(import.meta.env.VITE_API_URL, gql`
        mutation {
          createProductFaq (input:  {
            id: 0
            faq: "${input.faq}"
            productCode: "${productCode}"
          }) {
            faq
            productCode
          }
        }
        `),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("FAQ added successfully");
    },
    onError: () => {
      toast.error("Failed to add FAQ");
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutateAsync(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>

      <Label>FAQ:</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter FAQ"
        {...form.register("faq")}
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
