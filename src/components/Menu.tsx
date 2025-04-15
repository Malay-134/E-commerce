"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function Menu() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <FiMenu size={20} onClick={() => setOpen((prev) => !prev)} />
      {open && (
        <div className="absolute flex flex-col justify-center items-center gap-6 bg-slate-950 text-white text-2xl left-0 top-20 w-full h-[calc(100vh-80px)] p-4">
          <Link href="">Homepage</Link>
          <Link href="">Shop</Link>
          <Link href="">Deals</Link>
          <Link href="">About</Link>
          <Link href="">Contact</Link>
          <Link href="">Logout</Link>
        </div>
      )}
    </div>
  );
}
