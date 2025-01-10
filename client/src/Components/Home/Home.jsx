import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import AllUsers from '../../Pages/Users/AllUsers';
import Login from '../auth/Login';
import Signup from '../auth/Signup';

const Home = () => {
  const isLoggedIn = sessionStorage.getItem('login') === 'true';
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <>
      {isLoggedIn ?
        <>
          <Header />
          <div className="rightside">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              {
                role === "Admin" ? <Route path="/all-users" element={<AllUsers />} /> :
                  <Route path="*" element={<Navigate to="/dashboard" />} />
              }
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </> :
        <>
          <Routes>
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="*" element={<Navigate to="/log-in" />} />
          </Routes>
        </>
      }
    </>
  )
}

export default Home;
