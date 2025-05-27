import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'

const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	if (isCheckingAuth && !authUser) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<span className='loading loading-spinner loading-xl'></span>
			</div>
		)
	}
	return (
		<div>
			<Navbar />
			<Routes>
				<Route
					path='/'
					element={authUser ? <HomePage /> : <Navigate to='/login' />}
				/>
				<Route
					path='/signup'
					element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
				/>
				<Route
					path='/login'
					element={!authUser ? <LoginPage /> : <Navigate to='/' />}
				/>
				<Route path='/settings' element={<SettingsPage />} />
				<Route
					path='/profile'
					element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
				/>

				<Route path='*' element={<NotFoundPage />} />
			</Routes>

			<Toaster position='top-center' />
		</div>
	)
}
export default App
