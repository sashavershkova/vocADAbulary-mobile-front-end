import React, { createContext, useContext, ReactNode } from 'react';

// Type for user info
type MockUser = {
  id: number;
  username: string;
};

// Default value for your mock user
const defaultUser: MockUser = {
  id: 1,
  username: 'Mock User',
};

// Create context
const UserContext = createContext<MockUser>(defaultUser);

// Exported hook
export const useMockUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  return <UserContext.Provider value={defaultUser}>{children}</UserContext.Provider>;
};
