import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in-progress', 'completed'];
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

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTask, setShowTask] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const fetchTasks = useCallback(() => {
    api.get(`/tasks?projectId=${id}`).then(res => setTasks(res.data));
  }, [id]);

  useEffect(() => {
    api.get(`/projects/${id}`).then(res => setProject(res.data));
    fetchTasks();
  }, [id, fetchTasks]);

  const createTask = async (data) => {
    try {
      await api.post('/tasks', { ...data, projectId: id });
      toast.success('Task created!');
      reset(); setShowTask(false); fetchTasks();
    } catch { toast.error('Error creating task'); }
  };

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    toast.success('Task deleted');
    fetchTasks();
  };

  const filtered = activeFilter === 'all' ? tasks : tasks.filter(t => t.status === activeFilter);
  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };
  const completedPct = tasks.length ? Math.round((counts.completed / tasks.length) * 100) : 0;

  if (!project) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading project...</div>;

  return (
    <div style={{ width: '100%' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '14px', marginBottom: '24px', color: '#8888a8' }}>
        <Link to="/projects" style={{ color: '#6366f1', textDecoration: 'none' }}>Projects</Link>
        <span>/</span>
        <span style={{ color: '#0f0f13', fontWeight: 600 }}>{project.name}</span>
      </div>

      {/* Project Header - Fixed Height and Layout */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', fontFamily: 'Syne, sans-serif' }}>{project.name}</h1>
          <p style={{ opacity: 0.9, fontSize: '15px', margin: 0 }}>{project.description || 'No description'}</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px', fontSize: '13px', opacity: 0.8 }}>
            <span>👥 {project.members?.length || 0} members</span>
            <span>📝 {tasks.length} tasks</span>
          </div>
        </div>

        {/* Progress Circle Wrapper - This div PREVENTS the stretching */}
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="white" strokeWidth="3"
              strokeDasharray={`${completedPct} ${100 - completedPct}`} strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'
          }}>
            {completedPct}%
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', background: '#e8e8f0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setActiveFilter(s)}
              style={{
                border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: '0.2s',
                background: activeFilter === s ? 'white' : 'transparent',
                color: activeFilter === s ? '#6366f1' : '#8888a8',
                boxShadow: activeFilter === s ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}>
              {s === 'all' ? `All (${tasks.length})` : `${STATUS_CONFIG[s].label} (${counts[s]})`}
            </button>
          ))}
        </div>

        <button onClick={() => setShowTask(!showTask)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
            border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer'
          }}>
          {showTask ? 'Close' : '+ Add Task'}
        </button>
      </div>

      {/* Create Task Form */}
      {showTask && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e8e8f0' }}>
          <form onSubmit={handleSubmit(createTask)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input {...register('title', { required: true })} placeholder="Task title" 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e8e8f0', outline: 'none' }} />
            <textarea {...register('description')} placeholder="Description" 
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e8e8f0', outline: 'none', minHeight: '80px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <select {...register('priority')} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #e8e8f0', flex: 1 }}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button disabled={isSubmitting} type="submit" 
                style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 600 }}>
                {isSubmitting ? 'Saving...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(task => (
          <div key={task._id} style={{
            background: 'white', padding: '16px', borderRadius: '16px', 
            border: '1px solid #e8e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{task.title}</h4>
              <span style={{ 
                fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                background: PRIORITY_CONFIG[task.priority].bg, color: PRIORITY_CONFIG[task.priority].color 
              }}>
                {task.priority}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}
                style={{ padding: '6px', borderRadius: '8px', border: '1px solid #e8e8f0', fontSize: '12px' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
              <button onClick={() => deleteTask(task._id)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
