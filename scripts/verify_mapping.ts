
import { db } from "../server/db";
import { riskControls } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkMapping() {
    try {
        const mappings = await db.select().from(riskControls).where(eq(riskControls.riskId, 1));
        console.log("Mappings found:", mappings);
        process.exit(0);
    } catch (error) {
        console.error("Error checking mapping:", error);
        process.exit(1);
    }
}

checkMapping();
