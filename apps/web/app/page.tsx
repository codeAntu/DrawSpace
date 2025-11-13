"use client";

import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { logoutApi } from "./query/apis/auth";

export default function Home() {
  return (
    <div>
      <Card>
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      </Card>
      <Button onClick={logoutApi}>Logout</Button>
    </div>
  );
}
