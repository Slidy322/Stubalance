import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { FocusMode } from "./components/FocusMode";
import { TaskSorter } from "./components/TaskSorter";
import { Profile } from "./components/Profile";
import { MyTask } from "./components/MyTask";

export const router = createBrowserRouter([
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
]);