# Public Transport Feedback Platform

This is a starter project for a public transport feedback platform, designed to allow users to report issues, share feedback, and contribute to the improvement of public transportation services.

## Features

- **User Feedback Forms**: Easily submit detailed reports about incidents, delays, or general feedback on services.
- **Data Aggregation & Analysis**: Collects and analyzes all submissions to identify patterns and key areas for improvement.
- **Advocacy for Change**: Uses collective feedback to advocate for positive changes with transport authorities.
- **Responsive Design**: Built with Tailwind CSS and Shadcn UI for a modern, responsive user interface.
- **Next.js App Router**: Utilizes the latest Next.js features for server components, route handlers, and more.
- **Supabase Integration**: Ready for backend integration with Supabase for database and authentication (authentication to be added).

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Installation

1.  **Clone the repository:**

    \`\`\`bash
    git clone https://github.com/your-username/public-transport-feedback.git
    cd public-transport-feedback
    \`\`\`

2.  **Install dependencies:**

    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root of your project and add your Supabase credentials:

    \`\`\`env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # Only needed for server-side operations that require elevated privileges
    \`\`\`

    You can find these keys in your Supabase project settings under `API`.

4.  **Run Database Migrations (Supabase):**

    If you're using Supabase, you can run the SQL scripts provided in the `scripts/` directory to set up your tables. You can execute these directly in your Supabase SQL Editor or via a migration tool.

    -
