import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  // Fetch function wrapped in useCallback to avoid ESLint warnings
  const fetchPosts = useCallback(async () => {
    const res = await api.get('/posts', { params: { page, search: q } });
    setPosts(res.data.data);
  }, [page, q]);

  // Runs whenever page or search query changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="container">
      <div className="search-bar">
        <input
          className="input"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search posts"
        />
        <button
          className="button btn-primary"
          onClick={() => {
            setPage(1);
            fetchPosts();
          }}
        >
          Search
        </button>
      </div>

      <ul className="post-list">
        {posts.map(p => (
          <li key={p._id} className="post-item card">
            {p.imageURL && (
              <img
                className="post-image"
                src={p.imageURL}
                alt=""
              />
            )}
            <div className="post-content">
              <h3 className="post-title">
                <Link to={`/posts/${p._id}`}>{p.title}</Link>
              </h3>
              <div className="post-meta">
                by {p.username} • {new Date(p.createdAt).toLocaleString()}
              </div>
              <p className="post-excerpt">{p.content.substring(0, 120)}...</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span> Page {page} </span>
        <button className="page-btn" onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
