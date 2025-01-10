import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'
import axios from 'axios'

const Header = () => {
  const [sidetoggle, setSideToggle] = useState(false)
  const [role, setRole] = useState(null);
  const location = useLocation();

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle)
  }

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/log-out`, {}, {
        withCredentials: true,
      });

      if (res.status === 200) {
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('login');
        window.location.href = '/log-in';
      } else {
        console.error('Failed to log out. Server returned:', res.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);


  return (
    <>
      <header>
        <div className="top-head">
          <div className="right">
            <h2>National Marketing Projects</h2>
            <div className="bar" onClick={handletoggleBtn}>
              <i class="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <a href="" target="_blank">
              <i class="fa-solid fa-globe"></i>
              Go To Website
            </a>

            <div className="logout" onClick={handleLogout}>
              Log Out <i class="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>

        </div>

        <div className={`rightNav ${sidetoggle ? "active" : ""} `}>
          <ul>
            <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-gauge"></i> Dashboard</Link></li>
            {
              role === "Admin" ? <li><Link to="/all-users" className={location.pathname === '/all-users' ? 'active' : ''} onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Users</Link></li> : null
            }
            <button className='logout mb-5' onClick={handleLogout}>Log Out <i class="fa-solid fa-right-from-bracket"></i></button>

          </ul>
        </div>

      </header>
    </>
  )
}

export default Header