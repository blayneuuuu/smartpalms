import {db} from "$lib/server/db";
import {subscriptionTypes, type SubscriptionType} from "$lib/server/db/schema";
import {eq} from "drizzle-orm";

/**
 * SubscriptionTypeService provides functionality for managing subscription types
 */
export class SubscriptionTypeService {
  /**
   * Get a subscription type by its ID
   * @param id The subscription type ID
   * @returns The subscription type or null if not found
   */
  public static async getById(id: string): Promise<SubscriptionType | null> {
    const [subscriptionType] = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.id, id));

    return subscriptionType || null;
  }

  /**
   * Get all subscription types
   * @param activeOnly Whether to get only active subscription types
   * @returns Array of subscription types
   */
  public static async getAll(activeOnly = false): Promise<SubscriptionType[]> {
    if (activeOnly) {
      return db
        .select()
        .from(subscriptionTypes)
        .where(eq(subscriptionTypes.isActive, true));
    }

    return db.select().from(subscriptionTypes);
  }

  /**
   * Create a new subscription type
   * @param data The subscription type data
   * @returns The created subscription type
   */
  public static async create(data: {
    name: string;
    duration: "1_day" | "7_days" | "30_days";
    amount: number;
    isActive?: boolean;
  }): Promise<SubscriptionType> {
    // Check if a subscription type with the same name already exists
    const [existing] = await db
      .select()
      .from(subscriptionTypes)
      .where(eq(subscriptionTypes.name, data.name));

    if (existing) {
      throw new Error("Subscription type with this name already exists");
    }

    const [subscriptionType] = await db
      .insert(subscriptionTypes)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        duration: data.duration,
        amount: data.amount,
        isActive: data.isActive ?? true,
      })
      .returning();

    return subscriptionType;
  }

  /**
   * Update a subscription type
   * @param id The subscription type ID
   * @param data The data to update
   * @returns The updated subscription type
   */
  public static async update(
    id: string,
    data: {
      name?: string;
      duration?: "1_day" | "7_days" | "30_days";
      amount?: number;
      isActive?: boolean;
    }
  ): Promise<SubscriptionType | null> {
    // Check if the subscription type exists
    const subscriptionType = await this.getById(id);

    if (!subscriptionType) {
      return null;
    }

    // Check if we're updating the name and if it conflicts with another subscription type
    if (data.name && data.name !== subscriptionType.name) {
      const [existing] = await db
        .select()
        .from(subscriptionTypes)
        .where(eq(subscriptionTypes.name, data.name));

      if (existing) {
        throw new Error("Subscription type with this name already exists");
      }
    }

    const [updated] = await db
      .update(subscriptionTypes)
      .set(data)
      .where(eq(subscriptionTypes.id, id))
      .returning();

    return updated;
  }
}
