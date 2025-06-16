import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import SignInForm from "./SignIn.jsx"
import SignUpForm from './SignUp.jsx';
import MainPage from './MainPage.jsx';
import AccountPage from './AccountPage.jsx';
import Users from './Users.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminRoute from '../components/AdminRoute.jsx';
import ScrollToTop from '../components/ScrollToTop';

function App() {
  const { checkAuth, loading } = useAuth();
  const location = useLocation();
  

  useEffect(() => {
    if (!loading) {
      checkAuth();
    }
  }, [checkAuth, location.pathname, loading]); 


  if (loading) return null;



  return (
    <>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element = {<MainPage/>} />
        <Route path="/signup" element = {<SignUpForm/>} />
        <Route path="/signin" element = {<SignInForm/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
