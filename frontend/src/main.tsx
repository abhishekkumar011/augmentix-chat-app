import "./index.css";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { Chat, Login, Signup } from "./pages/index.ts";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login/>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/chat/:id",
        element: <Chat />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
