import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { LoadingOrError } from "@/components/LoadingOrError";
import { SongList } from "./pages/SongList";

function renderError({ error }: FallbackProps) {
  return <LoadingOrError error={error} />;
}

export function App() {
  return (
    <ErrorBoundary fallbackRender={renderError}>
      <Suspense fallback={<LoadingOrError />}>
        <Routes>
          <Route element={<SongList />} index={true} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
