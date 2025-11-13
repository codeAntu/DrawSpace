"use client";

import Create from "@/app/components/Create";
import { SpaceRow, SpaceTable } from "@/app/components/SpaceTable";

const data: SpaceRow[] = [
  {
    name: "Untitled File",
    location: "",
    created: "5 months ago",
    lastEdited: "4 days ago",
    comments: "",
    author: "test@gmail.com",
  },
  {
    name: "Untitled File",
    location: "",
    created: "5 months ago",
    lastEdited: "6 days ago",
    comments: "n",
    author: "test@gmail.com",
  },
  {
    name: "Untitled File",
    location: "",
    created: "2 months ago",
    lastEdited: "2 months ago",
    comments: "O",
    author: "test@gmail.com",
  },
];

export default function AllPage() {
  return (
    <div className="px-0 py-2 md:px-10 md:py-5 space-y-5 ">
      <Create />
      <SpaceTable data={data} />
    </div>
  );
}
