import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId as CANISTER_ID_BACKEND } from "../../../declarations/resumid_backend";
import { canisterId as CANISTER_ID_INTERNET_IDENTITY } from "../../../declarations/internet_identity";
import { toast } from "@/hooks/useToast";
import { useNavigate } from "react-router";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authClient: AuthClient | null;
  identity: any | null;
  principal: any | null;
  resumidActor: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getIdentityProvider = (): string | undefined => {
  if (typeof window !== "undefined") {
    const isLocal = import.meta.env.VITE_DFX_NETWORK !== "ic";
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isLocal && isSafari) {
      return `http://localhost:4943/?canisterId=${CANISTER_ID_INTERNET_IDENTITY}`;
    } else if (isLocal) {
      return `http://${CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
    }
  }
  return undefined;
};

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: getIdentityProvider(),
  },
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<any | null>(null);
  const [principal, setPrincipal] = useState<any | null>(null);
  const [resumidActor, setResumidActor] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuthClient = async () => {
      setLoading(true);
      const client = await AuthClient.create(defaultOptions.createOptions);
      setAuthClient(client);
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);

        const principal = identity.getPrincipal();
        setPrincipal(principal);

        const actor = createActor(CANISTER_ID_BACKEND, {
          agentOptions: { identity },
        });
        setResumidActor(actor);

      } else {
        setIdentity(null);
        setPrincipal(null);
        setResumidActor(null);
      }

      setLoading(false);
    };

    initAuthClient();
  }, []);
  
  const login = async () => {
    if (authClient) {
      authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          setLoading(true);
          const isAuthenticated = await authClient.isAuthenticated();
          setIsAuthenticated(isAuthenticated);

          if (isAuthenticated) {
            const identity = authClient.getIdentity();
            setIdentity(identity);

            const principal = identity.getPrincipal();
            setPrincipal(principal);

            const actor = createActor(CANISTER_ID_BACKEND, {
              agentOptions: { identity },
            });

            await actor.whoami();
            await actor.authenticateUser();
            
            setResumidActor(actor);

            toast({
              title: "Signed in Successfully",
              description: "Start analyzing your resume now!",
              variant: "success",
            });
          }

          setLoading(false);
        },
      });
    }
    
  };

  const logout = async () => {
    if (authClient) {
      setLoading(true);
      navigate("/", { replace: true });
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setResumidActor(null);
      setLoading(false);
      toast({
        title: "You've been Signed Out",
        description: "Thank you for using our service.",
        variant: "success",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        authClient,
        identity,
        principal,
        resumidActor,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
