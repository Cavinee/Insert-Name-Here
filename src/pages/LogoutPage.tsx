// LogoutPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utility/use-auth-client';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      // Execute logout function from auth context
      logout();
      
      // Redirect to home page
      navigate('/', { replace: true });
    };

    performLogout();
  }, [logout, navigate]);

  // Show a loading message while logging out
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p>Please wait while we log you out.</p>
      </div>
    </div>
  );
}