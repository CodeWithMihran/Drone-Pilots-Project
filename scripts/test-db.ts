import fs from "fs";
import path from "path";
import mongoose from "mongoose";

async function testConnection() {
  console.log("==================================================");
  console.log("        MongoDB Connection Diagnostic Test        ");
  console.log("==================================================");

  // 1. Read .env.local
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env.local file not found!");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const uriMatch = envContent.match(/^MONGODB_URI=(.+)$/m);
  if (!uriMatch || !uriMatch[1].trim()) {
    console.error("❌ Error: MONGODB_URI is not defined in .env.local!");
    process.exit(1);
  }

  const uri = uriMatch[1].trim();
  const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");
  console.log(`\n📋 Configured MONGODB_URI in .env.local:`);
  console.log(`   ${maskedUri}\n`);

  // 2. Test direct connection
  console.log("🔄 Testing live connection to MongoDB Atlas...");
  const startTime = Date.now();

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    const elapsed = Date.now() - startTime;
    console.log(`\n✅ CONNECTION SUCCESSFUL! (${elapsed}ms)`);
    console.log(`   • Database Name: ${conn.connection.name}`);
    console.log(`   • Connected Host: ${conn.connection.host}`);
    console.log(`   • Port: ${conn.connection.port}`);
    console.log(`   • Ready State: ${conn.connection.readyState} (Connected)`);

    // 3. Ping cluster
    console.log("\n🔄 Executing ping on remote cluster...");
    const ping = await conn.connection.db?.admin().ping();
    console.log(`✅ Ping response:`, ping);

    // 4. Check collections
    const collections = await conn.connection.db?.listCollections().toArray();
    console.log(`\n📊 Collections in database: ${collections?.length ?? 0}`);
    if (collections && collections.length > 0) {
      collections.forEach((c) => console.log(`   - ${c.name}`));
    } else {
      console.log("   (Database is currently empty - ready for initial data or seed)");
    }

    await mongoose.disconnect();
    console.log("\n==================================================");
    console.log(" STATUS: SUCCESS - MongoDB Atlas is fully connected!");
    console.log("==================================================");
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error(`\n❌ CONNECTION FAILED after ${elapsed}ms!`);
    console.error(`   Error: ${error.message}`);
    console.log("\n==================================================");
    console.log(" STATUS: FAILED - App is falling back to in-memory DB.");
    console.log("==================================================");
    process.exit(1);
  }
}

testConnection();
