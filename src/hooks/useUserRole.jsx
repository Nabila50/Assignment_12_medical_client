import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role,
    isLoading: roleLoading,
    isError,
    error,
    refetch,  
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !loading,  
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data.role;
    },
  });

  return {
    role,
    roleLoading,
    isError,
    error,
    refetch,
  };
};

export default useUserRole;
