# SpendWise

SpendWise is a personal budgeting and expense tracking application built with Next.js.

## Getting Started

To get started with local development:

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Open [http://localhost:9002](http://localhost:9002) (or your configured port) with your browser to see the result.

3.  **Run Genkit development server (for AI features):**
    In a separate terminal, run:
    ```bash
    npm run genkit:dev
    # or
    yarn genkit:dev
    # or
    pnpm genkit:dev
    ```

## Deployment

This Next.js application can be deployed to various platforms that support Node.js applications.

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details on deploying to Vercel and other platforms.

### Firebase Hosting

You can also deploy this application to Firebase Hosting.
1. Ensure you have the Firebase CLI installed and are logged in.
2. Configure Firebase for your project: `firebase init hosting` (select your Firebase project).
3. Configure your `firebase.json` to correctly serve the Next.js app. This typically involves setting up a rewrite to a Cloud Function or Cloud Run instance that serves the Next.js app.
   Example `firebase.json` for Next.js with Cloud Functions:
   ```json
   {
     "hosting": {
       "source": ".",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "frameworksBackend": {
         "region": "us-central1" // Or your preferred region
       }
     }
   }
   ```
   Ensure your `next.config.js` has `output: 'standalone'` for optimal Firebase deployment.
4. Build your Next.js app: `npm run build`.
5. Deploy to Firebase Hosting: `firebase deploy --only hosting`.

Refer to the [official Firebase documentation](https://firebase.google.com/docs/hosting/frameworks/nextjs) for the most up-to-date instructions.
