const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

const collectionName = process.argv[2];
if (!collectionName || collectionName.includes("/")) {
  console.error("Usage: npm run clear-all-data -- <collection-name>");
  process.exit(1);
}

const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

async function clearAllData() {
  const collectionRef = db.collection(collectionName);
  let deletedCount = 0;

  console.log(`Starting to clear the '${collectionName}' collection...`);

  while (true) {
    const snapshot = await collectionRef.limit(400).get();
    if (snapshot.empty) break;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    deletedCount += snapshot.size;
    console.log(`Deleted ${deletedCount} documents so far.`);
  }

  console.log(`Clear completed. Deleted ${deletedCount} documents.`);
}

clearAllData().catch((error) => {
  console.error(`Failed to clear the '${collectionName}' collection:`, error);
  process.exitCode = 1;
});
