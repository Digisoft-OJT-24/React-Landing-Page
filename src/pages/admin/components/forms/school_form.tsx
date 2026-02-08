import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "School name is required"),
});

type SchoolFormProps = {
  provinceId?: string;
  data?: School;
};
export default function SchoolForm({ provinceId, data }: SchoolFormProps) {
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
            createSchool(input: { id: 0 name: "${input.name}" provinceId: ${provinceId || data?.provinceId} }) {
              name
            }
          }
        `,
      ),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      toast.success("School created successfully");
    },
    onError: () => {
      toast.error("Failed to create school");
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    await mutateAsync(data);
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Label>School Name:</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter school name"
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
