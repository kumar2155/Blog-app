export function saveToken(token){ localStorage.setItem('token', token); }
export function getToken(){ return localStorage.getItem('token'); }
export function logout(){ localStorage.removeItem('token'); }
export function authHeader(){ const t = getToken(); return t ? { Authorization: 'Bearer ' + t } : {}; }
