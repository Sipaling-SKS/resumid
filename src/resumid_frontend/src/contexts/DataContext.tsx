import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { createActor } from "../../../declarations/resumid_backend";
import { useAuth } from "./AuthContext";
import { canisterId as CANISTER_ID_BACKEND } from "../../../declarations/resumid_backend";
import { LoaderCircle } from "lucide-react";

interface DataContextType {
  userData: any | null;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { principal, authClient, loading: authLoading } = useAuth();

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
      const data = await resumidActor.getUserById();

      if (!data || Object.keys(data).length === 0) {
        console.error("No user data found");
        setUserData(null);
        setLoading(false);
        return;
      }

      const serializedData = JSON.parse(
        JSON.stringify(data, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      console.log("Serialized user data:", serializedData);

      setUserData(serializedData);
      localStorage.setItem("userData", JSON.stringify(serializedData));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!principal) {
      setUserData(null);
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [principal, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="overflow-hidden w-full h-screen flex flex-col gap-4 justify-center items-center text-primary-500">
        <LoaderCircle size={64} className="animate-spin" />
        <h1 className="font-inter text-lg font-semibold text-primary-500">Please Wait</h1>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ userData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
};