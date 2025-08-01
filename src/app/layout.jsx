import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext.jsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next Dashboard - GGTodo",
  description: "Your productivity companion that helps you organize tasks, collaborate with teams, and achieve more every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
