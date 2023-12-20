import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import LogIn from "./pages/authorization/logIn";
import SignUp from "./pages/authorization/signUp";
import ForgotPassword from "./pages/authorization/forgotPassword";
import ResetPassword from "./pages/authorization/resetPassword";
import UpdateEmail from "./pages/profile/updateEmail";
import UpdatePassword from "./pages/profile/updatePassword";
import Category from "./pages/info/category";
import Destination from "./pages/info/destination";
import NewDestination from "./pages/admin/newDestination";
import TermsOfUse from "./pages/footer/termsOfUse";
import AboutUs from "./pages/footer/aboutUs";
import Contact from "./pages/footer/contact";
import UserList from "./pages/admin/userList";
import UserProfile from "./pages/profile/userProfile";
import { routes } from "./routes/routes";

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
      path: routes.forgotPassword,
      element: <ForgotPassword />,
    },
    {
      path: routes.resetPassword,
      element: <ResetPassword />,
    },
    {
      path: routes.updateEmail,
      element: <UpdateEmail />,
    },
    {
      path: routes.updatePassword,
      element: <UpdatePassword />,
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
      path: routes.userList,
      element: <UserList />,
    },
    {
      path: `${routes.user}/:id`,
      element: <UserProfile />,
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
