import { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import { HomePage } from './pages/HomePage/HomePage';
import styles from "./App.module.less";
import SignUpPage from './pages/RegisterPage/SignUp';
import SignInPage from './pages/RegisterPage/SignIn';
import { useAppDispatch } from './app/hooks';
import { ACCESS_TOKEN } from './constants/cookies';
import { cleanUser, setUser } from './app/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const token = cookies.find((c) => c.startsWith(ACCESS_TOKEN + "="));
    if (token && token.split("=")[1]) {
      dispatch(setUser());
    } else {
      dispatch(cleanUser());
    }
  }, [dispatch]);

  return (
    <div className={styles.main}>
     <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignInPage/>} />
      <Route path="/register" element={<SignUpPage />} />
     </Routes>
    </div>
  )
}

export default App
