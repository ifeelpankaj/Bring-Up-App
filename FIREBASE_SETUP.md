# Firebase Credentials Setup

## Security Notice

🚨 **NEVER commit Firebase service account credentials to git!**

The `get-this-application-firebase-adminsdk.json` file contains sensitive credentials and is excluded from version control via `.gitignore`.

## Setup Instructions

### 1. Download Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`get-this-application`)
3. Navigate to **Project Settings** > **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file

### 2. Place Credentials File

- Rename the downloaded file to: `get-this-application-firebase-adminsdk.json`
- Place it in the root directory of this project (same level as `package.json`)
- The file will be automatically ignored by git

### 3. Alternative: Environment Variables (Recommended for Production)

Instead of using a file, you can use environment variables:

```bash
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PROJECT_ID="your-firebase-project-id"
```

### 4. Verify Setup

The credentials should be available to your Firebase Admin SDK configuration.

## Troubleshooting

### If you accidentally committed credentials:

1. Remove from git: `git rm --cached get-this-application-firebase-adminsdk.json`
2. Add to `.gitignore` (already done)
3. Commit changes: `git commit -m "Remove Firebase credentials"`
4. **Regenerate credentials** in Firebase Console (invalidate old ones)

### Production Deployment:

- Use environment variables instead of files
- Never include credential files in Docker images
- Use secure secret management services (AWS Secrets Manager, etc.)
