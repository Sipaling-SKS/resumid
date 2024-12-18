import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { createActor } from "../../../declarations/resumid_backend";
import { useAuth } from "./AuthContext";

interface DataContextType {
  userData: any | null;
  fetchUserData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any | null>(null);
  const { principal, authClient } = useAuth();

  const fetchUserData = async () => {
    if (!principal || !authClient) return;
  
    const whoamiActor = createActor("ajuq4-ruaaa-aaaaa-qaaga-cai", {
      agentOptions: { identity: authClient.getIdentity() },
    });
  
    try {
      const userId = await whoamiActor.whoami();
      const data = await whoamiActor.getUserById(userId);
  
      const serializedData = JSON.parse(
        JSON.stringify(data, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
  
      setUserData(serializedData);
  
      localStorage.setItem("userData", JSON.stringify(serializedData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  useEffect(() => {
    // Pulihkan data user dari localStorage saat aplikasi di-reload
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else if (principal) {
      fetchUserData();
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
