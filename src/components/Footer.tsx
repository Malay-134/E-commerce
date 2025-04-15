import Link from "next/link";

export default function Footer() {
  return (
    <div className="text-center">
      <div className="flex justify-center items-center gap-10">
        <Link href="/term-and-condition" className="text-[13px] underline">
          Term and condition
        </Link>
        <Link href="/privacy-policy" className="text-[13px] underline">
          Privacy policy
        </Link>
        <Link href="/return-and-refund" className="text-[13px] underline">
          Return and Refund
        </Link>
      </div>
      <div className="text-sm text-slate-400">
        © 2023-2025, ZED.com, Inc. or its affiliates
      </div>
    </div>
  );
}
