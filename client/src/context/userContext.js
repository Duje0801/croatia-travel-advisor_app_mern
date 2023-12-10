import { createContext, useEffect, useReducer } from "react";

export const UserContext = createContext();

const reducer = (state, action) => {
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
      return state.user;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
  });

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    if (getUser) {
      dispatch({ type: "SET", payload: getUser });
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
