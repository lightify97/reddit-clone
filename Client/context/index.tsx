import React, { createContext, useState } from 'react';

export const State = createContext({});

export const StateProvider = (props: any) => {
  // User State
  const [user, setUser] = useState(null);

  return <State.Provider value={{ user, setUser }}>{props.children}</State.Provider>;
};
