"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/logout");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    localStorage.removeItem("isLogged");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  if (!user) return <div className="text-white">Loading user info...</div>;
  // const [profileDet, setProfileDet] = useState<UserDetails | null>(null);
  // const isAuth = localStorage.getItem("isAuthenticated");

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("loggedInUser");
  //   if (storedUser) {
  //     setProfileDet(JSON.parse(storedUser));
  //     console.log(JSON.parse(storedUser));
  //   }
  // }, []);

  return (
    <div className="p-6 flex flex-col gap-3 items-center justify-center  ">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.name || "User"}!
      </h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Id:</strong> {user.id}
      </p>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
