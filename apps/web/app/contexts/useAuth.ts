import { useAuthUser } from "../store/authUser";

export function useAuth() {
  const user = useAuthUser((state) => state.user);
  const loading = useAuthUser((state) => state.loading);
  const fetchUser = useAuthUser((state) => state.fetchUser);
  const clearUser = useAuthUser((state) => state.clearUser);
  return { user, loading, fetchUser, clearUser };
}
