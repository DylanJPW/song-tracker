import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { LoadingOrError } from "@/components/LoadingOrError";
import { Head } from "./components/Head";
import { HomePage } from "./pages/HomePage";
import { SearchResultsList } from "./pages/SearchResultsPage";
import { Navbar } from "./components/Navbar";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Suspense fallback={<LoadingOrError />}>
        <Head title="SongTracker" />
        <Navbar />
        <Routes>
          <Route element={<HomePage />} index={true} />
          <Route element={<SearchResultsList />} path="/search" />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
