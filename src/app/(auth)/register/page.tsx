import RegistrationForm from "@/components/RegistrationForm";
import Link from "next/link";
import background from "@/images/Yellow and black.jpg";
import Image from "next/image";

export default function Register() {
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
      <div className="flex flex-col gap-5 justify-center items-center p-8 shadow-lg rounded-lg w-full h-full">
        {/* <h1 className="font-bold text-2xl">SignUp Page</h1> */}
        <p className="text-2xl">Create Your New Account</p>
        <RegistrationForm />
        <Link href="/login" className="flex gap-1 items-center">
          <strong className="font-semibold text-sm">
            Already have an account?
          </strong>{" "}
          <p className="text-blue-600 text-sm font-bold underline hover:cursor-pointer">
            Log in
          </p>
        </Link>
      </div>
    </div>
  );
}
