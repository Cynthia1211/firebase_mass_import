const fs = require("node:fs/promises");
const path = require("node:path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

const collectionName = process.argv[2];
if (!collectionName || collectionName.includes("/")) {
  console.error("Usage: npm run download-all-data -- <collection-name>");
  process.exit(1);
}

const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

function getTimestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

async function downloadAllData() {
  const collectionRef = db.collection(collectionName);
  const documents = [];
  let lastDocument = null;

  console.log(`Starting export of the '${collectionName}' collection...`);

  while (true) {
    let query = collectionRef.orderBy("__name__").limit(400);
    if (lastDocument) query = query.startAfter(lastDocument);

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const document of snapshot.docs) {
      documents.push({ ...document.data(), id: document.id });
    }

    lastDocument = snapshot.docs[snapshot.docs.length - 1];
    console.log(`Read ${documents.length} documents...`);
  }

  const projectName = serviceAccount.project_id || "firestore";
  const fileName = `${projectName}_${getTimestamp()}.json`;
  const filePath = path.join(__dirname, fileName);
  await fs.writeFile(filePath, `${JSON.stringify(documents, null, 2)}\n`, "utf8");

  console.log(`Export completed. Saved ${documents.length} documents to ${filePath}`);
}

downloadAllData().catch((error) => {
  console.error(`Failed to export the '${collectionName}' collection:`, error);
  process.exitCode = 1;
});
