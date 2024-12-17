import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { canisterId, createActor } from "../../../declarations/resumid_backend"; // Pastikan import actor yang benar

// Define types for the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authClient: AuthClient | null;
  identity: any | null;
  principal: any | null;
  whoamiActor: any | null;
  userData: any | null; 
  fetchUserData: () => void;

}

const AuthContext = createContext<AuthContextType | null>(null);

export const getIdentityProvider = (): string | undefined => {
  let idpProvider;
  if (typeof window !== "undefined") {
    const isLocal = import.meta.env.VITE_DFX_NETWORK !== "ic";
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isLocal && isSafari) {
      idpProvider = `http://localhost:4943/?canisterId=${import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY}`;
    } else if (isLocal) {
      idpProvider = `http://a4tbr-q4aaa-aaaaa-qaafq-cai.localhost:4943`;
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
  const [whoamiActor, setWhoamiActor] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null); 

  useEffect(() => {
    AuthClient.create(options.createOptions).then((client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    authClient?.login({
      ...options.loginOptions,
      onSuccess: async () => {
        await updateClient(authClient!); 
      },
    });
  };

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    setAuthClient(client);

    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    setWhoamiActor(actor);
  }

  // async function fetchUserData() {
  //   if (whoamiActor) {
  //     try {
  //       const data = await whoamiActor.authenticateUser();
  //       setUserData(data); 
  //     } catch (error) {
  //       console.error("Failed to authenticate user:", error);
  //     }
  //   } else {
  //     console.error("Actor is not ready");
  //   }
  // }

  // const fetchWhoami = async () => {
  //   if (whoamiActor) {
  //     const principal = await whoamiActor.whoami();
  //     console.log("Your principal ID:", principal);
  //   }
  // };


  async function fetchUserData() {
    if (whoamiActor) {
      try {
        
        const userId = await whoamiActor.whoami(); 
        await whoamiActor.authenticateUser();
        const data = await whoamiActor.getUserById(userId); 
        console.log("id:", userId);
        console.log("data:", data);
        setUserData(data); 
      } catch (error) {
        console.error("Failed to authenticate or fetch user data:", error);
      }
    } else {
      console.error("Actor is not ready");
    }
  }
  

  
  

  async function logout() {
    await authClient?.logout();
    await updateClient(authClient!);
  }

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    whoamiActor,
    userData,
    fetchUserData // Berikan akses ke data user
  };
};

// Define props for AuthProvider with children prop
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to provide authentication context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to access authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
