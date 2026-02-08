import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type DeleteButtonProps = {
  btnText?: string;
  queryDocument: string;
  queryKey: string;
};
export default function DeleteButton({
  btnText,
  queryDocument,
  queryKey,
}: DeleteButtonProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () =>
      await request(
        import.meta.env.VITE_API_URL,
        gql`
          ${queryDocument}
        `,
      ),
    onSuccess: () => {
      toast("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  return (
    <Button
      variant={"ghost"}
      size={btnText ? "sm" : "icon"}
      disabled={isPending || !queryDocument}
      className={btnText && "w-full justify-start"}
      onClick={() => mutateAsync()}
    >
      {<Trash className="h-4 w-4 text-red-500" />}
      {btnText}
    </Button>
  );
}
