# Nigerian Personal Income Tax Calculator

A modern web application for calculating Nigerian Personal Income Tax according to the latest tax laws. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Accurate Tax Calculations**: Based on Nigerian tax bands (2025)
- **Progressive Tax System**: Marginal tax rates from 0% to 25%
- **User Authentication**: Secure login/registration via Supabase Auth
- **Deduction Support**: Pension, NHF, and life assurance premiums
- **Detailed Reports**: View tax breakdown by band
- **PDF Export**: Download professional tax reports
- **Dashboard**: Track all your past calculations
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Validation**: Zod + react-hook-form
- **PDF Generation**: PDFKit
- **Hosting**: Vercel (app) + Supabase Cloud (DB/Auth)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-setup.sql`
4. Copy your project URL and anon key from Settings → API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace the placeholder values with your actual Supabase credentials.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses three main tables:

- **profiles**: Extends Supabase auth.users with additional user info
- **tax_bands**: Stores the progressive tax bands (editable for future updates)
- **tax_calculations**: Stores user tax calculation history

## Tax Bands (2025)

| Income Range | Tax Rate |
|--------------|----------|
| ₦0 - ₦800,000 | 0% |
| ₦800,000 - ₦3,000,000 | 15% |
| ₦3,000,000 - ₦12,000,000 | 18% |
| ₦12,000,000 - ₦25,000,000 | 21% |
| ₦25,000,000 - ₦50,000,000 | 23% |
| Above ₦50,000,000 | 25% |

## Project Structure

```
pit-calculator/
├─ app/
│  ├─ (auth)/              # Authentication pages
│  ├─ dashboard/           # User dashboard
│  ├─ calculator/          # Tax calculator
│  ├─ reports/             # Tax reports & PDF
│  └─ api/                 # API routes
├─ lib/
│  ├─ supabase/            # Supabase clients
│  ├─ tax/                 # Tax calculation engine
│  └─ pdf/                 # PDF generation
├─ components/             # Reusable components
└─ middleware.js           # Route protection
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the environment variables in Vercel settings
4. Deploy

The application will be live and ready to use!

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Passwords handled securely by Supabase Auth
- No sensitive data stored in client-side code

## License

This project is for educational purposes. Please consult tax professionals for official tax advice.

## Support

For issues or questions, please refer to the Nigerian tax authorities or a qualified tax professional.
"# PITCalculator" 
