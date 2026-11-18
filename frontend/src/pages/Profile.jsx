import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#141414]">
      <div className="w-full max-w-md bg-black/80 border border-gray-800 backdrop-blur-md rounded-lg p-8 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-800">
          <div className="w-16 h-16 rounded bg-[#E50914] flex items-center justify-center text-white font-black text-2xl shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{user?.name || 'Account Profile'}</h1>
            <p className="text-sm text-gray-400">CineVault Member</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-[#1e1e1e] p-4 rounded border border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Full Name
            </span>
            <span className="text-white font-medium text-base capitalize">
              {user?.name || 'Not available'}
            </span>
          </div>

          <div className="bg-[#1e1e1e] p-4 rounded border border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Email Address
            </span>
            <span className="text-white font-medium text-base">
              {user?.email || 'Not available'}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleLogout}
          variant="primary"
          className="w-full py-3 text-base font-bold bg-[#E50914] hover:bg-[#b9090b]"
        >
          Sign Out!
        </Button>
      </div>
    </section>
  );
}

export default Profile;

