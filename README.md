# Audio WOTC Unemployment Verification

A Next.js application for collecting employment verification data through an audio-guided form interface.

## Features

- Audio-guided form completion
- Multi-company support with custom branding
- Real-time form validation
- Supabase integration for data storage
- Row-level security for data protection
- Mobile-responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Routes

- `/` - Default company form
- `/af_2` - Empeon Group
- `/af_x7k9v` - Emergency Ambulance
- `/af_m4r2t` - The W Group
- `/audio_form` - HCS
- `/af_royal` - Royal
- `/thank-you` - Thank you page

## Deployment

This application is configured for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Database Schema

The application uses the `audio_form_responses` table with the following key fields:
- Personal information (first_name, last_name, dob)
- Employment status
- Audio interaction tracking
- Browser and device information
- Session tracking

Row-level security is enabled to protect data access.

## License

Private repository - All rights reserved