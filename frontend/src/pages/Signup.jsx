import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/login', { replace: true, state: { message: 'Account created. Please sign in.' } });
      return;
    }
    setError(result.message || 'Unable to create an account.');
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#141414]">
      <div className="w-full max-w-md bg-black/80 border border-gray-800 backdrop-blur-md rounded-lg p-8 sm:p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-left">Create Account</h1>
        {error && <p className="mb-4 text-sm text-red-500 bg-red-950/40 p-3 rounded border border-red-800">{error}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Email address"
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              minLength={8}
            />
          </div>

          <Button type="submit" disabled={submitting} variant="primary" className="w-full py-3 mt-2 text-base font-bold">
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col gap-3 text-sm text-gray-400">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline font-semibold ml-1">
              Sign in.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;

