import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projects')
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/projects', data);
      toast.success('Project created!');
      reset();
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating project');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch {
      toast.error('Error deleting');
    }
  };

  const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    title: { fontSize: '36px', fontWeight: '800', margin: 0, color: '#0f0f13', fontFamily: 'Syne, sans-serif' },
    subtitle: { color: '#8888a8', fontSize: '16px', margin: '4px 0 0 0' },
    addButton: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
    statCard: { flex: 1, background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e8e8f0' },
    projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    projectCard: { background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #e8e8f0', position: 'relative', transition: 'transform 0.2s' },
    cardIcon: { width: '48px', height: '48px', borderRadius: '14px', background: '#f4f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '20px' },
    input: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e8e8f0', background: '#f8f8fc', marginBottom: '16px', outline: 'none' },
    submitBtn: { background: '#6366f1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }
  };

  const gradients = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#8888a8' }}>Loading projects...</div>;

  return (
    <div style={{ padding: '10px' }}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>Manage your team workspaces and track their health.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? 'Close' : '+ New Project'}
        </button>
      </div>

      {/* Mini Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={{ margin: 0, color: '#8888a8', fontSize: '13px', fontWeight: '700' }}>TOTAL PROJECTS</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: '800' }}>{projects.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={{ margin: 0, color: '#8888a8', fontSize: '13px', fontWeight: '700' }}>TEAM MEMBERS</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: '800' }}>
            {projects.reduce((acc, p) => acc + (p.members?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e8e8f0', marginBottom: '40px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Syne, sans-serif' }}>Create New Project</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name', { required: true })} placeholder="Project Name" style={styles.input} />
            <textarea {...register('description')} placeholder="Project Description" style={{ ...styles.input, height: '100px', resize: 'none' }} />
            <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {/* Grid */}
      <div style={styles.projectGrid}>
        {projects.map((p, i) => (
          <div key={p._id} style={styles.projectCard}>
            <div style={{ ...styles.cardIcon, color: 'white', background: gradients[i % gradients.length] }}>📁</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#0f0f13' }}>{p.name}</h3>
            <p style={{ margin: '0 0 20px 0', color: '#8888a8', fontSize: '14px', lineHeight: '1.5', height: '42px', overflow: 'hidden' }}>
              {p.description || 'No description provided.'}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f4f4f8' }}>
              <Link to={`/projects/${p._id}`} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                Open Dashboard →
              </Link>
              <button onClick={() => deleteProject(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
