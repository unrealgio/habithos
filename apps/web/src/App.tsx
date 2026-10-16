import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
