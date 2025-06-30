# NYC FARE Reporter

This is a Next.js application designed to help New York City renters report illegal broker fees and other housing violations under the FARE Act. It aims to streamline the reporting process, provide AI-enhanced drafting, and build a public database of violations for accountability.

## Features

- **Lead Capture Form (Page 1):** Collects basic user information and allows selection of report type (Live Report, Schedule Test, Just Updates).
- **Live Report Form (Page 2):** Comprehensive form for reporting property details, involved parties, violation types, and a narrative of what happened.
- **AI-Enhanced Reporting:** Option to use AI to refine the report narrative for clarity and legal precision.
- **File Uploads:** Allows users to upload supporting documents.
- **Direct Government Filing:** Designed to submit reports directly to NYC DCWP and NYS Department of State.
- **Public Accountability:** Anonymized data contributes to a public dashboard of violation patterns.
- **Schedule Your Report Later:** Option for users to schedule a time for assistance with filing their report.
- **Waitlist:** For users who just want updates on the project's launch.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Server Actions:** For handling form submissions and database interactions.
- **AI:** Integration with AI models for report refinement.

## Project Structure

\`\`\`
.
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts         # Health check API route
│   ├── integration-test/
│   │   └── page.tsx             # Integration test page
│   ├── test-forms/
│   │   ├── layout.tsx           # Layout for test forms
│   │   └── page.tsx             # Page for testing various form components
│   ├── test/
│   │   └── page.tsx             # General test page
│   ├── globals.css              # Global CSS styles
│   ├── layout.tsx               # Root layout for the application
│   └── page.tsx                 # Main application page (landing page and form)
├── components/
│   ├── icons/
│   │   ├── check-icon.tsx       # Checkmark icon component
│   │   └── tiktok-icon.tsx      # TikTok icon component
│   ├── ui/                      # Shadcn/ui components (accordion, button, input, etc.)
│   └── ...                      # Other custom components (lead-analytics, lead-progress-indicator)
├── hooks/
│   ├── use-lead-validation.ts   # Custom hook for lead form validation
│   ├── use-mobile.tsx           # Custom hook for mobile detection
│   └── use-toast.ts             # Custom hook for toast notifications
├── lib/
│   ├── actions.ts               # Server Actions for form submissions
│   ├── supabase/                # Supabase client setup
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts                 # Utility functions (e.g., cn for Tailwind classes)
├── public/                      # Static assets (images, favicons)
├── scripts/                     # SQL scripts for database schema management
│   ├── create-tables.sql        # Initial table creation script
│   ├── update-schema.sql        # Schema update scripts
│   └── ...
├── styles/
│   └── globals.css              # Additional global styles
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── ...                          # Other configuration files (next.config.mjs, postcss.config.mjs)
\`\`\`

## Development

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

2.  **Set up Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
    \`\`\`bash
    cp .env.example .env.local
    \`\`\`

3.  **Run Database Migrations (Supabase):**
    Ensure your Supabase project is set up and connect to it. You can run the SQL scripts in the `scripts/` directory.
    For example, to create initial tables:
    \`\`\`bash
    # Connect to your Supabase database using psql or a GUI tool
    # Then execute the SQL files:
    # \i scripts/create-tables.sql
    # \i scripts/update-schema.sql
    \`\`\`
    *Note: The `scripts/fix-reports-schema-complete.sql` and `scripts/update-reports-schema-v2.sql` are for specific schema updates and should be run in order if applicable to your Supabase project.*

4.  **Run the Development Server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema (Simplified)

The primary tables involved are `vercel` (formerly `leads`) and `reports`.

### `vercel` Table (formerly `leads`)

Stores lead capture information.

| Column             | Type     | Constraints                               | Description                               |
| :----------------- | :------- | :---------------------------------------- | :---------------------------------------- |
| `id`               | `uuid`   | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the lead            |
| `created_at`       | `timestamptz` | `DEFAULT now()`                           | Timestamp of creation                     |
| `first_name`       | `text`   | `NOT NULL`                                | User's first name                         |
| `last_name`        | `text`   | `NOT NULL`                                | User's last name                          |
| `email`            | `text`   | `NOT NULL`, `UNIQUE`, `CHECK (email LIKE 'vercel%')` | User's email, must start with "vercel"    |
| `phone`            | `text`   | `NULLABLE`                                | User's phone number                       |
| `form_type`        | `text`   | `NOT NULL`                                | Type of form submitted (e.g., 'waitlist', 'report', 'schedule') |
| `referral_source`  | `text`   | `NULLABLE`                                | How the user found the platform           |
| `mailing_list_consent` | `boolean` | `DEFAULT FALSE`                           | Consent to receive mailing list updates   |

### `reports` Table

Stores detailed report information.

| Column             | Type     | Constraints                               | Description                               |
| :----------------- | :------- | :---------------------------------------- | :---------------------------------------- |
| `id`               | `uuid`   | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the report          |
| `created_at`       | `timestamptz` | `DEFAULT now()`                           | Timestamp of creation                     |
| `user_email`       | `text`   | `NOT NULL`                                | Email of the user submitting the report   |
| `user_phone`       | `text`   | `NULLABLE`                                | Phone of the user submitting the report   |
| `preferred_contact`| `text`   | `NULLABLE`                                | Preferred contact method                  |
| `is_veteran`       | `boolean`| `DEFAULT FALSE`                           | Whether the user is a veteran             |
| `property_info_type`| `text`   | `NULLABLE`                                | Type of property info (streeteasy/manual) |
| `streeteasy_link`  | `text`   | `NULLABLE`                                | StreetEasy listing URL                    |
| `manual_address`   | `text`   | `NULLABLE`                                | Manually entered address                  |
| `manual_price`     | `text`   | `NULLABLE`                                | Manually entered price                    |
| `manual_unit`      | `text`   | `NULLABLE`                                | Manually entered unit                     |
| `manual_bedrooms`  | `text`   | `NULLABLE`                                | Manually entered bedrooms                 |
| `manual_bathrooms` | `text`   | `NULLABLE`                                | Manually entered bathrooms                |
| `borough`          | `text`   | `NULLABLE`                                | Borough of the property                   |
| `neighborhood`     | `text`   | `NULLABLE`                                | Neighborhood of the property              |
| `who_reporting`    | `text`   | `NULLABLE`                                | Who the report is about (management/agent/brokerage) |
| `management_company_name` | `text` | `NULLABLE`                            | Name of management company                |
| `agent_first_name` | `text`   | `NULLABLE`                                | Agent's first name                        |
| `agent_last_name`  | `text`   | `NULLABLE`                                | Agent's last name                         |
| `brokerage_name`   | `text`   | `NULLABLE`                                | Brokerage name                            |
| `business_address` | `text`   | `NULLABLE`                                | Business address                          |
| `business_phone`   | `text`   | `NULLABLE`                                | Business phone                            |
| `business_email`   | `text`   | `NULLABLE`                                | Business email                            |
| `business_website` | `text`   | `NULLABLE`                                | Business website                          |
| `business_license` | `text`   | `NULLABLE`                                | Business license                          |
| `brokerage_for_agent` | `text` | `NULLABLE`                                | Brokerage associated with agent           |
| `contacted_business` | `boolean`| `DEFAULT FALSE`                           | Whether business was contacted            |
| `employee_name`    | `text`   | `NULLABLE`                                | Name of employee contacted                |
| `what_happened`    | `text`   | `NULLABLE`                                | Description of what happened              |
| `outcome`          | `text`   | `NULLABLE`                                | Outcome of the incident                   |
| `outcome_chips`    | `jsonb`  | `DEFAULT '[]'::jsonb`                     | JSON array of outcome chips               |
| `outcome_other_text` | `text`   | `NULLABLE`                                | Other outcome details                     |
| `violations`       | `jsonb`  | `DEFAULT '[]'::jsonb`                     | JSON array of selected violations         |
| `violation_other_texts` | `jsonb` | `DEFAULT '{}'::jsonb`                     | JSON object for other violation details   |
| `illegal_broker_fee_charged` | `boolean` | `NULLABLE`                     | Illegal broker fee charged                |
| `requirement_to_use_broker` | `boolean` | `NULLABLE`                      | Requirement to use broker                 |
| `fees_not_disclosed` | `boolean` | `NULLABLE`                             | Fees not disclosed                        |
| `fees_not_disclosed_text` | `text` | `NULLABLE`                            | Details for fees not disclosed            |
| `improper_fees_in_ad` | `boolean` | `NULLABLE`                            | Improper fees in ad                       |
| `improper_fees_in_ad_url` | `text` | `NULLABLE`                            | URL for improper fees in ad               |
| `fee_charges`      | `jsonb`  | `DEFAULT '[]'::jsonb`                     | JSON array of fee charges                 |
| `fee_charges_other`| `text`   | `NULLABLE`                                | Other fee charges details                 |
| `document_info`    | `jsonb`  | `DEFAULT '[]'::jsonb`                     | JSON array of uploaded document info      |
| `ai_refinement_option` | `text` | `DEFAULT 'refine'`                        | AI refinement option                      |
| `report_description` | `text`   | `NULLABLE`                                | AI-generated report description           |
| `narrative`        | `text`   | `NOT NULL`                                | User's narrative of the incident          |
| `additional_notes` | `text`   | `NULLABLE`                                | Additional notes                          |
| `desired_outcome`  | `jsonb`  | `DEFAULT '[]'::jsonb`                     | JSON array of desired outcomes            |
| `desired_outcome_other` | `text` | `NULLABLE`                            | Other desired outcome details             |
| `resend_report_to_me` | `boolean` | `DEFAULT FALSE`                        | Option to resend report to user           |
| `dcwp_consent`     | `boolean`| `DEFAULT FALSE`                           | Consent for DCWP submission               |
| `proxy_consent`    | `boolean`| `DEFAULT FALSE`                           | Consent for proxy submission              |
| `submitted`        | `boolean`| `DEFAULT FALSE`                           | Submission status                         |
| `best_time_to_reach_you` | `text` | `NULLABLE`                            | Best time to reach user for scheduling    |
| `brief_issue_snapshot` | `text` | `NULLABLE`                            | Brief snapshot of the issue for scheduling|

## Contributing

We welcome contributions! Please feel free to open issues or submit pull requests.
