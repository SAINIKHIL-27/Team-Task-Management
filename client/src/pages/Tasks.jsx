import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in-progress', 'completed'];
const STATUS_CONFIG = {
  todo: { label: 'Todo', color: '#64748b', bg: '#f1f5f9' },
  'in-progress': { label: 'In Progress', color: '#d97706', bg: '#fffbeb' },
  completed: { label: 'Completed', color: '#059669', bg: '#ecfdf5' },
};
const PRIORITY_CONFIG = {
  low: { color: '#3b82f6', bg: '#eff6ff', dot: '#93c5fd' },
  medium: { color: '#d97706', bg: '#fffbeb', dot: '#fcd34d' },
  high: { color: '#ef4444', bg: '#fef2f2', dot: '#fca5a5' },
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = tasks.filter(t => {
    const statusOk = filter === 'all' || t.status === filter;
    const priorityOk = priorityFilter === 'all' || t.priority === priorityFilter;
    return statusOk && priorityOk;
  });

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const styles = {
    header: { marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: '800', margin: 0, color: '#0f0f13', fontFamily: 'Syne, sans-serif' },
    subtitle: { fontSize: '14px', color: '#8888a8', marginTop: '4px' },
    gridStats: { display: 'flex', gap: '16px', marginBottom: '32px' },
    statBox: { flex: 1, background: 'white', padding: '16px 20px', borderRadius: '20px', border: '1px solid #e8e8f0', display: 'flex', alignItems: 'center', gap: '16px' },
    filterBar: { display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' },
    filterGroup: { background: '#f4f4f8', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' },
    filterBtn: (active) => ({
      padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '700',
      cursor: 'pointer', transition: '0.2s',
      background: active ? 'white' : 'transparent',
      color: active ? '#6366f1' : '#8888a8',
      boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
    }),
    table: { background: 'white', borderRadius: '24px', border: '1px solid #e8e8f0', overflow: 'hidden' },
    tableHeader: { background: '#f8f8fc', padding: '12px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', borderBottom: '1px solid #e8e8f0', fontSize: '11px', fontWeight: '800', color: '#8888a8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    taskRow: { padding: '16px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', borderBottom: '1px solid #f4f4f8', alignItems: 'center' }
  };

  return (
    <div style={{ padding: '10px' }}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>All Tasks</h1>
        <p style={styles.subtitle}>Manage every assignment across your workspace projects.</p>
      </div>

      {/* Mini Stats Summary */}
      <div style={styles.gridStats}>
        {STATUS_OPTIONS.map(s => (
          <div key={s} style={styles.statBox}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_CONFIG[s].color }} />
            <div>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{counts[s]}</p>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#8888a8', textTransform: 'uppercase' }}>{STATUS_CONFIG[s].label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Controls */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <button onClick={() => setFilter('all')} style={styles.filterBtn(filter === 'all')}>All Status</button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={styles.filterBtn(filter === s)}>{STATUS_CONFIG[s].label}</button>
          ))}
        </div>

        <div style={styles.filterGroup}>
          <button onClick={() => setPriorityFilter('all')} style={styles.filterBtn(priorityFilter === 'all')}>All Priority</button>
          {['low', 'medium', 'high'].map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)} style={styles.filterBtn(priorityFilter === p)}>{p.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Task Table */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Task Title</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8888a8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#8888a8' }}>No tasks found matching these filters.</div>
        ) : (
          filtered.map(task => {
            const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
            const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            return (
              <div key={task._id} style={styles.taskRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: pc.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f0f13' }}>{task.title}</span>
                </div>
                
                <span style={{ fontSize: '13px', color: '#8888a8' }}>{task.project?.name || '—'}</span>
                
                <div>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px', background: pc.bg, color: pc.color }}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>

                <select 
                  value={task.status} 
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                  style={{ background: '#f4f4f8', border: 'none', padding: '6px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', width: 'fit-content' }}
                >
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{STATUS_CONFIG[opt].label}</option>)}
                </select>

                <button onClick={() => deleteTask(task._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
