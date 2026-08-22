import {Suspense} from 'react'
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary'
import {Route, Routes} from 'react-router'
import {ToastContainer} from 'react-toastify'
import {LoadingOrError} from '@/components/LoadingOrError'
import {ProtectedRoute} from '@/components/ProtectedRoute'
import {MySongsPage} from '@/pages/MySongsPage'
import {SongDetailsPage} from '@/pages/SongDetailsPage'
import {Head} from './components/Head'
import {Navbar} from './components/navigation/Navbar'
import {AuthProvider} from './context/AuthContext'
import {HomePage} from './pages/HomePage'
import {LoginPage} from './pages/LoginPage'
import {SearchResultsList} from './pages/SearchResultsPage'

function renderError({error}: FallbackProps) {
	return <LoadingOrError error={error} />
}

export function App() {
	return (
		<ErrorBoundary fallbackRender={renderError}>
			<Suspense fallback={<LoadingOrError />}>
				<Head title='SongTracker' />
				<AuthProvider>
					<div className='flex min-h-dvh flex-col'>
						<Navbar />
						<main className='flex-1 pb-24 md:pb-0'>
							<Routes>
								<Route element={<HomePage />} index={true} />
								<Route element={<SearchResultsList />} path='/search' />
								<Route element={<LoginPage />} path='/login' />
								<Route element={<ProtectedRoute />}>
									<Route element={<MySongsPage />} path='/songs' />
									<Route
										element={<SongDetailsPage />}
										path='/songs/:spotifyId'
									/>
								</Route>
							</Routes>
						</main>
						<ToastContainer
							autoClose={5000}
							hideProgressBar={true}
							position='top-right'
							theme='light'
						/>
					</div>
				</AuthProvider>
			</Suspense>
		</ErrorBoundary>
	)
}
