import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type for user info
type MockUser = {
  id: number;
  username: string;
};

// Context type
type UserContextType = {
  user: MockUser;
  setUser: (user: MockUser) => void;
};

// Default value for your mock user
const defaultUser: MockUser = {
  id: 1,
  username: 'Mock User',
};

// Create context
const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});

// Exported hook
export const useMockUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser>(defaultUser);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
