import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/useToast";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = "/",
}) => {
  const { isAuthenticated, login, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const loginTriggeredRef = useRef(false);
  const attemptedPathRef = useRef(location.pathname + location.search);

  useEffect(() => {
    if (!loading && !isAuthenticated && !loginTriggeredRef.current) {
      loginTriggeredRef.current = true;

      console.log("attempt protected route access")

      toast({
        title: "Not authorized",
        description: "You need to sign in first.",
        variant: "destructive",
      });

      login({
        onSuccessNavigate: () => {
          console.log(attemptedPathRef.current);
          navigate(attemptedPathRef.current, { replace: true });
        },
      });
    }
  }, [loading, isAuthenticated, login]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

export default ProtectedRoute;
