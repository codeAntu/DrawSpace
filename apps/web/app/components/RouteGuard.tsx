"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthToken } from "../store/authToken";

const publicRoutes = ["/login", "/signup"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthToken((state) => state.token);

  useEffect(() => {
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If trying to access protected route without token, redirect to login
    if (!token && !isPublicRoute && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    // If logged in and trying to access login/signup, redirect to home
    if (token && isPublicRoute && pathname !== "/") {
      router.replace("/");
      return;
    }
  }, [token, pathname, router]);

  return <>{children}</>;
}
