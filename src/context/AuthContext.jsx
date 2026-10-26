import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_ACCOUNTS = [
  {
    id: 'usr-traveler-demo',
    name: 'Aarav Mehta',
    fullName: 'Aarav Mehta',
    email: 'demo1@gmail.com',
    role: 'traveler',
    password: '1234',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85',
    handle: '@demo1',
  },
  {
    id: 'guide-agam-demo',
    name: 'Agam Sharma',
    fullName: 'Agam Sharma',
    email: 'demo2@gmail.com',
    role: 'guide',
    password: '1234',
    avatar: '/agam-profile.jpg',
    handle: '@demo2',
  },
];

export function AuthProvider({ children }) {
  // 1. Stored accounts database (seeded with demo1@gmail.com and demo2@gmail.com)
  const [accounts, setAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('wanderwise_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee demo1 and demo2 accounts are present
          const hasDemo1 = parsed.some(
            (a) => a.email && a.email.toLowerCase() === 'demo1@gmail.com'
          );
          const hasDemo2 = parsed.some(
            (a) => a.email && a.email.toLowerCase() === 'demo2@gmail.com'
          );

          let merged = [...parsed];
          if (!hasDemo1) merged.unshift(DEFAULT_ACCOUNTS[0]);
          if (!hasDemo2) merged.push(DEFAULT_ACCOUNTS[1]);
          return merged;
        }
      }
    } catch (e) {
      console.warn('Error reading accounts from localStorage:', e);
    }
    return DEFAULT_ACCOUNTS;
  });

  // Save accounts when modified
  useEffect(() => {
    try {
      localStorage.setItem('wanderwise_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn('Error saving accounts to localStorage:', e);
    }
  }, [accounts]);

  // 2. Authenticated user session
  const [user, setUser] = useState(null);

  // 3. User role ('traveler' | 'guide')
  const [userRole, setUserRole] = useState('traveler');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('wanderwise_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('wanderwise_user');
      }
    } catch (e) {
      console.warn('LocalStorage error saving user:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (userRole) {
        localStorage.setItem('wanderwise_role', userRole);
      } else {
        localStorage.removeItem('wanderwise_role');
      }
    } catch (e) {
      console.warn('LocalStorage error saving role:', e);
    }
  }, [userRole]);

  /**
   * Signs in user by validating email and password against registered accounts
   */
  const signIn = ({ email, password }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const existing = accounts.find(
      (acc) => acc.email && acc.email.toLowerCase() === cleanEmail
    );

    if (!existing) {
      return {
        success: false,
        notFound: true,
        message: 'No account found with this email. Please sign up to create an account.',
      };
    }

    // Password verification: checks stored password (defaults to 1234)
    const expectedPassword = existing.password || '1234';
    if (cleanPass && cleanPass !== expectedPassword) {
      return {
        success: false,
        wrongPassword: true,
        message: 'Incorrect password. Please try again (Password for demo is 1234).',
      };
    }

    const authPayload = {
      id: existing.id,
      name: existing.fullName || existing.name,
      fullName: existing.fullName || existing.name,
      email: existing.email,
      role: existing.role || 'traveler',
      avatar:
        existing.avatar ||
        (existing.role === 'guide'
          ? '/agam-profile.jpg'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
      handle: existing.handle || `@${existing.email.split('@')[0]}`,
    };

    setUser(authPayload);
    setUserRole(existing.role || 'traveler');

    if ((existing.role || 'traveler') !== 'guide') {
      try {
        sessionStorage.removeItem('abeon_traveler_gate_passed');
        window.dispatchEvent(new CustomEvent('trigger_traveler_preloader'));
      } catch (e) {}
    }

    return {
      success: true,
      role: existing.role || 'traveler',
      user: authPayload,
    };
  };

  /**
   * Registers a new account with specified role ('traveler' or 'guide')
   */
  const signUp = ({ fullName, email, role = 'traveler', password = '' }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const existing = accounts.find(
      (acc) => acc.email && acc.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      return {
        success: false,
        exists: true,
        message: 'An account with this email already exists. Please sign in.',
      };
    }

    const newAccount = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      fullName: fullName.trim(),
      email: cleanEmail,
      role: role === 'guide' ? 'guide' : 'traveler',
      password: String(password || '1234').trim(),
      avatar:
        role === 'guide'
          ? '/agam-profile.jpg'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85',
      handle: `@${cleanEmail.split('@')[0]}`,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setUser(newAccount);
    setUserRole(newAccount.role);

    if (newAccount.role !== 'guide') {
      try {
        sessionStorage.removeItem('abeon_traveler_gate_passed');
        window.dispatchEvent(new CustomEvent('trigger_traveler_preloader'));
      } catch (e) {}
    }

    return {
      success: true,
      role: newAccount.role,
      user: newAccount,
    };
  };

  const signInWithGoogle = ({ email, name, avatar, role = 'traveler' }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const existing = accounts.find(
      (acc) => acc.email && acc.email.toLowerCase() === cleanEmail
    );

    let authUser;
    if (existing) {
      authUser = {
        ...existing,
        avatar: avatar || existing.avatar,
      };
      if (avatar && existing.avatar !== avatar) {
        setAccounts((prev) =>
          prev.map((a) => (a.id === existing.id ? { ...a, avatar } : a))
        );
      }
    } else {
      const assignedRole = role === 'guide' ? 'guide' : 'traveler';
      authUser = {
        id: `google-${Date.now()}`,
        name: name || 'Google Explorer',
        fullName: name || 'Google Explorer',
        email: cleanEmail,
        role: assignedRole,
        password: 'oauth',
        avatar:
          avatar ||
          (assignedRole === 'guide'
            ? '/agam-profile.jpg'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
        handle: `@${cleanEmail.split('@')[0]}`,
        isGoogleAuth: true,
      };
      setAccounts((prev) => [authUser, ...prev]);
    }

    setUser(authUser);
    setUserRole(authUser.role || 'traveler');

    if ((authUser.role || 'traveler') !== 'guide') {
      try {
        sessionStorage.removeItem('abeon_traveler_gate_passed');
        window.dispatchEvent(new CustomEvent('trigger_traveler_preloader'));
      } catch (e) {}
    }

    return {
      success: true,
      role: authUser.role || 'traveler',
      user: authUser,
    };
  };

  const logout = () => {
    setUser(null);
    setUserRole('traveler');
    try {
      localStorage.removeItem('wanderwise_user');
      localStorage.removeItem('wanderwise_role');
    } catch (e) {
      // ignore
    }
  };

  const setRole = (role) => {
    if (role === 'traveler' || role === 'guide') {
      setUserRole(role);
      if (user) {
        setUser((prev) => ({ ...prev, role }));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        accounts,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        setRole,
        login: (custom) => {
          if (custom) {
            setUser(custom);
            setUserRole(custom.role || 'traveler');
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
