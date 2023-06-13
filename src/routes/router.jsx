import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Main } from "../Layout/Main";
import { userRouter } from "./userRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: userRouter,
  },
]);
