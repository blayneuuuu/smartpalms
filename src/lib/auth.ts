import {User, users} from "./mockData";

let currentUser: User | null = null;

export function login(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email);
  if (user && password === "password") {
    // In a real app, you'd use proper password hashing
    currentUser = user;
    return user;
  }
  return null;
}

export function logout() {
  currentUser = null;
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function isAdmin(): boolean {
  return currentUser?.role === "admin";
}
