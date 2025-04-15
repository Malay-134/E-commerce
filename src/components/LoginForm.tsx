"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "./spinner";

export const LOCAL_STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  IS_LOGGED: "isLogged",
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("api/login", { email, password });
      console.log(response);
      console.log(response.data.user.id);
      if (response.data.message === "success") {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.USER,
          JSON.stringify(response.data.user)
        );
        // localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.user.id);
        localStorage.setItem("isLogged", "true");
        console.log(response.data);
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.log("login failed", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
          <Spinner />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col justify-center items-center gap-4 transition-opacity duration-300 ${
          loading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm ml-2">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            name="email"
            placeholder="Enter Email"
            className="border-1 border-(--main) p-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm ml-2">Password</label>
          <input
            type="password"
            placeholder="Password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-(--main) border-1 p-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="border border-(--main) text-(--main) font-semibold px-4 py-2 rounded-md hover:text-white hover:bg-(--main)"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
