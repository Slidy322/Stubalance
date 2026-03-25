import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { FocusMode } from "./components/FocusMode";
import { TaskSorter } from "./components/TaskSorter";
import { Profile } from "./components/Profile";
import { MyTask } from "./components/MyTask";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        path: "/",
        Component: Root,
        children: [
          { index: true, Component: Dashboard },
          { path: "focus", Component: FocusMode },
          { path: "task-sorter", Component: TaskSorter },
          { path: "profile", Component: Profile },
          { path: "my-task", Component: MyTask },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);