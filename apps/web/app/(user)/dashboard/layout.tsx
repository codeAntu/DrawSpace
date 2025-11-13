"use client";
import { Input } from "@repo/ui/components/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { label: "All", path: "/dashboard/all" },
  { label: "Recents", path: "/dashboard/recents" },
  { label: "Created by Me", path: "/dashboard/created" },
  { label: "Folders", path: "/dashboard/folders" },
  { label: "Unsorted", path: "/dashboard/unsorted" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="fullscreen">
      <div className="flex items-center justify-between  mb-5">
        <nav className="text-sm font-medium flex ">
          {pages.map((page) => {
            const isActive = pathname === page.path;

            return (
              <Link
                key={page.path}
                href={page.path}
                className={`px-3 py-0.5 border  border-transparent text-white/40 hover:text-white/90 transition duration-200 ease-in-out
                 ${isActive ? "border-white/40 rounded-md text-white/90 bg-white/5" : ""}`}
              >
                {page.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <div className="border border-white/40 rounded-md py-1.5 px-2 flex items-center">
            <Search className="h-4 w-4 text-white/40" />
            <input
              placeholder="Search "
              className="border-none outline-none bg-transparent ml-2 text-xs text-white/80 placeholder:text-white/40 flex-grow"
            />
          </div>
          <div>
            <img
              src="https://avatars.githubusercontent.com/u/98962215?v=4"
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        <div></div>
      </div>
      <div>{children}</div>
    </div>
  );
}
