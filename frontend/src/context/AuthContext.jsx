import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spinnerStyle } from '../constant';
import { auth } from "../firebase/config";
import { getDocData } from '../firebase/service';

export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged(async function (user) {
      if (user) {
        const { uid } = user;
        const data = await getDocData(user);
        if (data.role === "ADMIN") {
          setUser({ uid, firstName: data.firstName, lastName: data.lastName, role: data.role });
        }
      }
      else {
        navigate("/");
      }
      setIsLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? (
        <div style={spinnerStyle}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
