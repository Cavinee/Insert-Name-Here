import { AppRoutes } from "./routes/AppRoutes"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider, useAuth } from "./utility/use-auth-client"
import { useState, useEffect } from "react"
import { backend } from "./utility/backend";

const AppContent = () => {
  const { isAuthenticated, principal } = useAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const USE_DUMMY_USER = true;
  useEffect(() => {
    const checkIfRegistered = async () => {
      if (isAuthenticated && principal) {
        try {
          // ✅ Use dummy override in development
          if (USE_DUMMY_USER) {
            console.log("🧪 Using dummy registered user.");
            setIsRegistered(true);
          } else {
            const result = await backend.hasProfile(principal);
            setIsRegistered(result);
          }
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
      setLoading(false);
    };
  
    if (isAuthenticated && principal) {
      checkIfRegistered();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, principal]);
  
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
