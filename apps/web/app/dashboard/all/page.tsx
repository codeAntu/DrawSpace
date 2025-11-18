"use client";

import Create from "@/app/components/Create";
import { SpaceTable } from "@/app/components/SpaceTable";
import { getMySpaces } from "@/app/query/apis/space";
import { useQuery } from "@tanstack/react-query";

export default function AllPage() {
  const { data } = useQuery({
    queryKey: ["my-spaces"],
    queryFn: getMySpaces,
  });

  console.log(data);

  return (
    <div className="px-0 py-2 md:px-10 md:py-5 space-y-5 ">
      <Create />
      <SpaceTable data={data?.spaces || []} />
    </div>
  );
}
