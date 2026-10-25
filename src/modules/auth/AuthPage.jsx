import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AuthPage.css'

const googleIcon = (
  <svg className="google-mark" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z"
    />
    <path
      fill="#34A853"
      d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
    />
    <path
      fill="#FBBC05"
      d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
    />
    <path
      fill="#EA4335"
      d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
    />
  </svg>
)

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '838022142167-5ft4t6jjv5lthni2pod4rq52glgflgnp.apps.googleusercontent.com'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export default function AuthPage({ initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode)
  const [prefilledEmail, setPrefilledEmail] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup')
    } else if (location.pathname === '/signin') {
      setMode('signin')
    }
  }, [location.pathname])

  const changeMode = (nextMode, emailToKeep = '') => {
    const path = nextMode === 'signup' ? '/signup' : '/signin'
    navigate(path, { replace: true })
    setMode(nextMode)
    if (emailToKeep) {
      setPrefilledEmail(emailToKeep)
    }
  }

  return (
    <main className="auth-page">
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/adeon-background.mp4" type="video/mp4" />
      </video>

      <div className="auth-shell">
        <section className="story-panel" aria-label="Travel introduction">
          <div className="story-copy">
            <h1>
              Your
              <br />
              Next Adventure
              <br />
              Awaits!
            </h1>
            <p>
              Log in to unlock exclusive deals, plan your dream escapes, and
              pick up where you left off. Whether it&apos;s mountains, beaches,
              or city lights.
            </p>
            <p className="closing-line">Your journey starts here.</p>
          </div>
        </section>

        <section
          className="form-panel"
          aria-label={mode === 'signin' ? 'Sign in form' : 'Create account form'}
        >
          <AuthForm
            mode={mode}
            onModeChange={changeMode}
            prefilledEmail={prefilledEmail}
          />
        </section>
      </div>
    </main>
  )
}

function AuthForm({ mode, onModeChange, prefilledEmail = '' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [emailInput, setEmailInput] = useState(prefilledEmail)
  const [passwordInput, setPasswordInput] = useState('')
  const [selectedRole, setSelectedRole] = useState('traveler')
  const isSignup = mode === 'signup'

  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (prefilledEmail) {
      setEmailInput(prefilledEmail)
    }
  }, [prefilledEmail])

  // Google Identity Services (GIS) One-Tap / ID Token listener
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
              if (response.credential) {
                const data = parseJwt(response.credential)
                if (data && data.email) {
                  handleGoogleSuccess({
                    email: data.email,
                    name: data.name || data.given_name,
                    avatar: data.picture,
                  })
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          })
        } catch (e) {
          console.warn('Google Identity initialization notice:', e)
        }
      }
    }

    if (window.google?.accounts?.id) {
      initGsi()
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer)
          initGsi()
        }
      }, 500)
      return () => clearInterval(timer)
    }
  }, [selectedRole, isSignup])

  const handleGoogleSuccess = ({ email, name, avatar }) => {
    setMessage('')
    setIsError(false)
    const res = signInWithGoogle({
      email,
      name,
      avatar,
      role: isSignup ? selectedRole : 'traveler',
    })

    if (res.success) {
      if (res.role === 'guide') {
        const fromPath = location.state?.from?.pathname
        const destination =
          fromPath && fromPath.startsWith('/guide') ? fromPath : '/guide'
        navigate(destination, { replace: true })
      } else {
        const fromPath = location.state?.from?.pathname
        const destination =
          fromPath &&
          !fromPath.startsWith('/guide') &&
          fromPath !== '/signin' &&
          fromPath !== '/signup'
            ? fromPath
            : '/'
        navigate(destination, { replace: true })
      }
    }
  }

  const handleGoogleSignIn = () => {
    setMessage('')
    setIsError(false)

    if (typeof window === 'undefined' || !window.google?.accounts) {
      setIsError(true)
      setMessage(
        'Google authentication is loading. Please check your network connection or try again in a few moments.'
      )
      return
    }

    try {
      // 1. Preferred modern Google OAuth 2.0 Token Client (Opens interactive popup)
      if (window.google.accounts.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setIsError(true)
              setMessage(
                `Google Sign-In: ${tokenResponse.error_description || tokenResponse.error}`
              )
              return
            }
            if (tokenResponse.access_token) {
              try {
                const res = await fetch(
                  'https://www.googleapis.com/oauth2/v3/userinfo',
                  {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  }
                )
                const profile = await res.json()
                if (profile.email) {
                  handleGoogleSuccess({
                    email: profile.email,
                    name: profile.name || profile.given_name,
                    avatar: profile.picture,
                  })
                }
              } catch (fetchErr) {
                setIsError(true)
                setMessage('Could not retrieve Google profile data.')
              }
            }
          },
          error_callback: (err) => {
            console.warn('OAuth client prompt fallback:', err)
            if (window.google.accounts.id) {
              window.google.accounts.id.prompt()
            }
          },
        })
        client.requestAccessToken({ prompt: 'select_account' })
      } else if (window.google.accounts.id) {
        // 2. Fallback to GIS prompt
        window.google.accounts.id.prompt()
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setIsError(true)
      setMessage(
        'Could not initialize Google Sign-In. Please ensure popups are allowed for this site.'
      )
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('')
    setIsError(false)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || emailInput || '').trim()
    const password = String(formData.get('password') || passwordInput || '').trim()
    const fullName = String(formData.get('fullName') || '').trim()
    const role = String(formData.get('accountRole') || selectedRole || 'traveler')

    if (!email) {
      setIsError(true)
      setMessage('Please enter a valid email address.')
      return
    }

    if (isSignup) {
      if (!fullName) {
        setIsError(true)
        setMessage('Please enter your full name.')
        return
      }

      const res = signUp({ fullName, email, role, password })
      if (!res.success) {
        setIsError(true)
        setMessage(res.message)
        if (res.exists) {
          // Switch to signin
          setTimeout(() => onModeChange('signin', email), 1400)
        }
        return
      }

      // Successful registration: Route conditionally based on role
      if (res.role === 'guide') {
        navigate('/guide', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } else {
      // Sign in
      const res = signIn({ email, password })
      if (!res.success) {
        setIsError(true)
        setMessage(res.message)
        if (res.notFound) {
          // Auto switch to sign up
          setTimeout(() => {
            onModeChange('signup', email)
          }, 1500)
        }
        return
      }

      // Successful sign in: Route conditionally based on user role & target
      if (res.role === 'guide') {
        const fromPath = location.state?.from?.pathname
        const destination =
          fromPath && fromPath.startsWith('/guide') ? fromPath : '/guide'
        navigate(destination, { replace: true })
      } else {
        const fromPath = location.state?.from?.pathname
        const destination =
          fromPath &&
          !fromPath.startsWith('/guide') &&
          fromPath !== '/signin' &&
          fromPath !== '/signup'
            ? fromPath
            : '/'
        navigate(destination, { replace: true })
      }
    }
  }

  const handleModeSwitch = (event) => {
    event.preventDefault()
    setMessage('')
    setIsError(false)
    setShowPassword(false)
    onModeChange(isSignup ? 'signin' : 'signup', emailInput)
  }


  return (
    <div className="form-content">
      <h2 className="form-heading">
        {isSignup ? 'Create your account' : 'Welcome Back!'}
      </h2>
      <p className="form-subtitle">
        {isSignup
          ? 'Join WanderWise and start planning your next journey.'
          : 'Sign in to your WanderWise account and continue planning.'}
      </p>

      <form key={mode} onSubmit={handleSubmit}>
        {isSignup && (
          <fieldset className="role-fieldset">
            <legend className="role-label">I want to join WanderWise as a…</legend>
            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="accountRole"
                  value="traveler"
                  checked={selectedRole === 'traveler'}
                  onChange={() => setSelectedRole('traveler')}
                  required
                />
                <span className="role-card">
                  <span className="role-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="3.2" />
                      <path d="M5.5 20v-1.8a6.5 6.5 0 0 1 13 0V20" />
                      <path d="M8.5 12.7 12 15l3.5-2.3" />
                    </svg>
                  </span>
                  <span>
                    <span className="role-name">Traveler</span>
                    <span className="role-description">Plan trips and explore</span>
                  </span>
                </span>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="accountRole"
                  value="guide"
                  checked={selectedRole === 'guide'}
                  onChange={() => setSelectedRole('guide')}
                  required
                />
                <span className="role-card">
                  <span className="role-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m12 3 8 4.2v5.3c0 4.4-3.2 7.2-8 8.5-4.8-1.3-8-4.1-8-8.5V7.2L12 3Z" />
                      <path d="m8.5 12 2.2 2.2 4.8-5" />
                    </svg>
                  </span>
                  <span>
                    <span className="role-name">Travel Guide</span>
                    <span className="role-description">Share local expertise</span>
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
        )}

        {isSignup && (
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="password-input"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={isSignup ? 'Create a password (e.g. 1234)' : 'Enter your password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
            <button
              type="button"
              className="toggle-password"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                  <path d="M9.363 5.365A9.466 9.466 0 0 1 12 5c4 0 7.333 2.333 10 7-.79 1.383-1.748 2.585-2.873 3.606" />
                  <path d="M6.228 6.228C4.372 7.625 2.88 9.531 2 12c2.667 4.667 6 7 10 7 1.625 0 3.125-.39 4.5-.96" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="remember">
            <input type="checkbox" name="rememberMe" defaultChecked />
            <span>Remember me</span>
          </label>
          {!isSignup && (
            <a href="#forgot" onClick={(e) => { e.preventDefault(); setMessage('Password reset instructions sent to your email.'); }}>
              Forgot password?
            </a>
          )}
        </div>

        <button type="submit" className="primary-button">
          {isSignup ? 'Create Account' : 'Sign In'}
        </button>

        <div className="divider">or continue with</div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleSignIn}
        >
          {googleIcon}
          <span>Sign {isSignup ? 'up' : 'in'} with Google</span>
        </button>

        {message && (
          <p
            className={`form-message ${isError ? 'is-error' : ''}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <p className="switch-note">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <a href={isSignup ? '/signin' : '/signup'} onClick={handleModeSwitch}>
            {isSignup ? 'Sign in' : 'Create an account'}
          </a>
        </p>
      </form>
    </div>
  )
}
