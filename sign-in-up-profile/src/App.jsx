import { useEffect, useState } from 'react'
import Profile from './components/profile/Profile'
import AuthPage from './components/auth/AuthPage'
import AppHeader from './components/navigation/AppHeader'

/**
 * Root App component
 * Defaults to the primary "Profile" application replicating "adeon profile.html",
 * while supporting navigation to the Auth page demo.
 */
export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname
    if (path === '/signin' || path === '/signup') return 'auth'
    return 'profile'
  })

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path === '/signin' || path === '/signup') {
        setCurrentView('auth')
      } else {
        setCurrentView('profile')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleSelectView = (view) => {
    setCurrentView(view)
    const targetPath = view === 'auth' ? '/signin' : '/'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
  }

  return (
    <>
      <AppHeader currentView={currentView} onSelectView={handleSelectView} />
      {currentView === 'profile' ? (
        <Profile />
      ) : (
        <AuthPage
          initialMode={window.location.pathname === '/signup' ? 'signup' : 'signin'}
        />
      )}
    </>
  )
}
