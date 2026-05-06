import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const styles = {
    container: { 
      minHeight: '100vh', 
      display: 'flex', 
      background: '#0f0f13', 
      color: 'white', 
      fontFamily: 'Inter, system-ui, sans-serif' 
    },
    leftPanel: { 
      flex: 1.2, 
      padding: '80px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f13 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    rightPanel: { 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '40px', 
      background: '#12121a' 
    },
    formCard: { width: '100%', maxWidth: '380px' },
    label: { 
      display: 'block', 
      fontSize: '11px', 
      fontWeight: '700', 
      color: '#6b6b8a', 
      textTransform: 'uppercase', 
      marginBottom: '8px', 
      letterSpacing: '1px' 
    },
    input: { 
      width: '100%', 
      padding: '16px 20px', 
      borderRadius: '16px', 
      background: '#1a1a24', 
      border: '1px solid #2a2a3a', 
      color: 'white', 
      fontSize: '14px',
      marginBottom: '20px', 
      boxSizing: 'border-box', 
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: { 
      width: '100%', 
      padding: '16px', 
      borderRadius: '16px', 
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
      color: 'white', 
      border: 'none', 
      fontWeight: '700', 
      cursor: 'pointer', 
      fontSize: '14px',
      marginTop: '10px',
      boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
    },
    error: { color: '#ef4444', fontSize: '11px', marginTop: '-15px', marginBottom: '15px', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      {/* Left Decoration Panel */}
      <div style={styles.leftPanel} className="login-visual">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ 
            width: '44px', height: '44px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' 
          }}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: '24px', height: '24px' }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '800', margin: '0 0 16px 0', letterSpacing: '-1px', lineHeight: 1.1 }}>
            Elevate your <br />
            <span style={{ color: '#818cf8' }}>Team Workflow.</span>
          </h1>
          <p style={{ color: '#8888a8', fontSize: '18px', maxWidth: '400px', lineHeight: '1.6' }}>
            The all-in-one workspace for modern teams to ship projects faster.
          </p>
        </div>
        {/* Abstract background orb */}
        <div style={{ 
          position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', 
          background: '#6366f1', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%' 
        }} />
      </div>

      {/* Right Form Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: '#6b6b8a', fontSize: '14px' }}>Enter your details to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label style={styles.label}>Email Address</label>
            <input 
              {...register('email', { required: 'Email is required' })} 
              type="email" 
              placeholder="name@company.com" 
              style={styles.input} 
            />
            {errors.email && <p style={styles.error}>{errors.email.message}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={styles.label}>Password</label>
              <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>Forgot?</span>
            </div>
            <input 
              {...register('password', { required: 'Password is required' })} 
              type="password" 
              placeholder="••••••••" 
              style={styles.input} 
            />
            {errors.password && <p style={styles.error}>{errors.password.message}</p>}

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? 'Signing in...' : 'Sign In to Workspace →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px', color: '#6b6b8a' }}>
            New here? <Link to="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '700' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
