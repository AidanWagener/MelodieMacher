# MelodieMacher

Personalisierte Songs als Geschenk - fuer den deutschen Markt.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom (shadcn/ui style)
- **Forms:** React Hook Form + Zod
- **Payments:** Stripe
- **Animations:** Framer Motion

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., http://localhost:3000)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
melodiemacher/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── bestellen/          # Order flow
│   │   ├── danke/              # Thank you page
│   │   ├── song/[id]/          # Song delivery page
│   │   ├── impressum/          # Legal pages
│   │   ├── datenschutz/
│   │   ├── agb/
│   │   ├── widerruf/
│   │   └── api/                # API routes
│   │       ├── checkout/       # Stripe checkout
│   │       └── webhook/        # Stripe webhook
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── shared/             # Shared components (Header, Footer)
│   │   ├── landing/            # Landing page sections
│   │   └── order/              # Order form components
│   └── lib/                    # Utilities and schemas
├── public/                     # Static assets
└── ...config files
```

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel
```

## Stripe Webhook Setup

For local development:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

For production, configure the webhook endpoint in your Stripe dashboard:
`https://yourdomain.de/api/webhook`

## License

Proprietary - All rights reserved.
