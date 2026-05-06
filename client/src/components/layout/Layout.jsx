import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f8' }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', padding: '32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}