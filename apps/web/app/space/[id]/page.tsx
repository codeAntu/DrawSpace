"use client";

import { useParams } from "next/navigation";

export default function SpacePage() {
  const params = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="h-[24px] ">Space Details for ID: {params.id}</h1>
      <canvas className="bg-red-500 w-full h-[calc(100dvh-24px)]">deh</canvas>
    </div>
  );
}
