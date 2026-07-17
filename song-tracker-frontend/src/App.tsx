import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { LoadingOrError } from "@/components/LoadingOrError";
import { Head } from "./components/Head";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SearchResultsList } from "./pages/SearchResultsPage";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Suspense fallback={<LoadingOrError />}>
        <Head title="SongTracker" />
        <div className="flex h-dvh flex-col">
          <Navbar />
          <Routes>
            <Route element={<HomePage />} index={true} />
            <Route element={<SearchResultsList />} path="/search" />
            <Route element={<LoginPage />} path="/login" />
          </Routes>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
