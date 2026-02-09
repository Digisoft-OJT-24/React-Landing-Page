import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import z from "zod";
import { Spinner } from "@/components/ui/spinner";
import { file_url } from "@/api_url";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export default function LoginPage() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (input: z.infer<typeof formSchema>) => {
      const response = await fetch(
        `${file_url}/api/Auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: input.username,
            password: input.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Login Failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      form.reset();
      console.log("Login successful, received data:", data);
      Cookies.set("token", data.token, { expires: 7 });
      navigate("/ds-dashboard");
    },
    onError: (error) => {
      toast.error("Login failed: " + error.message);
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutateAsync(data);
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center">
      <Card className="w-[300px]">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-[#ffa500] font-bold">
              Admin Login
            </CardTitle>
          </CardHeader>
          <Label>Username:</Label>
          <Input
            type="text"
            className="mb-4 mt-1"
            {...form.register("username")}
          />
          <Label>Password:</Label>
          <Input
            type="password"
            className="mb-4 mt-1"
            {...form.register("password")}
          />
          <CardFooter className="flex-col gap-2">
            <Button
              className="w-full text-white bg-[#004580] hover:bg-[#003366]"
              disabled={isPending}
              type="submit"
            >
              {isPending ? <Spinner /> : "Login"}
            </Button>
            <Link className="w-full" to={"/"}>
              <Button className="w-full" variant={"outline"}>
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
