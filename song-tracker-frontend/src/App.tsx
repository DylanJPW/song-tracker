import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { LoadingOrError } from "@/components/LoadingOrError";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MySongsPage } from "@/pages/MySongsPage";
import { SongDetailsPage } from "@/pages/SongDetailsPage";
import { Head } from "./components/Head";
import { Navbar } from "./components/navigation/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Head title="SongTracker" />
      <AuthProvider>
        <main className="flex min-h-dvh flex-col grow pb-24 md:pb-0">
          <Navbar />
          <AppRoutes />
          <ToastContainer
            autoClose={5000}
            hideProgressBar={true}
            position="top-right"
            theme="light"
          />
        </main>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <ErrorBoundary fallbackRender={renderError} resetKeys={[isLoggedIn]}>
      <Suspense fallback={<LoadingOrError />}>
        <Routes>
          <Route element={<HomePage />} index={true} />
          <Route element={<SearchResultsPage />} path="/search" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<SongDetailsPage />} path="/songs/:spotifyId" />
          <Route element={<ProtectedRoute />}>
            <Route element={<MySongsPage />} path="/songs" />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}