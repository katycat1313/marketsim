import { db } from "../server/db";
import { adPlatformSimulations } from "../shared/schema";

async function checkAdSimulations() {
  console.log("Checking ad platform simulations in the database...");
  
  try {
    const simulations = await db.select().from(adPlatformSimulations);
    console.log(`Found ${simulations.length} simulations in the database.`);
    
    if (simulations.length > 0) {
      console.log("First simulation sample:");
      console.log(JSON.stringify(simulations[0], null, 2));
    }
  } catch (error) {
    console.error("Error checking simulations:", error);
  }
}

// Run the check function
checkAdSimulations()
  .then(() => {
    console.log("Check completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });