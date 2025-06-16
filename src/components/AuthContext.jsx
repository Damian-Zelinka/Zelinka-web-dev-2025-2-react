import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [user, setUser] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [role, setRole] = useState("");


  // Function to check if user is logged in
  const checkAuth = async () => {
    try {
      const response = await fetch("https://damko13.pythonanywhere.com/check_auth", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.loggedIn) {
        setIsLoggedIn(true);
        setRole(data.status);
        // Check if user data is different before setting state
        const newUser = {
          id: data.user_id,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          username: data.username || null,
          email: data.email || null,
          status: data.status || null,
          profile_picture: data.profile_picture || null,
          landmarks: data.user_landmarks || [],
        };
        // Only update state if the user data has changed
        if (!user || JSON.stringify(user) !== JSON.stringify(newUser)) {
          setUser(newUser);
        }
        return true;
      } else {
        setIsLoggedIn(false);
        setRole("");
        return false;
      }
    } catch (error) {
      setIsLoggedIn(false); // If error occurs, user is not logged in
      setRole("");
      console.error("Error checking auth:", error);
      return false;
    } finally {
      setLoading(false); // Done with loading state
    }
  };


      // Function to fetch all landmarks is logged in
      const fetchAllLandmarks = async () => {
        try {
          const response = await fetch("https://damko13.pythonanywhere.com/landmarks", {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();


          const mergedLandmarks = data.landmarks.map(landmark => ({
            ...landmark,
            userReaction: data.interactions[landmark.id] || null
          }));

          setLandmarks(mergedLandmarks);


        } catch (error) {
          console.error("Error:", error);
          return false;
        }
      };



  useEffect(() => {
    checkAuth();
    fetchAllLandmarks();
  }, []);


  useEffect(() => {
    if (landmarks.length > 0) {
      console.log("Landmarks have been updated:", landmarks);
    }
  }, [landmarks]);


  const login = async (userData) => {
    try {
      const loggedInStatus = await checkAuth();
      console.log('Login status:', loggedInStatus);
      setIsLoggedIn(loggedInStatus);


      if (isLoggedIn) {
        throw new Error("User is already logged in");
      }
      const response = await fetch("https://damko13.pythonanywhere.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });
  
  
      if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject(new Error(errorData.message || `Login failed with status: ${response.status}`));
      }
  

      const data = await response.json();
  
      if (data.message === "Login successful!") {
        checkAuth();
        fetchAllLandmarks();
        setUser(userData);
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error("Login failed"));
      }
    } catch (error) {

      if (error.message === "User is already logged in") {
        console.log("User is already logged in, skipping login.");
        return Promise.reject(new Error("User is already logged in"));
      }

      console.error("Login failed", error);
      setIsLoggedIn(false);
      return Promise.reject(new Error("An unexpected error occurred"));
    }
  };


  const logout = async () => {
    try {
      await fetch("https://damko13.pythonanywhere.com/logout", {
        method: "POST",
        credentials: "include",
      });
      await checkAuth();
      await fetchAllLandmarks();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggedIn(false);
      setRole("");
    }
  };







  return (
    <AuthContext.Provider value={{ role, isLoggedIn, user, loading, landmarks, checkAuth, login, logout, fetchAllLandmarks }}>
      {children}
    </AuthContext.Provider>
  );
};