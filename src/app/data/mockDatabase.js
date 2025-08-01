// Mock database for users and todos
export const mockUsers = [
  {
    id: 1,
    name: "Fawaz Ahmed",
    email: "fawaz@greedygame.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "superuser",
    lastLogin: "18/09/2023 18:00",
    isActive: true,
  },
  {
    id: 2,
    name: "Prashant",
    email: "prashant@greedygame.com",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "user",
    lastLogin: "17/09/2023 15:30",
    isActive: true,
  },
  {
    id: 3,
    name: "Rahul Singh",
    email: "rahul@greedygame.com",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "user",
    lastLogin: "16/09/2023 12:45",
    isActive: false,
  },
];

export const mockTodos = [
  {
    id: 1,
    title: "Submit project report",
    description:
      "Finalize and submit the quarterly project report to the manager by 3:00 PM.",
    dueDate: "16/09/2023",
    dueTime: "18:00",
    status: "completed",
    userId: 1,
    createdAt: "15/09/2023 10:00",
  },
  {
    id: 2,
    title: "Team stand-up meeting",
    description: "Attend the daily standup with the product team on Zoom.",
    dueDate: "01/08/2025",
    dueTime: "14:00",
    status: "pending",
    userId: 1,
    createdAt: "01/08/2025 08:00",
  },
  {
    id: 3,
    title: "Client follow-up email",
    description:
      "Follow up with the client regarding the new quarterly project contract.",
    dueDate: "01/08/2025",
    dueTime: "15:30",
    status: "pending",
    userId: 1,
    createdAt: "01/08/2025 14:00",
  },
  {
    id: 4,
    title: "Review pull requests",
    description:
      "Check and review the pending pull requests on GitHub before EOD.",
    dueDate: "16/09/2023",
    dueTime: "18:00",
    status: "completed",
    userId: 1,
    createdAt: "16/09/2023 09:00",
  },
  {
    id: 5,
    title: "Buy groceries",
    description:
      "Get groceries like vegetables, milk, and bread from the nearby supermarket.",
    dueDate: "16/09/2023",
    dueTime: "19:00",
    status: "pending",
    userId: 1,
    createdAt: "16/09/2023 07:00",
  },
  {
    id: 6,
    title: "Workout session",
    description: "Attend the 1-hour workout session at the gym after work.",
    dueDate: "16/09/2023",
    dueTime: "18:00",
    status: "completed",
    userId: 1,
    createdAt: "15/09/2023 20:00",
  },
];

// Helper functions for localStorage operations
export const getStoredUsers = () => {
  if (typeof window === "undefined") return mockUsers;
  const stored = localStorage.getItem("gg_users");
  return stored ? JSON.parse(stored) : mockUsers;
};

export const getStoredTodos = () => {
  if (typeof window === "undefined") return mockTodos;
  const stored = localStorage.getItem("gg_todos");
  return stored ? JSON.parse(stored) : mockTodos;
};

export const getStoredCurrentUser = () => {
  if (typeof window === "undefined") return mockUsers[0];
  const stored = localStorage.getItem("gg_current_user");
  return stored ? JSON.parse(stored) : mockUsers[0];
};

export const saveUsers = (users) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("gg_users", JSON.stringify(users));
  }
};

export const saveTodos = (todos) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("gg_todos", JSON.stringify(todos));
  }
};

export const saveCurrentUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("gg_current_user", JSON.stringify(user));
  }
};

export const clearStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("gg_users");
    localStorage.removeItem("gg_todos");
    localStorage.removeItem("gg_current_user");
  }
};
