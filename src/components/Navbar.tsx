import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";

export default function Navbar() {
  return (
    <div className="h-16 px-4 md:px-8 lg:px-16 xl:px-32 relative bg-(--background) shadow-sm ">
      <div className="h-full flex justify-between items-center md:hidden">
        <Link href="/" className="text-2xl font-semibold">
          ZED
        </Link>
        <Menu />
      </div>
      <div className="hidden md:flex justify-between items-center gap-8 h-full">
        <div className="w-1/3">
          <Link href="/" className="text-2xl text-(--main) font-semibold">
            ZED
          </Link>
        </div>
        <div className="w-2/3 flex items-center justify-between gap-10">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
}
