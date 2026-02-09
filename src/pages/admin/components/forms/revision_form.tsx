import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeLog } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
import { api_url } from "@/api_url";

const formSchema = z.object({
  id: z.number().optional(),
  appName: z.string().optional(),
  version: z.string().min(1, "Version name is required"),
  revision: z.string().min(1, "Revision name is required"),
  description: z.string().min(1, "Description is required"),
});

type RevisionFormProps = {
  productCode: string;
  data?: ChangeLog;
};
export default function RevisionForm({ productCode, data }: RevisionFormProps) {
  const queryClient = useQueryClient();
  const { closeAlert } = useAlertDialog();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || undefined,
      appName: data?.appName || productCode || "",
      version: data?.version || "",
      revision: data?.revision || "",
      description: data?.description || "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) =>
      request(
        api_url,
        gql`
        mutation {
          createChangeLogs(
            input: { 
              id: 0,
              appName: "${input.appName}", 
              description: "${input.description}",
              revision: ${input.revision},
              version: "${input.version}",
              date: "${new Date().toISOString()}"
            }) {
            appName
            date
            description
            id
            revision
            version
          }
        }
        `,
      ),
    onSuccess: () => {
      form.reset();
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Version created successfully");
    },
    onError: () => {
      toast.error("Failed to create version");
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    form.setValue("appName", productCode);
    await mutateAsync(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Label>Version:</Label>
      <Input
        type="text"
        className="mb-3"
        placeholder="Enter product version"
        {...form.register("version")}
      />

      <Label>Revision:</Label>
      <Input
        type="number"
        className="mb-3"
        placeholder="Enter product revision"
        {...form.register("revision")}
      />

      <Label>Description:</Label>
      <Textarea
        rows={3}
        placeholder="Enter description for this revision"
        {...form.register("description")}
        className="mb-3"
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
