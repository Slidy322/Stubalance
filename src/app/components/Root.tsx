import { Outlet } from "react-router";
import { InstallPrompt } from "./InstallPrompt";
import { OfflineIndicator } from "./OfflineIndicator";

export function Root() {
  return (
    <div className="min-h-screen bg-[#fff5f5]">
      <Outlet />
      <InstallPrompt />
      <OfflineIndicator />
    </div>
  );
}