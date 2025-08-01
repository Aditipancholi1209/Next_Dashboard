"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import NotificationDrawer from "../notifications/NotificationDrawer.jsx";
import ProfileDrawer from "../profile/ProfileDrawer.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

export default function DashboardLayout({
  children,
  searchTerm,
  onSearchChange,
}) {
  const { loading } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <TopBar
        onNotificationClick={() => setIsNotificationOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <main className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Global Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
