import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useData } from "@/hooks/DataContext"; 

const whoamiStyles: React.CSSProperties = {
  border: "1px solid #1a1a1a",
  marginBottom: "1rem",
};

const Login: React.FC = () => {
  const { isAuthenticated, principal, logout } = useAuth(); 
  const { userData } = useData(); 
  const [userDetails, setUserDetails] = useState<any[]>([]);

  // useEffect(() => {
  //   if (principal) {
  //     fetchUserData(); 
  //   }
  // }, [principal, fetchUserData]);

  useEffect(() => {
    if (userData) {
      const formatedData = JSON.parse(JSON.stringify(userData));

      setUserDetails(formatedData); 
    }
  }, [userData]);
  console.log("data:", userDetails)
  return (
    <div className="container">
      <h1>Internet Identity Client</h1>
      <h2>Auth Status: {JSON.stringify(isAuthenticated)}</h2>
      <p>To see how a canister views you, you can see your identity below.</p>

      <input
        type="text"
        readOnly
        id="whoami"
        value={principal ? principal.toString() : "Loading..."} 
        placeholder="Your Identity"
        style={whoamiStyles}
      />
      
      {/* <div style={{ marginTop: "20px" }}>
        {userDetails.length > 0 ? (
          userDetails.map((item, index) => (
            <div key={index}>
              <p>ID: {item.id.__principal__}</p>
              <p>Name: {item.name}</p>
              <p>Created At: {item.createdAt}</p>
              <p>Role: {item.role}</p>
            </div>
          ))
        ) : (
          <p>Loading user data...</p>
        )}
      </div> */}
      <p>{JSON.stringify(userData)}</p>


      <br />
      <button id="logout" onClick={logout}>
        Log out
      </button>
    </div>
  );
};

export default Login;