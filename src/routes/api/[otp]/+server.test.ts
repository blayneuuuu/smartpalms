import {describe, it, expect, vi, beforeEach} from "vitest";
import {GET, PATCH} from "./+server";
import {db} from "$lib/server/db";
import type {OTPAccessResponse} from "$lib/types/api";

// Mock the database
vi.mock("$lib/server/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

describe("OTP Access API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/[otp]", () => {
    it("should return 400 when OTP is missing", async () => {
      const event = {
        params: {},
      };

      const response = await GET(event as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe("OTP is required");
    });

    it("should return 404 when OTP is invalid or expired", async () => {
      // Mock db.select to return no locker
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const event = {
        params: {otp: "invalid-otp"},
      };

      const response = await GET(event as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Invalid or expired OTP");
    });

    it("should successfully grant access with valid OTP", async () => {
      const mockLocker = {
        id: "test-locker",
        number: "A123",
      };

      // Mock db.select to return a locker
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockLocker]),
        }),
      } as any);

      // Mock db.insert for access history
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      } as any);

      // Mock db.update for clearing OTP
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      const event = {
        params: {otp: "valid-otp"},
      };

      const response = await GET(event as any);
      const data = (await response.json()) as OTPAccessResponse;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.locker).toEqual(mockLocker);

      // Verify access history was created
      expect(vi.mocked(db.insert)).toHaveBeenCalledWith(expect.anything());

      // Verify OTP was cleared
      expect(vi.mocked(db.update)).toHaveBeenCalled();
    });
  });

  describe("PATCH /api/[otp]", () => {
    it("should return 400 when OTP is missing", async () => {
      const event = {
        params: {},
      };

      const response = await PATCH(event as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe("OTP is required");
    });

    it("should return 404 when OTP is invalid", async () => {
      // Mock db.select to return no locker
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const event = {
        params: {otp: "invalid-otp"},
      };

      const response = await PATCH(event as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Invalid OTP");
    });

    it("should successfully clear OTP", async () => {
      const mockLocker = {
        id: "test-locker",
        number: "A123",
      };

      // Mock db.select to return a locker
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockLocker]),
        }),
      } as any);

      // Mock db.update for clearing OTP
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      const event = {
        params: {otp: "valid-otp"},
      };

      const response = await PATCH(event as any);
      const data = (await response.json()) as OTPAccessResponse;

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("OTP cleared successfully");

      // Verify OTP was cleared
      expect(vi.mocked(db.update)).toHaveBeenCalled();
    });
  });
});
