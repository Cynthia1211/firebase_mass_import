const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");
const wordsData = require("./dataJSON.json");

const collectionName = process.argv[2];
if (!collectionName || collectionName.includes("/")) {
  console.error("Usage: npm run import-data -- <collection-name>");
  process.exit(1);
}

// Initialize the Firebase Admin SDK.
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

async function importData() {
  console.log(`Starting Firestore data import into '${collectionName}'...`);
  
  const collectionRef = db.collection(collectionName);

  let failed = false;

  for (const item of wordsData) {
    try {
      if (!item.id || typeof item.id !== "string" || item.id.includes("/")) {
        throw new Error("Document IDs must be non-empty strings and cannot contain '/'.");
      }
      await collectionRef.doc(item.id).set(item);
      console.log(`Imported successfully: [${item.category}] ${item.word} (${item.id})`);
    } catch (error) {
      failed = true;
      console.error(`Failed to import ${item.id}:`, error);
    }
  }

  if (failed) {
    throw new Error("Some records failed to import. Check the errors above.");
  }
  console.log("Firestore data import completed.");
}

importData().catch((error) => {
  console.error("Import failed:", error);
  process.exitCode = 1;
});
