import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import background from "@/images/Yellow and black.jpg";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="hidden md:block w-full h-full">
        <Image
          src={background}
          alt="Background Image"
          className="w-full h-full object-fit"
          priority
        />
      </div>
      <div className="flex flex-col gap-5 justify-center p-8 shadow-lg rounded-lg w-full h-full">
        <p className="text-center p-2 text-2xl mb-5">
          Welcome to
          <strong className="text-(--main)"> ZED</strong>
        </p>
        <LoginForm />
        <Link href="/register" className="flex gap-1 justify-center items-center">
          <strong className="font-semibold text-sm">
            don't have an account?
          </strong>{" "}
          <p className="text-blue-600 text-sm font-bold underline hover:cursor-pointer">
            Register
          </p>
        </Link>
      </div>
    </div>
  );
}
