import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId as CANISTER_ID_BACKEND } from "../../../declarations/resumid_backend";
import { canisterId as CANISTER_ID_INTERNET_IDENTITY } from "../../../declarations/internet_identity";
import { toast } from "@/hooks/useToast";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import { fromNullable } from "@/lib/optionalField";
import { _SERVICE } from "../../../declarations/resumid_backend/resumid_backend.did";
import { ActorSubclass } from "@dfinity/agent";

type AuthLoginOptions = {
  onSuccessNavigate?: () => void;
  onErrorNavigate?: () => void;
  onFinish?: () => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (options?: AuthLoginOptions) => void;
  logout: () => void;
  authClient: AuthClient | null;
  identity: any | null;
  principal: any | null;
  resumidActor: ActorSubclass<_SERVICE> | null;
  userData: any | null;
  fetchUserData: () => Promise<void>;
  updateUserData: (updates: Partial<any>) => void;
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
  const [resumidActor, setResumidActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (!authClient) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const resumidActor = createActor(CANISTER_ID_BACKEND, {
      agentOptions: { identity: authClient.getIdentity() },
    });

    try {
      const userRes = await resumidActor.getUserById();
      let user;

      if ("ok" in userRes) {
        user = userRes.ok;
      } else {
        console.error(userRes?.err || "No user data found")
        setUserData(null);
        setLoading(false);
        return;
      }

      const profileRes = await resumidActor.getProfileByUserId();

      if ("ok" in profileRes) {
        const { profile: _profile } = profileRes.ok;

        const profileDetail = fromNullable(_profile.profileDetail);

        const serializedData = JSON.parse(
          JSON.stringify({
            user,
            profile: {
              profileId: _profile.profileId,
              ...(profileDetail && {
                name: fromNullable(profileDetail.name),
                profileCid: fromNullable(profileDetail.profileCid),
                current_position: fromNullable(profileDetail.current_position)
              })
            }
          }, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
        console.log("Serialized user data:", serializedData);
  
        setUserData(serializedData);
        localStorage.setItem("userData", JSON.stringify(serializedData));
      } else {
        console.error(profileRes?.err && "Error serializing user data");
        setUserData(null);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const initAuthClient = async () => {
      setLoading(true);

      const client = await AuthClient.create(defaultOptions.createOptions);
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        const actor = createActor(CANISTER_ID_BACKEND, {
          agentOptions: { identity },
        });

        setIdentity(identity);
        setPrincipal(principal);
        setResumidActor(actor);

        await fetchUserData();
      } else {
        setIdentity(null);
        setPrincipal(null);
        setResumidActor(null);
      }

      setLoading(false);
    };

    initAuthClient();
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("userData");
    if (cached) {
      try {
        setUserData(JSON.parse(cached));
      } catch { }
    }
  }, []);

  const login = async (
    options?: AuthLoginOptions
  ) => {
    if (!authClient) return;

    const {
      onSuccessNavigate,
      onErrorNavigate,
      onFinish,
    } = options || {};

    authClient.login({
      ...defaultOptions.loginOptions,
      onSuccess: async () => {
        try {
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

            await fetchUserData();

            toast({
              title: "Signed in Successfully",
              description: "Start analyzing your resume now!",
              variant: "success",
            });

            onSuccessNavigate?.();
          } else {
            onErrorNavigate?.();
          }
        } catch (err) {
          console.error("Login error:", err);
          onErrorNavigate?.();
        } finally {
          setLoading(false);
          onFinish?.();
        }
      },
    });
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
      setUserData(null);
      setLoading(false);
      toast({
        title: "You've been Signed Out",
        description: "Thank you for using our service.",
        variant: "success",
      });
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden w-full h-screen flex flex-col gap-4 justify-center items-center text-primary-500">
        <LoaderCircle size={64} className="animate-spin" />
        <h1 className="font-inter text-lg font-semibold text-primary-500">Please Wait</h1>
      </div>
    );
  }


  const updateUserData = (updates: Partial<any>) => {
    setUserData((prevData: any) => ({
      ...prevData,
      ...updates,
      profile: {
        ...prevData?.profile,
        ...updates.profile
      }
    }));

    const updatedData = {
      ...userData,
      ...updates,
      profile: {
        ...userData?.profile,
        ...updates.profile
      }
    };
    localStorage.setItem("userData", JSON.stringify(updatedData));
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
        userData,
        fetchUserData,
        updateUserData,
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