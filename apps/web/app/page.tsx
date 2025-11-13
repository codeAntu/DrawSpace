"use client";

import { Button } from "@repo/ui/ui/button";
import { Card } from "@repo/ui/ui/card";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to DrawSpace</h1>
          {user && (
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          )}
        </div>

        {user && (
          <Card className="p-6 bg-white/5 border-white/10">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
