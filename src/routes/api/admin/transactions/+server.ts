import {json} from "@sveltejs/kit";
import type {RequestHandler} from "./$types";
import {db} from "$lib/server/db";
import {
  transactions,
  users,
  subscriptions,
  subscriptionTypes,
} from "$lib/server/db/schema";
import {eq, and, gte, lte, desc} from "drizzle-orm";

export const GET: RequestHandler = async ({locals, url}) => {
  try {
    if (!locals.user || locals.user.type !== "admin") {
      return json({success: false, message: "Unauthorized"}, {status: 403});
    }

    // Get query parameters for filtering
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const status = url.searchParams.get("status");

    let query = db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        userId: transactions.userId,
        userName: users.name,
        userEmail: users.email,
        status: transactions.status,
        createdAt: transactions.createdAt,
        subscriptionId: transactions.subscriptionId,
        subscriptionName: subscriptionTypes.name,
        subscriptionDuration: subscriptionTypes.duration,
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.userId, users.id))
      .leftJoin(
        subscriptions,
        eq(transactions.subscriptionId, subscriptions.id)
      )
      .leftJoin(subscriptionTypes, eq(subscriptions.id, subscriptionTypes.id))
      .orderBy(desc(transactions.createdAt));

    // Apply filters if provided
    if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      query = query.where(gte(transactions.createdAt, startTimestamp));
    }

    if (endDate) {
      const endTimestamp =
        Math.floor(new Date(endDate).getTime() / 1000) + 86400; // Add one day
      query = query.where(lte(transactions.createdAt, endTimestamp));
    }

    if (status && ["success", "failed", "pending"].includes(status)) {
      query = query.where(eq(transactions.status, status as any));
    }

    // Execute the query
    const results = await query;

    // Calculate totals
    const successfulTransactions = results.filter(
      (t) => t.status === "success"
    );
    const totalAmount = successfulTransactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount || "0");
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Group by month for chart data
    const monthlyData = results.reduce(
      (acc, transaction) => {
        if (transaction.createdAt) {
          const date = new Date(Number(transaction.createdAt) * 1000);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

          if (!acc[monthYear]) {
            acc[monthYear] = {
              month: monthYear,
              count: 0,
              amount: 0,
            };
          }

          acc[monthYear].count += 1;

          if (transaction.status === "success") {
            const amount = parseFloat(transaction.amount || "0");
            acc[monthYear].amount += isNaN(amount) ? 0 : amount;
          }
        }
        return acc;
      },
      {} as Record<string, {month: string; count: number; amount: number}>
    );

    return json({
      success: true,
      transactions: results,
      stats: {
        total: results.length,
        success: results.filter((t) => t.status === "success").length,
        failed: results.filter((t) => t.status === "failed").length,
        pending: results.filter((t) => t.status === "pending").length,
        totalAmount,
      },
      chartData: Object.values(monthlyData).sort((a, b) =>
        a.month.localeCompare(b.month)
      ),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return json(
      {success: false, message: "Failed to fetch transactions"},
      {status: 500}
    );
  }
};
