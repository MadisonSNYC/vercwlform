# NYC FARE Reporter

*Fight Back Against Illegal Rental Fees in NYC*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev)

## Overview

NYC FARE (Fee Abuse Reporting Engine) empowers tenants to report illegal broker fees, discriminatory practices, and rental scams. This platform helps build a comprehensive database of rental violations to protect future renters and drive policy change.

## Features

- **Dual Form System**: Waitlist signup and comprehensive violation reporting
- **Responsive Design**: Mobile-first design with smooth animations
- **Supabase Integration**: Secure data storage with Row Level Security
- **Real-time Validation**: Live form validation and submission feedback
- **TypeScript**: Full type safety throughout the application

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd nyc-fare-reporter
npm install
\`\`\`

### 2. Environment Setup

Copy the environment template:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Supabase credentials in `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Run the SQL script in the Supabase SQL Editor:

\`\`\`sql
-- Copy and paste the contents of scripts/create-tables.sql
\`\`\`

### 4. Development

First, run the development server:

\`\`\`bash
npm run dev          # Start development server
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## ✅ **Verify Connection**

After setup, verify everything is working:

### 1. Check Environment Variables
Make sure your `.env.local` contains:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 2. Test Database Connection
Run the verification script in Supabase SQL Editor:
\`\`\`sql
-- Copy and paste contents of scripts/verify-setup.sql
\`\`\`

### 3. Test the Application
1. Start the development server: `npm run dev`
2. Look for the connection status indicator in the bottom-left corner
3. Try submitting the waitlist form with a test email
4. Check your Supabase dashboard to see if the data appears

### 4. Common Issues

**"Supabase environment variables not configured"**
- Double-check your `.env.local` file
- Restart your development server after adding environment variables

**"Database error: relation does not exist"**
- Run the SQL script from `scripts/create-tables.sql` in Supabase
- Make sure you're using the correct database URL

**"Failed to submit"**
- Check the browser console for detailed error messages
- Verify RLS policies are set up correctly

## Database Schema

### Tables

- **waitlist**: Beta signup information
  - `id` (UUID, Primary Key)
  - `email` (TEXT, Required)
  - `form_type` (TEXT, 'schedule' or 'waitlist')
  - `contact_time` (TEXT, Optional)
  - `issue_snapshot` (TEXT, Optional)
  - `mailing_list_consent` (BOOLEAN)
  - `created_at` (TIMESTAMP)

- **reports**: Detailed violation reports
  - `id` (UUID, Primary Key)
  - Property information (address, price, bedrooms, etc.)
  - Contact history and business details
  - Violation categories (JSONB array)
  - Personal information and consents
  - `created_at` (TIMESTAMP)

### Security

- Row Level Security (RLS) enabled on all tables
- Public insert policies for form submissions
- Data validation at application and database level

## Form Features

### Waitlist Form
- Simple email signup
- Contact time preferences
- Issue description (optional)
- Mailing list consent

### Full Report Form
- Comprehensive violation reporting
- Multiple violation categories
- Property and business information
- Contact history tracking
- Required consent checkboxes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
\`\`\`

### Project Structure

\`\`\`
├── app/
│   ├── auth/           # Authentication pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main landing page
├── components/
│   └── ui/             # Reusable UI components
├── lib/
│   ├── actions.ts      # Server actions
│   ├── supabase/       # Supabase configuration
│   └── utils.ts        # Utility functions
├── scripts/
│   └── create-tables.sql # Database setup
└── public/             # Static assets
\`\`\`

## Contributing

This project is part of the NYC housing advocacy effort. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub or contact the development team.
