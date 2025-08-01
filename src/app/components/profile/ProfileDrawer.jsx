"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import { getStoredTodos } from "../../data/mockDatabase";

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        onClick={logout}
        variant="outline"
        className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Logout
      </Button>
    </div>
  );
}

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
  });

  useEffect(() => {
    if (user && isOpen) {
      // Update form data when user changes
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });

      // Calculate user stats
      const todos = getStoredTodos();
      const userTodos = todos.filter((todo) => todo.userId === user.id);
      setStats({
        total: userTodos.length,
        upcoming: userTodos.filter((todo) => todo.status === "pending").length,
        completed: userTodos.filter((todo) => todo.status === "completed")
          .length,
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateUser({
        ...user,
        ...formData,
      });
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar and Role */}
          <div className="text-center">
            <img
              className="h-20 w-20 rounded-full object-cover mx-auto border-4 border-gray-200 dark:border-gray-600"
              src={user?.avatar}
              alt={user?.name}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
              }}
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.role === "superuser" ? "Super Admin" : "User"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Joined On: {user?.lastLogin?.split(" ")[0]}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={handleEdit}
                  variant="primary"
                  className="w-full"
                >
                  Update Profile
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    className="w-full"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="secondary"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All Todos
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.upcoming}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upcoming
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
