import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <main className="w-screen h-screen bg-white flex flex-col gap-2 items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Something went wrong!
        </h1>
        <p>Please refresh the page.</p>
        <Link to="/">
          <Button variant={"outline"}>HOME</Button>
        </Link>
      </main>
    </>
  );
}
