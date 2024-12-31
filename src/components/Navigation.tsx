"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {getCurrentUser} from "@/lib/auth";

export function Navigation() {
  const pathname = usePathname();
  const user = getCurrentUser();

  // Hide navigation on the login page or if no user is logged in
  if (pathname === "/" || !user) return null;

  const userLinks = [
    {href: "/dashboard", label: "Dashboard"},
    {href: "/lockers", label: "Lockers"},
  ];

  const adminLinks = [
    {href: "/admin/dashboard", label: "Dashboard"},
    {href: "/admin/users", label: "Users"},
    {href: "/admin/statistics", label: "Statistics"},
    {href: "/admin/requests", label: "Requests"},
    {href: "/admin/monitor", label: "Monitor"},
  ];

  const links = user.role === "admin" ? adminLinks : userLinks;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-gray-300 transition-colors ${
                  pathname === link.href ? "font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <span>{user.name}</span>
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
