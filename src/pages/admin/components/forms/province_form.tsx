import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Province } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Province name is required"),
});

type ProvinceFormProps = {
  data?: Province;
};
export default function ProvinceForm({ data }: ProvinceFormProps) {
  const queryClient = useQueryClient();
  const { closeAlert } = useAlertDialog();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      request(
        import.meta.env.VITE_API_URL,
        gql`
          mutation {
            createProvince(input: { id: 0 name: "${input.name}" }) {
              name
            }
          }
        `,
      ),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      toast.success("Province created successfully");
    },
    onError: () => {
      toast.error("Failed to create province");
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutateAsync(data);
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Label>Province</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter province name"
        {...form.register("name")}
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
