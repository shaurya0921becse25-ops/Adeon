import { useEffect, useState } from 'react'
import backgroundVideo from '../../assets/adeon-background.mp4'
import '../../App.css'

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

export default function AuthPage({ initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode)

  useEffect(() => {
    const syncMode = () => {
      setMode(window.location.pathname === '/signup' ? 'signup' : 'signin')
    }
    window.addEventListener('popstate', syncMode)
    return () => window.removeEventListener('popstate', syncMode)
  }, [])

  const changeMode = (nextMode) => {
    const path = nextMode === 'signup' ? '/signup' : '/signin'
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setMode(nextMode)
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
        <source src={backgroundVideo} type="video/mp4" />
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
              or city lights
            </p>
            <p className="closing-line">Your journey starts here.</p>
          </div>
        </section>

        <section
          className="form-panel"
          aria-label={mode === 'signin' ? 'Sign in form' : 'Create account form'}
        >
          <AuthForm mode={mode} onModeChange={changeMode} />
        </section>
      </div>
    </main>
  )
}

function AuthForm({ mode, onModeChange }) {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const isSignup = mode === 'signup'

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fullName = String(formData.get('fullName') ?? '').trim()

    if (isSignup && !fullName) {
      event.currentTarget.elements.fullName.setCustomValidity(
        'Please enter your full name.',
      )
      event.currentTarget.reportValidity()
      return
    }

    setMessage(
      isSignup
        ? `Demo only: ${fullName}, your selected account type is ${formData.get('accountRole') === 'guide' ? 'Travel Guide' : 'Traveler'}. Connect your registration service to create the account.`
        : 'Demo only — connect your sign-in service to authenticate users.',
    )
  }

  const handleModeSwitch = (event) => {
    event.preventDefault()
    setMessage('')
    setShowPassword(false)
    onModeChange(isSignup ? 'signin' : 'signup')
  }

  const showServiceMessage = (event, text) => {
    event.preventDefault()
    setMessage(text)
  }

  return (
    <div className="form-content">
      <h2 className="form-heading">
        {isSignup ? 'Create your account' : 'Welcome Back!'}
      </h2>
      <p className="form-subtitle">
        {isSignup
          ? 'Join Adeon and start planning your next journey.'
          : 'Sign in to your Adeon account and continue planning your next journey.'}
      </p>

      <form key={mode} onSubmit={handleSubmit}>
        {isSignup ? (
          <>
            <fieldset className="role-fieldset">
              <legend className="role-label">I want to join Adeon as a…</legend>
              <div className="role-options">
                <label className="role-option">
                  <input
                    type="radio"
                    name="accountRole"
                    value="traveler"
                    defaultChecked
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

            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                pattern=".*\S.*"
                title="Enter at least one non-space character."
                onChange={(event) => event.currentTarget.setCustomValidity('')}
              />
            </div>
          </>
        ) : null}

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">
            {isSignup ? 'Create password' : 'Password'}
          </label>
          <div className="input-wrap">
            <input
              className="password-input"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={
                isSignup ? 'Create a strong password' : 'Enter your password'
              }
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={isSignup ? 8 : undefined}
              required
            />
            <button
              className="toggle-password"
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {showPassword ? (
                  <>
                    <path d="M3 3l18 18" />
                    <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6.1 0 9.5 6 9.5 6a15.7 15.7 0 0 1-3.1 3.7M6.2 6.8C3.8 8.4 2.5 12 2.5 12s3.4 6 9.5 6c1.2 0 2.3-.3 3.3-.7" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </>
                ) : (
                  <>
                    <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle cx="12" cy="12" r="2.7" />
                  </>
                )}
              </svg>
            </button>
          </div>
          {isSignup ? (
            <p className="password-note">Use at least 8 characters.</p>
          ) : null}
        </div>

        {isSignup ? (
          <label className="terms-row">
            <input type="checkbox" name="terms" required />
            <span>
              I agree to the{' '}
              <a
                href="#terms"
                onClick={(event) =>
                  showServiceMessage(
                    event,
                    'Add your published Terms of Service URL here.',
                  )
                }
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#privacy"
                onClick={(event) =>
                  showServiceMessage(
                    event,
                    'Add your published Privacy Policy URL here.',
                  )
                }
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        ) : (
          <div className="form-options">
            <label className="remember">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot-password"
              onClick={(event) =>
                showServiceMessage(
                  event,
                  'Connect your password-reset flow here.',
                )
              }
            >
              Forgot password?
            </a>
          </div>
        )}

        <button className="primary-button" type="submit">
          {isSignup ? 'Create account' : 'Sign in'}
        </button>
        <div className="divider">
          <span>or</span>
        </div>
        <button
          className="google-button"
          type="button"
          onClick={(event) => {
            const role = isSignup
              ? event.currentTarget.form.elements.accountRole.value
              : null
            setMessage(
              `Connect Google ${isSignup ? 'sign-up' : 'sign-in'}${role ? ` for the ${role === 'guide' ? 'Travel Guide' : 'Traveler'} role` : ''} here.`,
            )
          }}
        >
          {googleIcon}
          <span>
            {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
          </span>
        </button>
        <p className="switch-note">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <a
            href={isSignup ? '/signin' : '/signup'}
            onClick={handleModeSwitch}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </a>
        </p>
        <p className="form-message" role="status" aria-live="polite">
          {message}
        </p>
      </form>
    </div>
  )
}
