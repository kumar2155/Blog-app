import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { authHeader } from '../utils/auth';

export default function CreateEdit({ edit }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    imageURL: '',
    content: ''
  });

  // Fetch post when editing
  useEffect(() => {
    if (edit && id) {
      api.get(`/posts/${id}`)
        .then(res => {
          setForm({
            title: res.data.title || "",
            imageURL: res.data.imageURL || "",
            content: res.data.content || ""
          });
        })
        .catch(err => {
          console.error("Error loading post:", err);
          alert("Failed to load post");
        });
    }
  }, [edit, id]);

  // Submit handler
  async function submit(e) {
    e.preventDefault();
    // Client-side validation to avoid submitting invalid values
    const errors = [];
    const title = (form.title || '').trim();
    const content = (form.content || '').trim();
    const imageURL = (form.imageURL || '').trim();

    if (!title) errors.push('Title is required');
    else if (title.length < 5 || title.length > 120) errors.push('Title must be between 5 and 120 characters');

    if (!content) errors.push('Content is required');
    else if (content.length < 50) errors.push('Content must be at least 50 characters');

    if (imageURL) {
      try {
        // eslint-disable-next-line no-new
        new URL(imageURL);
      } catch (e) {
        errors.push('Image URL must be a valid URL');
      }
    }

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    try {
      // don't send empty imageURL to server (treat as absent)
      const payload = { ...form };
      if (!payload.imageURL || payload.imageURL.trim() === '') delete payload.imageURL;

      if (edit) {
        await api.put(`/posts/${id}`, payload, { headers: authHeader() });
      } else {
        await api.post('/posts', payload, { headers: authHeader() });
      }

      nav('/');
    } catch (err) {
      console.error('Server Error:', err);
      const resp = err.response?.data;
      if (resp?.errors) alert(resp.errors.map(x => x.msg).join('\n'));
      else alert(resp?.message || 'Server Error');
    }
  }

  return (
    <div className="container">
      <form onSubmit={submit} className="form card">

        <div className="form-row">
          <label>Title</label>
          <input
            className="input"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-row">
          <label>Image URL <span className="optional">(optional)</span></label>
          <input
            className="input"
            placeholder="https://example.com/image.jpg"
            value={form.imageURL}
            onChange={e => setForm({ ...form, imageURL: e.target.value })}
          />
        </div>

        <div className="form-row">
          <label>Content</label>
          <textarea
            className="textarea"
            rows={8}
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div className="form-row">
          <button className="button btn-primary" type="submit">
            {edit ? "Update" : "Create"}
          </button>
        </div>

      </form>
    </div>
  );
}
