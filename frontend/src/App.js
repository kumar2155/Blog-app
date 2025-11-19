import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreateEdit from './pages/CreateEdit';
import Login from './pages/Login';
import Register from './pages/Register';
import { getToken, logout } from './utils/auth';

export default function App(){
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent(){
  const [token, setToken] = useState(getToken());
  const location = useLocation();
  const navigate = useNavigate();

  // refresh token on route change (so nav updates after login)
  useEffect(()=>{
    setToken(getToken());
  }, [location]);

  return (
    <>
      <div className="site-header">
        <div className="container">
          <h1 className="brand"><Link to="/">Blog App</Link></h1>
          <nav>
            {token ? <>
              <Link to="/create">Create</Link> {' '}
              <button onClick={()=>{ logout(); setToken(null); navigate('/'); }}>Logout</button>
            </> : <>
              <Link to="/login">Login</Link> {' '}
              <Link to="/register">Register</Link>
            </>}
          </nav>
        </div>
      </div>

      <main className="container content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/posts/:id" element={<PostDetail/>} />
          <Route path="/create" element={<CreateEdit/>} />
          <Route path="/edit/:id" element={<CreateEdit edit/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </main>
    </>
  );
}
