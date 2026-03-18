'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type AuthSnapshot = {
  isAuthenticated: boolean;
  entitlements: Record<string, boolean>;
};

type AuthContextValue = AuthSnapshot & {
  setAuth: (next: AuthSnapshot) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initial,
  children,
}: {
  initial: AuthSnapshot;
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<AuthSnapshot>(initial);

  const value = useMemo<AuthContextValue>(() => ({ ...auth, setAuth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return { isAuthenticated: false, entitlements: {}, setAuth: () => undefined };
  }
  return ctx;
}
