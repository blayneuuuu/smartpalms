import {db} from "$lib/server/db";
import {messages, users, lockers} from "$lib/server/db/schema";
import {eq, and, desc, isNull, sql} from "drizzle-orm";
import type {Message} from "$lib/server/db/schema";

export interface MessageWithSender extends Partial<Message> {
  senderName: string;
  senderType: string;
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  isRead: boolean;
}

export interface MessageThread {
  id: string;
  userId: string;
  userName: string;
  userType: string;
  content: string;
  lockerId?: string | null;
  lockerNumber?: string;
  isRead: boolean;
  createdAt: Date;
  replies: MessageWithSender[];
  unreadCount: number;
}

/**
 * Service for handling messaging between users and admins
 */
export class MessageService {
  /**
   * Creates a new message
   * @param data The message data
   * @returns The created message
   */
  static async createMessage(data: {
    userId: string;
    content: string;
    lockerId?: string;
    parentId?: string;
    createdBy: string;
  }): Promise<Message> {
    try {
      const [message] = await db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          userId: data.userId,
          lockerId: data.lockerId,
          content: data.content,
          parentId: data.parentId,
          isRead: data.createdBy === data.userId ? false : true, // If created by the user, it's unread for admin
          createdAt: new Date(),
        })
        .returning();

      return message;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  /**
   * Gets a message by its ID
   * @param id The message ID
   * @returns The message or null if not found
   */
  static async getById(id: string): Promise<Message | null> {
    try {
      const [message] = await db
        .select()
        .from(messages)
        .where(eq(messages.id, id));

      return message || null;
    } catch (error) {
      console.error("Error getting message:", error);
      return null;
    }
  }

  /**
   * Gets all messages for a user
   * @param userId The user ID
   * @returns Array of message threads
   */
  static async getThreadsForUser(userId: string): Promise<MessageThread[]> {
    try {
      // Get all root messages (those without a parent) for this user
      const rootMessages = await db
        .select({
          id: messages.id,
          userId: messages.userId,
          content: messages.content,
          lockerId: messages.lockerId,
          isRead: messages.isRead,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(and(eq(messages.userId, userId), isNull(messages.parentId)))
        .orderBy(desc(messages.createdAt));

      // For each root message, get the replies
      const result: MessageThread[] = [];

      for (const rootMessage of rootMessages) {
        // Get the user info
        const [user] = await db
          .select({
            name: users.name,
            type: users.type,
          })
          .from(users)
          .where(eq(users.id, rootMessage.userId));

        // Get all replies for this message
        const replies = await db
          .select({
            id: messages.id,
            content: messages.content,
            userId: messages.userId,
            createdAt: messages.createdAt,
            isRead: messages.isRead,
          })
          .from(messages)
          .where(eq(messages.parentId, rootMessage.id))
          .orderBy(messages.createdAt);

        // Get sender info for each reply
        const repliesWithSender: MessageWithSender[] = [];
        for (const reply of replies) {
          const [sender] = await db
            .select({
              name: users.name,
              type: users.type,
            })
            .from(users)
            .where(eq(users.id, reply.userId));

          repliesWithSender.push({
            ...reply,
            senderName: sender.name,
            senderType: sender.type,
          });
        }

        // Count unread messages in this thread
        const unreadCount = repliesWithSender.filter(
          (reply) => !reply.isRead && reply.userId !== userId
        ).length;

        // Add to result
        result.push({
          ...rootMessage,
          userName: user.name,
          userType: user.type,
          replies: repliesWithSender,
          unreadCount,
        });
      }

      return result;
    } catch (error) {
      console.error("Error getting messages for user:", error);
      return [];
    }
  }

  /**
   * Gets all message threads for admin
   * @returns Array of message threads
   */
  static async getAllThreadsForAdmin(): Promise<MessageThread[]> {
    try {
      // Get all root messages (those without a parent)
      const rootMessages = await db
        .select({
          id: messages.id,
          userId: messages.userId,
          content: messages.content,
          lockerId: messages.lockerId,
          isRead: messages.isRead,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(isNull(messages.parentId))
        .orderBy(desc(messages.createdAt));

      // For each root message, get the replies
      const result: MessageThread[] = [];

      for (const rootMessage of rootMessages) {
        // Get the user info
        const [user] = await db
          .select({
            name: users.name,
            type: users.type,
          })
          .from(users)
          .where(eq(users.id, rootMessage.userId));

        // Get locker info if available
        let lockerNumber: string | undefined;
        if (rootMessage.lockerId) {
          const [locker] = await db
            .select({
              number: lockers.number,
            })
            .from(lockers)
            .where(eq(lockers.id, rootMessage.lockerId));

          lockerNumber = locker?.number;
        }

        // Get all replies for this message
        const replies = await db
          .select({
            id: messages.id,
            content: messages.content,
            userId: messages.userId,
            createdAt: messages.createdAt,
            isRead: messages.isRead,
          })
          .from(messages)
          .where(eq(messages.parentId, rootMessage.id))
          .orderBy(messages.createdAt);

        // Get sender info for each reply
        const repliesWithSender: MessageWithSender[] = [];
        for (const reply of replies) {
          const [sender] = await db
            .select({
              name: users.name,
              type: users.type,
            })
            .from(users)
            .where(eq(users.id, reply.userId));

          repliesWithSender.push({
            ...reply,
            senderName: sender.name,
            senderType: sender.type,
          });
        }

        // Count unread admin messages in this thread
        const unreadCount = !rootMessage.isRead ? 1 : 0;

        // Add to result
        result.push({
          ...rootMessage,
          userName: user.name,
          userType: user.type,
          lockerNumber,
          replies: repliesWithSender,
          unreadCount,
        });
      }

      return result;
    } catch (error) {
      console.error("Error getting all message threads:", error);
      return [];
    }
  }

  /**
   * Marks a message as read
   * @param messageId The message ID
   * @returns Whether the operation was successful
   */
  static async markAsRead(messageId: string): Promise<boolean> {
    try {
      await db
        .update(messages)
        .set({isRead: true})
        .where(eq(messages.id, messageId));

      return true;
    } catch (error) {
      console.error("Error marking message as read:", error);
      return false;
    }
  }

  /**
   * Gets unread message count for a user
   * @param userId The user ID
   * @returns Number of unread messages
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      // Get direct unread messages from admin to this user
      const [result] = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(messages)
        .where(
          and(
            eq(messages.userId, userId),
            eq(messages.isRead, false),
            sql`${messages.userId} != ${userId}`
          )
        );

      return result?.count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  /**
   * Gets unread message count for admins (all unread messages from users)
   * @returns Number of unread messages
   */
  static async getUnreadCountForAdmin(): Promise<number> {
    try {
      const [result] = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(messages)
        .innerJoin(users, eq(messages.userId, users.id))
        .where(
          and(
            eq(messages.isRead, false),
            eq(users.type, "user"),
            isNull(messages.parentId)
          )
        );

      return result?.count || 0;
    } catch (error) {
      console.error("Error getting unread count for admin:", error);
      return 0;
    }
  }
}
