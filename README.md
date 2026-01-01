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
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Image Generation**: Vercel AI Gateway + OpenAI DALL-E
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

### Using Supabase (Recommended)

1. Create a new project on [Supabase](https://supabase.com)
2. Get your connection string from Project Settings > Database
3. Add it to your `.env` file as `DATABASE_URL`

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
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `VERCEL_AI_GATEWAY_URL` (optional)
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
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for image generation | Yes |
| `VERCEL_AI_GATEWAY_URL` | Vercel AI Gateway URL (optional) | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | No |

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT
