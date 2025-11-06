# Deploying to Vercel

This repository is set up for deployment to Vercel. The project uses Vite and builds into the `dist` folder.

Options to deploy:

1) Connect the GitHub repository to Vercel (recommended)

   - Sign in to https://vercel.com with GitHub and import the `signal_decoder` repository.
   - Vercel will detect a static Vite app and run `npm run build`. The output directory is `dist`.

2) Use the included GitHub Actions workflow

   - Create a Vercel Personal Token at https://vercel.com/account/tokens and copy it.
   - In the GitHub repo, go to Settings → Secrets → Actions and add a secret named `VERCEL_TOKEN` with that token.
   - On push to `main` the workflow `.github/workflows/vercel-deploy.yml` will run, build the site and deploy with the Vercel CLI.

Manual local deploy (optional)

```powershell
# login interactively once
npx vercel login
# deploy the current state as production
npx vercel --prod
```

If you'd like me to perform the deployment for you, tell me whether you'll:

- Add a `VERCEL_TOKEN` secret to the GitHub repository so the workflow can run, or
- Provide a Vercel token here (not recommended in chat), or
- Invite the repository to a Vercel project/team and add me as a collaborator there.
