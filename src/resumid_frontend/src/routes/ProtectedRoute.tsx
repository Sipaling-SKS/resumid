import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = "/",
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast({
      title: "Error, Not Authorized",
      description: "You need to sign in first.",
      variant: "destructive"
    })
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

export default ProtectedRoute;