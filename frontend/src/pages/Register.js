import React, { useState } from 'react';
import api from '../services/api';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      saveToken(res.data.token);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'register failed');
    }
  }

  return (
    <div className="container">
      <form onSubmit={submit} className="form card">
        <div className="form-row"><input className="input" placeholder="username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} /></div>
        <div className="form-row"><input className="input" placeholder="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></div>
        <div className="form-row"><input className="input" type="password" placeholder="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /></div>
        <div className="form-row"><button className="button btn-primary" type="submit">Register</button></div>
      </form>
    </div>
  );
}
