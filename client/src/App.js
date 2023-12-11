import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import Home from "./pages/home";
import LogIn from "./pages/logIn";
import SignUp from "./pages/signUp";

export default function App() {
  const router = createBrowserRouter([
    {
      path: routes.home,
      element: <Home />,
    },
    {
      path: routes.logIn,
      element: <LogIn />,
    },
    {
      path: routes.signUp,
      element: <SignUp />,
    },
    {
      path: `*`,
      element: <Home />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
