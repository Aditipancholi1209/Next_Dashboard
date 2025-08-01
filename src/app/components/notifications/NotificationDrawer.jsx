"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getStoredTodos } from "../../data/mockDatabase";

export default function NotificationDrawer({ isOpen, onClose }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    upcoming: [],
    completed: [],
  });

  useEffect(() => {
    if (isOpen && user) {
      const todos = getStoredTodos();
      const userTodos = todos.filter((todo) => todo.userId === user.id);

      // Get upcoming todos (due within next 4 hours)
      const now = new Date();
      const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

      const upcomingTodos = userTodos.filter((todo) => {
        if (todo.status === "completed") return false;

        const [day, month, year] = todo.dueDate.split("/");
        const [hours, minutes] = todo.dueTime.split(":");
        const dueDateTime = new Date(year, month - 1, day, hours, minutes);

        return dueDateTime >= now && dueDateTime <= fourHoursLater;
      });

      // Get completed todos
      const completedTodos = userTodos.filter(
        (todo) => todo.status === "completed"
      );

      // Format notifications with sections
      const formattedUpcoming = upcomingTodos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        type: "pending",
        time: `${todo.dueDate} ${todo.dueTime}`,
        description: todo.description,
      }));

      const formattedCompleted = completedTodos.slice(0, 3).map((todo) => ({
        id: todo.id,
        title: todo.title,
        type: "completed",
        time: `${todo.dueDate} ${todo.dueTime}`,
        description: todo.description,
      }));

      setNotifications({
        upcoming: formattedUpcoming,
        completed: formattedCompleted,
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.upcoming.length === 0 &&
          notifications.completed.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 0-15h0a7.5 7.5 0 0 1 7.5 7.5v.5"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No notifications
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upcoming Todos Section */}
              {notifications.upcoming.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Upcoming (Next 4 Hours)
                  </h3>
                  <div className="space-y-3">
                    {notifications.upcoming.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                {notification.title}
                              </h4>
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                Upcoming
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                              {notification.description}
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              Due: {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Todos Section */}
              {notifications.completed.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Recently Completed
                  </h3>
                  <div className="space-y-3">
                    {notifications.completed.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                {notification.title}
                              </h4>
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Completed
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                              {notification.description}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Completed: {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
