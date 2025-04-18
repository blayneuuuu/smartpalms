import {createClient} from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

// Test direct connection to Turso
const run = async () => {
  try {
    console.log("Connecting to database...");
    const url = process.env.DATABASE_URL;
    const authToken = process.env.DATABASE_AUTH_TOKEN;

    console.log("URL:", url);

    const client = createClient({
      url,
      authToken,
    });

    console.log("Running simple query...");

    const result = await client.execute("SELECT 1");
    console.log("Result:", result);

    console.log("Connection successful!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

run();
