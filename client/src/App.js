import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import Home from "./pages/home";
import LogIn from "./pages/logIn";
import SignUp from "./pages/signUp";
import Category from "./pages/category";
import Destination from "./pages/destination";
import NewDestination from "./pages/newDestination";
import TermsOfUse from "./components/termsOfUse";
import AboutUs from "./components/aboutUs";
import Contact from "./components/contact";
import AllUsers from "./components/allUsers";

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
      path: `${routes.category}/:id`,
      element: <Category />,
    },
    {
      path: `${routes.destination}/:id`,
      element: <Destination />,
    },
    {
      path: routes.newDestination,
      element: <NewDestination />,
    },
    {
      path: routes.termsOfUse,
      element: <TermsOfUse />,
    },
    {
      path: routes.aboutUs,
      element: <AboutUs />,
    },
    {
      path: routes.contact,
      element: <Contact />,
    },
    {
      path: routes.allUsers,
      element: <AllUsers />,
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
