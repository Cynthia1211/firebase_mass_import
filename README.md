# Firestore Data Utility

A small Node.js command-line app for importing, exporting, and clearing documents in a Firestore collection selected when you run a command.

## Requirements

- Node.js and npm
- A Firebase project with Cloud Firestore enabled
- A Firebase Admin SDK service account key with permission to read and write the target Firestore database

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get a service account key from Firebase and place it in the project root (see [Get a service account key](#get-a-service-account-key)).

3. Put the data to import in `dataJSON.json`. It must be a JSON array. Each item must have a unique, non-empty string `id` without `/`; the `id` is used as the Firestore document ID.

There is no separate build step; the scripts run directly with Node.js.

## Get a service account key

1. Open the [Firebase console](https://console.firebase.google.com/) and select the project whose Firestore database you want to access.
2. Open **Project settings** using the gear icon next to **Project overview**.
3. Select the **Service accounts** tab, then choose **Firebase Admin SDK**.
4. Click **Generate new private key** and confirm. Firebase downloads a JSON key file to your computer.
5. Move the downloaded file into this project's root directory, alongside `package.json` and `importDataJSON.js`, and rename it to exactly `serviceAccountKey.json`.

The scripts load `./serviceAccountKey.json` from the project root. Keep the downloaded key private: do not commit it, upload it to a public repository, or share it. This project already ignores service account key files through `.gitignore`. If a key is exposed, revoke it in Google Cloud Console and generate a replacement. Make sure the key belongs to the Firebase project you intend to use.

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
