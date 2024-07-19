import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(Boolean(getAuthToken()));
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const login = (name,email,avatar) => {
    // setAuthToken(token);
    setName(name);
    setEmail(email)
    setAvatar(avatar?`data:image/jpeg;base64,${avatar}`:null)
    // Store token in local storage or cookies
  };

  const logout = () => {
    // setAuthToken(null);
    setName(null);
    setEmail(null)
    setAvatar(null)
    // Remove token from local storage or cookies
  };

  return (
    <AuthContext.Provider value={{ name, email, avatar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
