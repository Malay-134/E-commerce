"use client";

import { FaUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsCart2 } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import toast from "react-hot-toast";

export default function NavIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    const auth = localStorage.getItem("isLogged");
    setIsAuth(auth === "true");
  }, []);

  const handleProfile = () => {
    if (!isAuth) {
      console.log(isAuth);
      router.push("/login");
    }
    setIsProfileOpen((prev) => !prev);
    console.log(isProfileOpen);
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    localStorage.removeItem("isLogged");
    localStorage.removeItem("user");
    // localStorage.removeItem("loggedInUser");
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <FaUser
        size={25}
        className="cursor-pointer hover:fill-(--main) "
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-2 rounded-md top-10 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <Link href="/profile" className="p-3 text-lg">
            Profile
          </Link>
          <div className="p-3 text-lg cursor-pointer" onClick={handleLogout}>
            Log Out
          </div>
        </div>
      )}
      <IoNotificationsOutline
        size={25}
        className="cursor-pointer hover:text-(--main)"
      />
      <div className="relative cursor-pointer">
        <Link href="/cart">
          <BsCart2 size={25} onClick={() => setIsCartOpen((prev) => !prev)} />
          <div className="absolute text-center -top-2 text-[12px] -right-3 w-4 h-4 text-white bg-black rounded-full">
            {cart.length}
          </div>
        </Link>
      </div>
      {/* {isCartOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <CartModel />
        </div>
      )} */}
    </div>
  );
}
