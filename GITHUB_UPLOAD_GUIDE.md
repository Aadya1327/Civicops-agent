# GitHub Upload Guide

## Option A: GitHub website

1. Go to GitHub and create a new public repository.
2. Name it `civicops-agent`.
3. Do not add a README or license on GitHub because this project already has both.
4. Upload the files from this folder.
5. Confirm `LICENSE` is visible in the repository.

## Option B: Git command line

From the project folder:

```bash
git init
git add .
git commit -m "Initial CivicOps Agent submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/civicops-agent.git
git push -u origin main
```

## Important

Do not commit `backend/.env`. Use `backend/.env.example` only.
