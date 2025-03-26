import {apiGet, apiPost, apiPatch} from "./fetch";

/**
 * Type definitions for User data
 */
export type User = {
  id: string;
  name: string;
  email: string;
  type: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  type: "admin" | "user";
  lockerCount: number;
  requestCount: number;
};

/**
 * Fetch all users
 */
export function fetchUsers() {
  return apiGet<{users: User[]}>("/api/admin/users");
}

/**
 * Fetch user profile by ID
 */
export function fetchUserProfile(userId: string) {
  return apiGet<{user: UserProfile}>(`/api/admin/users/${userId}`);
}

/**
 * Fetch current user's profile
 */
export function fetchCurrentUser() {
  return apiGet<{user: User}>("/api/auth/user");
}

/**
 * Update user's profile
 */
export function updateUserProfile(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiPatch<{user: User}>("/api/profile", data);
}

/**
 * Sign in user
 */
export function signIn(credentials: {email: string; password: string}) {
  return apiPost<{user: User}>("/api/auth/signin", credentials);
}

/**
 * Sign up new user
 */
export function signUp(userData: {
  name: string;
  email: string;
  password: string;
}) {
  return apiPost<{user: User}>("/api/auth/signup", userData);
}

/**
 * Sign out user
 */
export function signOut() {
  return apiPost<{success: boolean}>("/api/auth/signout", {});
}
