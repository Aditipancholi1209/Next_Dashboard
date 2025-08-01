"use client";

import ThemeToggle from "../ui/ThemeToggle.jsx";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80')`,
          }}
        />

        {/* Overlay for better text readability and theme consistency */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60 dark:from-black/60 dark:via-black/40 dark:to-black/80" />

        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center w-full p-8">
          <div className="text-center space-y-6 max-w-md">
            {/* Logo/Icon */}
            <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <svg
                className="w-10 h-10 text-white"
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
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white">
                Productive Environment
              </h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Join thousands of users who have transformed their productivity
                with our intuitive todo management system.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 gap-3 mt-8">
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Collaborate with your team</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Track your progress</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Achieve your goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
