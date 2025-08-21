import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { LoaderCircle } from "lucide-react";

interface DataContextType {
  userData: any | null;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { principal, loading: authLoading, authClient } = useAuth();

  const fetchUserData = async () => {
    if (!authClient) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // ✅ FE-only: ganti call ke backend dengan dummy data
    try {
      const mockData = {
        id: principal,
        name: "Mock User",
        email: "mock@example.com",
      };

      console.log("Serialized user data (mock):", mockData);

      setUserData(mockData);
      localStorage.setItem("userData", JSON.stringify(mockData));
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
