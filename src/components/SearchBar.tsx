"use client";

import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar() {
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      router.push(`/list?name=${name}`);
    }
  };

  return (
    <form
      className="flex flex-1 items-center justify-between gap-4 p-1 shadow-2xl bg-gray-100 rounded-xl"
      onSubmit={handleSearch}
    >
      <input
        name="name"
        type="text"
        placeholder="Search"
        className="p-2 border-0 outline-0 text-black flex-1 bg-transparent"
      />
      <button className="cursor-pointer mr-3">
        <IoIosSearch size={25} className="text-black" />
      </button>
    </form>
  );
}
