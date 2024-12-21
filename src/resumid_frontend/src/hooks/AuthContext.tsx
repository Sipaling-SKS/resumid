import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { canisterId, createActor } from "../../../declarations/resumid_backend";
import { canisterId as CANISTER_ID_INTERNET_IDENTITY } from "../../../declarations/internet_identity";
import { canisterId as CANISTER_ID_BACKEND } from "../../../declarations/resumid_backend";
import { HttpAgent } from "@dfinity/agent";


// Define types for the context state
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authClient: AuthClient | null;
  identity: any | null;
  principal: any | null;
  resumidActor: any | null;
  loading: boolean; // Added to handle async state
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getIdentityProvider = (): string | undefined => {
  let idpProvider;
  if (typeof window !== "undefined") {
    const isLocal = import.meta.env.VITE_DFX_NETWORK !== "ic";
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isLocal && isSafari) {
      idpProvider = `http://localhost:4943/?canisterId=${CANISTER_ID_INTERNET_IDENTITY}`;
    } else if (isLocal) {
      idpProvider = `http://${CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
    }
  }
  return idpProvider;
};

export const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: getIdentityProvider(),
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<any | null>(null);
  const [principal, setPrincipal] = useState<any | null>(null);
  const [resumidActor, setResumidActor] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create(options.createOptions);
      await updateClient(client); 
    };
    initAuthClient();
  }, []);

  const login = () => {
    if (authClient) {
      authClient.login({
        ...options.loginOptions,
        onSuccess: async () => {
          await updateClient(authClient);
        },
      }
    );
    }
  };

  const updateClient = async (client: AuthClient) => {
    setLoading(true)
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    if (isAuthenticated) {
      const identity = client.getIdentity();
      setIdentity(identity);

      const principal = identity.getPrincipal();
      setPrincipal(principal);


      const actor = createActor(CANISTER_ID_BACKEND, {
        agentOptions: {
          identity,
        },
      });


      // console.log("Actor created:", actor);
      // console.log("Actor identity:", String(identity)); 
      // console.log("Actor principal:", String(principal)); 

      // // Test if the actor can call a simple method on the backend
      // try {
      //   const auth = await actor.authenticateUser(principal); 
      //   const result = await actor.getUserById(principal); 
      //   console.log("Backend response auth:", auth);
      //   console.log("Backend response get data:", result); 
      // } catch (error) {
      //   console.error("Error calling backend method:", error); // Error handling if calling backend fails
      // }

      setResumidActor(actor);
    } else {
      // Reset states if not authenticated
      setIdentity(null);
      setPrincipal(null);
      setResumidActor(null);
    }

    setAuthClient(client);
    setLoading(false); // Loading state is false after update
  };

  const logout = async () => {
    await authClient?.logout();
    await updateClient(authClient!);
    localStorage.removeItem("userData")

  };

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    resumidActor,
    loading, // Expose loading state
  };
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


