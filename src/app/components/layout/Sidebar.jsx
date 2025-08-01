"use client";

import { useAuth } from "../../context/AuthContext.jsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, isSuperuser } = useAuth();
  const pathname = usePathname();

  const generalMenuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
      roles: ["user", "superuser"],
    },
    {
      id: "todos",
      name: "To do list",
      href: "/dashboard/todos",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      roles: ["user", "superuser"],
    },
  ];

  const adminMenuItems = [
    {
      id: "users",
      name: "Users",
      href: "/dashboard/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      roles: ["superuser"],
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  const canAccess = (itemRoles) => {
    return itemRoles.includes(user?.role);
  };

  // Sidebar styling based on user role and theme
  const getSidebarClasses = () => {
    if (isSuperuser) {
      // Superuser: always dark theme
      return "bg-gray-900";
    } else {
      // Normal user: follows theme (white in light, dark in dark)
      return "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700";
    }
  };

  const getHeaderClasses = () => {
    if (isSuperuser) {
      return "bg-gray-900";
    } else {
      return "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700";
    }
  };

  const getLinkClasses = (isActiveLink) => {
    if (isSuperuser) {
      // Superuser: dark theme colors
      return isActiveLink
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white";
    } else {
      // Normal user: theme-based colors
      return isActiveLink
        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white";
    }
  };

  const getBrandTextClass = () => {
    if (isSuperuser) {
      return "text-gray-400";
    } else {
      return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div
      className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 ${getSidebarClasses()} transition-colors duration-200`}
    >
      <div
        className={`flex items-center h-16 flex-shrink-0 px-4 ${getHeaderClasses()}`}
      >
        <div className="flex items-center">
          <span className="text-white text-xl font-bold">GREEDYGAME</span>
          <span className={`${getBrandTextClass()} text-xs ml-1`}>®</span>
        </div>
      </div>

      <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {/* General Menu Items */}
          {generalMenuItems
            .filter((item) => canAccess(item.roles))
            .map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${getLinkClasses(
                  isActive(item.href)
                )} group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
              >
                <span className="mr-3 flex-shrink-0 h-6 w-6">{item.icon}</span>
                {item.name}
              </Link>
            ))}

          {/* Separator for Superuser */}
          {isSuperuser && (
            <div className="py-2">
              <div className="border-t border-gray-700"></div>
            </div>
          )}

          {/* Admin Menu Items */}
          {isSuperuser &&
            adminMenuItems
              .filter((item) => canAccess(item.roles))
              .map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${getLinkClasses(
                    isActive(item.href)
                  )} group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <span className="mr-3 flex-shrink-0 h-6 w-6">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
        </nav>
      </div>
    </div>
  );
}
