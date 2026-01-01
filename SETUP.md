# Setup Instructions for Dungeon Trawler

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `DATABASE_URL` - Your PostgreSQL connection string (Supabase recommended)
   - `OPENAI_API_KEY` - Your OpenAI API key for image generation
   - `VERCEL_AI_GATEWAY_URL` (optional) - If using Vercel AI Gateway

3. **Set up the database:**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Database Setup Options

### Option 1: Supabase (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > Database
3. Copy the connection string (use the "URI" format)
4. Add it to `.env` as `DATABASE_URL`

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb dungeon_game
   ```
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/dungeon_game
   ```

## Deploying to Vercel

### Step 1: Push to GitHub

1. Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `VERCEL_AI_GATEWAY_URL` (optional) - If using Vercel AI Gateway

5. Click "Deploy"

### Step 3: Run Database Migrations

After deployment, you need to run the database migrations on your production database:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Push schema
npm run db:push
```

Or use Vercel's CLI:
```bash
vercel env pull .env.production
npm run db:push
```

## Testing the Build

Before deploying, always test the build:

```bash
npm run build
```

If the build succeeds, you're ready to deploy!

## Troubleshooting

### Build fails with "DATABASE_URL is not set"

This is expected during build if you haven't set the environment variable. The build will use a dummy URL. Make sure to set `DATABASE_URL` in your Vercel environment variables.

### Images not generating

- Check that `OPENAI_API_KEY` is set correctly
- Verify your OpenAI account has credits
- Check the API route logs in Vercel for errors

### Database connection errors

- Verify `DATABASE_URL` is correct
- Check that your database is accessible from Vercel (Supabase allows this by default)
- Ensure you've run `npm run db:push` to create the schema

