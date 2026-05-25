import { useEffect, useState } from "react";
import { LoginPage } from "./components/auth/LoginPage";
import { DashboardApp } from "./components/cms/DashboardApp";
import { clearAuthToken, getMe, login, TOKEN_KEY, type AuthUser } from "./lib/api";

function App() {
  const [me, setMe] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsCheckingAuth(false);
      return;
    }

    const verifyCurrentUser = async () => {
      try {
        const currentUser = await getMe();

        setToken(storedToken);
        setMe(currentUser);
      } catch (_error) {
        clearAuthToken();
        setToken(null);
        setMe(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    void verifyCurrentUser();
  }, []);

  async function handleLogin(credentials: { userName: string; password: string }) {
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const result = await login(credentials);
      setToken(result.token);
      const currentUser = await getMe();
      setMe(currentUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat login";
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Memeriksa sesi login...</p>
      </main>
    );
  }

  if (!token) {
    return <LoginPage loading={isLoggingIn} errorMessage={loginError} onSubmit={handleLogin} />;
  }

  return <DashboardApp currentUser={me} />;
}

export default App;
