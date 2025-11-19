import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { authHeader, getToken } from '../utils/auth';

export default function PostDetail(){
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{ api.get('/posts/'+id).then(r=>setPost(r.data)).catch(()=>{}) }, [id]);

  async function del(){
    if(!window.confirm('Delete?')) return;
    await api.delete('/posts/'+id, { headers: authHeader() });
    nav('/');
  }

  if(!post) return <div>Loading...</div>;
  return (
    <div className="container post-detail">
      <div className="card">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">by {post.username} • {new Date(post.createdAt).toLocaleString()}</div>
        {post.imageURL && <img className="post-image" src={post.imageURL} alt="" />}
        <div className="post-content">{post.content}</div>
        <div className="actions">
          <Link className="button btn-secondary" to={'/edit/'+post._id}>Edit</Link>
          <button className="button btn-danger" onClick={del}>Delete</button>
        </div>
      </div>
    </div>
  );
}
