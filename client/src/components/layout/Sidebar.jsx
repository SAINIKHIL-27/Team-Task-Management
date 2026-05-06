import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const navItems = [
    { to: '/', label: 'Dashboard', emoji: '⊞' },
    { to: '/projects', label: 'Projects', emoji: '📁' },
    { to: '/tasks', label: 'Tasks', emoji: '✓' },
  ];

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, width: '240px', height: '100vh',
      background: '#0f0f13', borderRight: '1px solid #1e1e2e',
      display: 'flex', flexDirection: 'column', zIndex: 50, overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '16px', fontWeight: 'bold'
          }}>⚡</div>
          <span style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px' }}>
            TaskFlow
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: '0 24px 8px' }}>
        <span style={{ color: '#3a3a5c', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Navigation
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '0 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '12px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 500, transition: 'all 0.15s',
              background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: isActive ? '#a5b4fc' : '#6b6b8a',
              border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
            })}>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.emoji}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div style={{ padding: '16px 12px' }}>
        <div style={{
          background: '#16161f', border: '1px solid #1e1e2e',
          borderRadius: '16px', padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '12px', fontWeight: 'bold',
              fontFamily: 'Syne, sans-serif'
            }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0,
                fontFamily: 'Syne, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ color: '#6366f1', fontSize: '11px', margin: '2px 0 0', textTransform: 'capitalize' }}>
                {user?.role}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', borderRadius: '10px',
            background: '#0f0f13', border: '1px solid #1e1e2e',
            color: '#6b6b8a', fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1e1e2e'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0f0f13'; e.currentTarget.style.color = '#6b6b8a'; }}>
            ↪ Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}