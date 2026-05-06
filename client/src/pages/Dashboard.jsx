import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  todo: { label: 'Todo', color: '#64748b', bg: '#f1f5f9' },
  'in-progress': { label: 'In Progress', color: '#d97706', bg: '#fffbeb' },
  completed: { label: 'Completed', color: '#059669', bg: '#ecfdf5' },
};

const PRIORITY_CONFIG = {
  low: { color: '#3b82f6', bg: '#eff6ff' },
  medium: { color: '#d97706', bg: '#fffbeb' },
  high: { color: '#ef4444', bg: '#fef2f2' },
};

function StatCard({ label, value, icon, accent, sub }) {
  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e8e8f0',
    borderRadius: '24px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    minWidth: '200px'
  };

  const iconBoxStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `${accent}12`,
    color: accent,
    fontSize: '20px',
    marginBottom: '20px'
  };

  return (
    <div style={cardStyle}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: accent, opacity: 0.05 }} />
      <div style={iconBoxStyle}>{icon}</div>
      <p style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px 0', color: '#0f0f13', fontFamily: 'Syne, sans-serif' }}>{value || 0}</p>
      <p style={{ fontSize: '14px', fontWeight: '600', color: '#8888a8', margin: 0 }}>{label}</p>
      {sub && <p style={{ fontSize: '11px', marginTop: '6px', color: accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("Dashboard Fetch Error:", err);
        setError(true);
      });
  }, []);

  if (error) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
      <p>Failed to load dashboard data. Please check your connection.</p>
    </div>
  );

  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <div style={{ width: '30px', height: '30px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '10px' }}>
      {/* Header Area */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{today}</p>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f0f13', margin: 0, fontFamily: 'Syne, sans-serif' }}>
          Welcome back, <span style={{ color: '#6366f1' }}>{user?.name?.split(' ')[0] || 'User'}</span>!
        </h1>
        <p style={{ color: '#8888a8', marginTop: '8px', fontSize: '16px' }}>Here is a summary of your team's performance today.</p>
      </div>

      {/* Grid of Stats */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <StatCard label="Total Tasks" value={stats?.total} icon="📋" accent="#6366f1" sub="Platform-wide" />
        <StatCard label="Completed" value={stats?.completed} icon="✅" accent="#059669" sub={`${stats?.total ? Math.round(stats.completed / stats.total * 100) : 0}% success`} />
        <StatCard label="In Progress" value={stats?.inProgress} icon="⚡" accent="#d97706" sub="Immediate focus" />
        <StatCard label="Overdue" value={stats?.overdue} icon="⚠️" accent="#ef4444" sub="Attention required" />
      </div>

      {/* Tasks Table/List Container */}
      <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e8e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0f0f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, fontFamily: 'Syne, sans-serif' }}>My Priority Tasks</h2>
            <p style={{ fontSize: '13px', color: '#8888a8', margin: '4px 0 0 0' }}>Latest assignments across all active projects</p>
          </div>
          <Link to="/tasks" style={{ background: '#f4f4f8', color: '#6366f1', textDecoration: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>View All</Link>
        </div>

        <div style={{ minHeight: '100px' }}>
          {/* CRITICAL FIX: Added Optional Chaining and fallback to 0 */}
          {(stats?.myTasks?.length || 0) === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: '#8888a8', fontWeight: '600' }}>No tasks assigned to you right now. 🎉</p>
            </div>
          ) : stats.myTasks.map(task => {
            const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
            const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            
            return (
              <div key={task._id} style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8f8fc', transition: 'background 0.2s' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: sc.color, marginRight: '20px', flexShrink: 0 }} />
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '700', fontSize: '15px', color: '#0f0f13', margin: 0 }}>{task.title}</p>
                  <p style={{ fontSize: '12px', color: '#8888a8', margin: '4px 0 0 0' }}>{task.project?.name || 'General Project'}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase', background: pc.bg, color: pc.color }}>
                    {task.priority}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase', background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
