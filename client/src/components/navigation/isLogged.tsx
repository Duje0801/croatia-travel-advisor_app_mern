import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default function IsLogged(props: {
  redirect: (to: string) => void;
}): JSX.Element {
  const { state, dispatch } = useContext(UserContext);

  const handleSignOut = (): void => {
    localStorage.removeItem("user");
    dispatch({ type: "DELETE", payload: null });
  };

  return (
    <div className="navLogIn">
      {state.user ? (
        <div>
          <div className="navHelloMessage">Hi, {state.user.username}!</div>{" "}
          <div className="navAdminButtons">
            {state.user?.username === `admin` ? (
              <>
                <button onClick={() => props.redirect(`userList`)}>
                  Users
                </button>
                <button onClick={() => props.redirect(`addNewDestination`)}>
                  Add new destination
                </button>
              </>
            ) : (
              <button onClick={() => props.redirect(`myProfile`)}>
                My profile
              </button>
            )}
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      ) : (
        <div onClick={() => props.redirect(`logIn`)}>Log in</div>
      )}
    </div>
  );
}
