# 🏰 Dungeon Trawler

A creative puzzle-solving dungeon crawler game designed for middle-grade players and up. Explore mysterious dungeons, solve creative puzzles, and uncover secrets as you progress through each level.

## Features

- 🎮 Creative puzzle-solving challenges (riddles, patterns, word puzzles)
- 🎨 Beautiful AI-generated dungeon rooms using Vercel AI Gateway
- 📊 Player progression system with levels and experience
- 🗺️ Multiple dungeons with unique themes
- 💾 Save and continue your adventure
- 🎯 Progressive difficulty levels

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Image Storage**: Vercel Blob Storage
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Image Generation**: OpenAI DALL-E (via Vercel AI Gateway optional)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database (local or Supabase)
- OpenAI API key (for image generation)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dungeon-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for image generation
- `VERCEL_AI_GATEWAY_URL` (optional) - Vercel AI Gateway URL if using

4. Set up the database:
```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

## Database Setup

### Using Neon (Recommended)

1. Create a new project at [Neon](https://neon.tech)
2. Copy your connection string from the project dashboard
3. Add it to your `.env` file as `DATABASE_URL`
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

### Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb dungeon_game
```
3. Update `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dungeon_game
```

## Deployment to Vercel

### Automatic Deployment via GitHub

1. Push your code to GitHub
2. Connect your repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
3. Add environment variables in Vercel:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `BLOB_READ_WRITE_TOKEN` - Your Vercel Blob storage token
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `VERCEL_AI_GATEWAY_URL` (optional) - If using Vercel AI Gateway
4. Deploy!

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── game/              # Game pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── game/             # Game-specific components
│   └── ui/               # Shadcn UI components
├── lib/                   # Utility libraries
│   ├── ai/               # AI/image generation
│   ├── db/               # Database schema and client
│   └── game/             # Game logic (puzzles, etc.)
└── public/               # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage read/write token | Yes |
| `OPENAI_API_KEY` | OpenAI API key for image generation | Yes |
| `VERCEL_AI_GATEWAY_URL` | Vercel AI Gateway URL (optional) | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | No |

### Getting Your Environment Variables

**Neon Database:**
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string from your project dashboard
3. Add it as `DATABASE_URL` in your `.env` file

**Vercel Blob Storage:**
1. Go to your Vercel project settings
2. Navigate to Storage > Blob
3. Create a new Blob store if needed
4. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings
5. Add it to your `.env` file

**OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key in your account settings
3. Add it as `OPENAI_API_KEY` in your `.env` file

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT
