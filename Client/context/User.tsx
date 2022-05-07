import React, { createContext, useState } from 'react';

export const User = createContext({});

export const UserProvider = (props: any) => {
  const [user, setUser] = useState({});

  const setActiveUser = (user: any) => {
    setUser(user);
  };

  return <User.Provider value={{ user, setActiveUser }}>{props.children}</User.Provider>;
};
