import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';

import { Loader2 } from 'lucide-react';

/* =========================================
   PROTECTED ROUTE
========================================= */

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  /* Modern Loading Screen */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden relative">
        
        {/* Glow Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />

        {/* Loader Card */}
        <div className="relative z-10 flex flex-col items-center gap-5 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl px-10 py-8 shadow-2xl">
          
          <div className="animate-spin">
            <Loader2 className="w-12 h-12 text-indigo-400" />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              Loading TaskFlow
            </h2>

            <p className="text-sm text-slate-300 mt-1">
              Preparing your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

/* =========================================
   APP
========================================= */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        {/* Global Toaster */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,

            style: {
              background: 'rgba(15, 23, 42, 0.92)',
              color: '#fff',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(18px)',
              padding: '14px 18px',
              boxShadow:
                '0 10px 30px rgba(0,0,0,0.25)',
              fontSize: '14px',
              fontWeight: '500',
            },

            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },

            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Routes */}
        <Routes>

          {/* Public Routes */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="projects"
              element={<Projects />}
            />

            <Route
              path="projects/:id"
              element={<ProjectDetail />}
            />

            <Route
              path="tasks"
              element={<Tasks />}
            />
          </Route>

          {/* Fallback Route */}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}