/**
 * Base API response interface that all other responses extend
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Generic data response with typed data
 */
export interface ApiDataResponse<T> extends ApiResponse {
  data: T;
}

/**
 * Error response
 */
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  error: string;
}

/**
 * Locker response interfaces
 */
export interface LockerData {
  id: string;
  number: string;
  size?: string;
  isOccupied?: boolean;
}

export interface LockersResponse extends ApiResponse {
  lockers: LockerData[];
}

export interface LockerResponse extends ApiResponse {
  locker: LockerData;
}

/**
 * User response interfaces
 */
export interface UserData {
  id: string;
  name: string;
  email: string;
  type?: string;
}

export interface UserResponse extends ApiResponse {
  user: UserData;
}

/**
 * Subscription type response interfaces
 */
export interface SubscriptionTypeData {
  id: string;
  name: string;
  duration: string;
  amount: number;
  isActive?: boolean;
}

export interface SubscriptionTypesResponse extends ApiResponse {
  subscriptionTypes: SubscriptionTypeData[];
}

export interface SubscriptionTypeResponse extends ApiResponse {
  subscriptionType: SubscriptionTypeData;
}

/**
 * OTP response
 */
export interface OtpResponse extends ApiResponse {
  otp: string;
  expiryDate: string;
}

/**
 * Access response interfaces
 */
export interface DirectAccessResponse extends ApiResponse {
  locker?: {
    id: string;
    number: string;
  };
}

/**
 * Enhanced locker information including expiration details
 */
export interface EnhancedLockerData {
  id: string;
  number: string;
  size: string;
  subscription: {
    id: string;
    status: string;
    expiresAt: string;
  };
  daysUntilExpiration?: number;
  isExpiringSoon?: boolean;
}

export interface AuthenticatedAccessResponse extends ApiResponse {
  user?: UserData;
  lockers?: Array<EnhancedLockerData>;
}

/**
 * Stats response
 */
export interface StatsResponse extends ApiResponse {
  totalLockers: number;
  occupiedLockers: number;
  totalUsers: number;
  pendingRequests: number;
}
