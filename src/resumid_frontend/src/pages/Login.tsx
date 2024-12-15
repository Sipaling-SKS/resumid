import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuthClient";

const whoamiStyles: React.CSSProperties = {
  border: "1px solid #1a1a1a",
  marginBottom: "1rem",
};

const bigIntReplacer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString(); 
  }
  return value;
};

const Login: React.FC = () => {
  const [result, setResult] = useState<string>(""); 
  const { whoamiActor, logout, userData } = useAuth(); 
  
  const [userDetails, setUserDetails] = useState<any[]>([]);

  useEffect(() => {
    console.log("data : ", userData)
    if (userData) {
      const userInfo = Object.entries(userData).map(([key, value]) => ({
        label: key,
        value: JSON.stringify(value, bigIntReplacer), 
      }));
      
      setUserDetails(userInfo); 
      console.log("User data updated:", userData);
    }
  }, [userData]);

  const handleClick = async () => {
    if (whoamiActor) {
      const whoami = await whoamiActor.whoami();
      setResult(whoami);
    }
  };

  return (
    <div className="container">
      <h1>Internet Identity Client</h1>
      <h2>You are authenticated!</h2>
      <p>To see how a canister views you, click this button!</p>
      <button
        type="button"
        id="whoamiButton"
        className="primary"
        onClick={handleClick}
      >
        Who am I?
      </button>
      <input
        type="text"
        readOnly
        id="whoami"
        value={result}
        placeholder="your Identity"
        style={whoamiStyles}
      />
      
    
      <div style={{ marginTop: "20px" }}>
        {userDetails.length > 0 ? (
          userDetails.map((item, index) => (
            <div key={index}>
              <strong>{item.label}: </strong>
              <span>{item.value}</span>
            </div>
          ))
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <br />
      <button id="logout" onClick={logout}>
        Log out
      </button>
    </div>
  );
};

export default Login;
