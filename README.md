# Audio Form App

A streamlined audio-based form application for collecting employee information with audio guidance.

## Features

- Audio-guided form completion
- Multi-company support with custom branding
- Real-time form validation
- Supabase integration for data storage
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and add your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Routes

- `/` - Default audio form
- `/af_2` - Empeon Group form
- `/af_x7k9v` - Emergency Ambulance form
- `/af_m4r2t` - The W Group form
- `/audio_form` - HCS form
- `/af_royal` - Royal form
- `/thank-you` - Thank you page

## Building for Production

```bash
npm run build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- React Router