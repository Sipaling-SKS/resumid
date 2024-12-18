import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { createActor } from "../../../declarations/resumid_backend";
import { useAuth } from "./AuthContext";
import { canisterId as CANISTER_ID_INTERNET_IDENTITY } from "../../../declarations/internet_identity";
import { canisterId as CANISTER_ID_BACKEND } from "../../../declarations/resumid_backend";

interface DataContextType {
  userData: any | null;
  fetchUserData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any | null>(null);
  const { principal, authClient, loading } = useAuth();

  const fetchUserData = async () => {
    if (!principal || !authClient) return;

    const whoamiActor = createActor(CANISTER_ID_BACKEND, {
      agentOptions: { identity: authClient.getIdentity() },
    });

    try {
      const authenticateUser = await whoamiActor.authenticateUser();

      console.log(authenticateUser)

      console.log("__START_FETCHING_DATA__")
      const userId = await whoamiActor.whoami();
      console.log("Fetched user ID:", userId);

      const data = await whoamiActor.getUserById(userId);
      console.log("Fetched user data:", data);

      if (!data || Object.keys(data).length === 0) {
        console.error("No user data found");
        setUserData(null);
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
    }
  };



  useEffect(() => {
    if (loading) return;

    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
      return;
    }

    if (principal) {
      fetchUserData();
    }

    if (principal) {
      console.log("__FETCHING_FROM_PRINCIPAL__")
      fetchUserData();
      return;
    }
  }, [principal]);

  return (
    <DataContext.Provider value={{ userData, fetchUserData }}>
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
