"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegistrationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("api/register", data);
      console.log(response);
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-5"
      >
        {/* {isSubmitting && <span className="text-red-600">Loading...</span>}   */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm ml-2">Name</label>
            <input
              className="border border-(--main) p-3 rounded-xl focus:outline-0"
              placeholder="Name"
              type="text"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm ml-2">Email</label>
            <input
              className="border border-(--main) p-3 rounded-xl focus:outline-0"
              placeholder="Enter your email"
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email address",
                },
              })}
              name="email"
            />
          </div>
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm ml-2">Password</label>
            <input
              className="border border-(--main) p-3 rounded-xl focus:outline-0"
              placeholder="********"
              type="password"
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  value.length >= 8 ||
                  "Password must be atlist 8 character long",
              })}
            />
          </div>

          {errors.password && (
            <span className="text-red-600">{errors.password.message}</span>
          )}
        </div>
        <button
          disabled={isSubmitting}
          className=" font-semibol border bg-(--main) font-bold text-white hover:text-(--main) hover:border-(--main) hover:bg-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:bg-white disabled:cursor-not-allowed"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
