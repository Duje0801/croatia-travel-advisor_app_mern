import React, { useEffect, useReducer } from "react";

interface User {
  user: { email: string; username: string; token: string } | null;
}

const initialState: User = {
  user: null,
};

interface Action {
  type: string;
  payload: { email: string; username: string; token: string } | null;
}

interface UserAppContext {
  state: User;
  dispatch: React.Dispatch<Action>;
}

export const UserContext = React.createContext<UserAppContext>({
  state: {
    user: null,
  },
  dispatch: () => {},
});

const reducer = (state: User, action: Action) => {
  switch (action.type) {
    case "SET":
      return {
        user: action.payload,
      };
    case "DELETE":
      return {
        user: null,
      };
    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user")!);
    if (getUser) {
      dispatch({ type: "SET", payload: getUser });
    }
  }, []);

  const value = { state, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
