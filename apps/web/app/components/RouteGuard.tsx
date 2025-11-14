"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthToken } from "../store/authToken";

const publicRoutes = ["/login", "/signup", "/"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthToken((state) => state.token);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname);

    if (token && isPublicRoute) {
      setIsAuthorized(false);
      router.push("/dashboard");
    } else if (!token && !isPublicRoute) {
      setIsAuthorized(false);
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }

    setIsLoading(false);
  }, [token, pathname, router]);

  if (isLoading || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
