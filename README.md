# Firestore Data Utility

A small Node.js command-line app for importing, exporting, and clearing documents in a Firestore collection selected when you run a command.

## Requirements

- Node.js and npm
- A Firebase project with Cloud Firestore enabled
- A service account key with permission to read and write the target Firestore database

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Place the service account JSON key in the project root and name it `serviceAccountKey.json`.

3. Put the data to import in `dataJSON.json`. It must be a JSON array. Each item must have a unique, non-empty string `id` without `/`; the `id` is used as the Firestore document ID.

There is no separate build step; the scripts run directly with Node.js.

## Commands

Import records from `dataJSON.json` into the named collection. Existing documents with matching IDs are overwritten. Pass the collection name after `--`:

```bash
npm run import-data -- words
```

Export all documents in the named collection to a JSON file in the project directory. The filename uses the Firebase project ID and a UTC timestamp, for example `my-project_20260926T143000Z.json`:

```bash
npm run download-all-data -- words
```

Delete every document in the named collection:

```bash
npm run clear-all-data -- words
```

**The clear command permanently deletes all documents in the collection you specify.** Confirm the collection name before running it.

## Files

- `importDataJSON.js` — imports `dataJSON.json` into the specified collection.
- `downloadAllData.js` — exports the specified collection to a timestamped JSON file.
- `clearAllData.js` — deletes documents from the specified collection.
- `serviceAccountKey.json` — Firebase service account credentials; keep this file private and do not commit it to a public repository.
