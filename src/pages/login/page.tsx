import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <section className="w-screen h-screen flex justify-center items-center">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#ffa500] font-bold">
            Admin Login
          </CardTitle>
        </CardHeader>
        <form className="px-6">
          <Label>Username:</Label>
          <Input type="text" className="mb-4 mt-1" />
          <Label>Password:</Label>
          <Input type="password" className="mb-4 mt-1" />
        </form>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full text-white bg-[#004580] hover:bg-[#003366]">
            Login
          </Button>
          <Link className="w-full" to={"/"}>
            <Button className="w-full" variant={"outline"}>
              Cancel
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
