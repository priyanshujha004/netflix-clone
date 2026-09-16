import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const successMessage = location.state?.message;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(location.state?.from?.pathname || '/browse', { replace: true });
      return;
    }
    setError(result.message || 'Unable to sign in.');
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#141414]">
      <div className="w-full max-w-md bg-black/80 border border-gray-800 backdrop-blur-md rounded-lg p-8 sm:p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-left">Sign In</h1>
        {successMessage && <p className="mb-4 text-sm text-green-400 font-medium">{successMessage}</p>}
        {error && <p className="mb-4 text-sm text-red-500 bg-red-950/40 p-3 rounded border border-red-800">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <Button type="submit" disabled={submitting} variant="primary" className="w-full py-3 mt-2 text-base font-bold">
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col gap-3 text-sm text-gray-400">
          <p>
            New to Netflix?{' '}
            <Link to="/signup" className="text-white hover:underline font-semibold ml-1">
              Sign up now.
            </Link>
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;

