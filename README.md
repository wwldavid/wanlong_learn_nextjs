1. modify tsconfig.json, avoiding future errors.
   "baseUrl": ".",
   "paths": {
   "@/_": ["./_"],
   "@app/_": ["app/_"],
   }
2. create datebase on Vercel

3. pnpm i @vercel/postgres

4. edit package.json (add one command line: "seed": "node -r dotenv/config ./scripts/seed.js")
   "scripts": {
   "build": "next build",
   "dev": "next dev --turbopack",
   "start": "next start",
   "seed": "node -r dotenv/config ./scripts/seed.js"
   },

5. pnpm add dotenv
6. pnpm run seed
