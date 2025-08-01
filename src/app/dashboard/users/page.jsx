"use client";

import { useAuth } from "../../context/AuthContext.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useEffect, useState } from "react";
import { getStoredUsers, saveUsers } from "../../data/mockDatabase";
import Button from "../../components/ui/Button.jsx";
import AddUserDrawer from "../../components/users/AddUserDrawer.jsx";

function UsersContent() {
  const { user, isSuperuser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Redirect if not superuser
    if (user && !isSuperuser) {
      window.location.href = "/dashboard";
      return;
    }

    // Load users
    const allUsers = getStoredUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  }, [user, isSuperuser]);

  useEffect(() => {
    // Filter users based on search term, role, and status
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, roleFilter, statusFilter]);

  const handleRoleToggle = (userId) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: u.role === "user" ? "superuser" : "user",
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    // Update current user in auth context if they changed their own role
    if (userId === user.id) {
      const updatedCurrentUser = updatedUsers.find((u) => u.id === userId);
      updateUser(updatedCurrentUser);
    }
  };

  const handleStatusToggle = (userId) => {
    const targetUser = users.find((u) => u.id === userId);

    // Don't allow toggling inactive status for superusers
    if (targetUser?.role === "superuser") {
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          isActive: !u.isActive,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const addNewUser = () => {
    setIsAddUserOpen(true);
  };

  const handleAddUser = (newUserData) => {
    const newUser = {
      id: users.length + 1,
      ...newUserData,
      role: "user", // Default role
      lastLogin: new Date().toLocaleString(),
      isActive: true,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setIsAddUserOpen(false);
  };

  if (user && !isSuperuser) {
    return null; // Will redirect above
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Users
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Last Updated: {new Date().toLocaleDateString()}{" "}
                {new Date().toLocaleTimeString().slice(0, 5)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="superuser">Super Admin</option>
                <option value="user">User</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button
                onClick={addNewUser}
                variant="primary"
                className="bg-green-500 hover:bg-green-600"
              >
                + Add Users
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role Tg.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((userData) => (
                  <tr
                    key={userData.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={userData.avatar}
                          alt={userData.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userData.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 dark:text-white mr-3">
                          {userData.role === "superuser"
                            ? "Super Admin"
                            : "Viewer"}
                        </span>
                        <button
                          onClick={() => handleRoleToggle(userData.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            userData.role === "superuser"
                              ? "bg-green-600"
                              : "bg-gray-200 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userData.role === "superuser"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 dark:text-white mr-3">
                          {userData.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => handleStatusToggle(userData.id)}
                          disabled={userData.role === "superuser"}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            userData.role === "superuser"
                              ? "bg-green-600 opacity-50 cursor-not-allowed"
                              : userData.isActive
                              ? "bg-green-600"
                              : "bg-gray-200 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              userData.isActive || userData.role === "superuser"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          No users found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm ||
                          roleFilter !== "all" ||
                          statusFilter !== "all"
                            ? "Try adjusting your search or filters."
                            : "No users available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Drawer */}
      <AddUserDrawer
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />
    </DashboardLayout>
  );
}

export default function UsersPage() {
  return <UsersContent />;
}
