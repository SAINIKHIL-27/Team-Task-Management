import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  // Inline styles to ensure it looks good even without Tailwind
  const styles = {
    container: { minHeight: '100vh', display: 'flex', background: '#0f0f13', color: 'white', fontFamily: 'sans-serif' },
    leftPanel: { flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f13 100%)' },
    rightPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#12121a' },
    formCard: { width: '100%', maxWidth: '400px' },
    input: { width: '100%', padding: '14px 20px', borderRadius: '16px', background: '#1a1a24', border: '1px solid #2a2a3a', color: 'white', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' },
    button: { width: '100%', padding: '14px', borderRadius: '16px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
    label: { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#6b6b8a', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }
  };

  return (
    <div style={styles.container}>
      {/* Left Decoration Panel */}
      <div style={styles.leftPanel} className="hidden-mobile">
        <div style={{ marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '20px' }}>⚡</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Join TaskFlow.</h1>
          <p style={{ color: '#8888a8', fontSize: '18px', maxWidth: '360px', lineHeight: '1.6' }}>The smartest way for teams to collaborate and ship projects.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#6b6b8a', fontSize: '14px', marginBottom: '32px' }}>Enter your details to get started.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label style={styles.label}>Full Name</label>
            <input {...register('name', { required: 'Required' })} placeholder="Full Name" style={styles.input} />

            <label style={styles.label}>Email Address</label>
            <input {...register('email', { required: 'Required' })} type="email" placeholder="Email" style={styles.input} />

            <label style={styles.label}>Password</label>
            <input {...register('password', { required: 'Required', minLength: 6 })} type="password" placeholder="••••••••" style={styles.input} />

            <label style={styles.label}>Your Role</label>
            <select {...register('role')} style={styles.input}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b6b8a' }}>
            Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
