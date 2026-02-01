# QRly

<div align="center">

![QRly Logo](https://img.shields.io/badge/QRly-QR%20Code%20Platform-1A120B?style=for-the-badge)

**Create, track, and manage dynamic QR codes with real-time analytics. Simple, secure, and lightning fast.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [API](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Rate Limiting](#-rate-limiting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

QRly is a modern, full-stack QR code management platform that enables users to create, manage, and track QR codes with advanced features like expiration dates, scan limits, campaign organization, and real-time analytics. Built with performance and scalability in mind, QRly leverages Redis caching, rate limiting, and serverless architecture to deliver lightning-fast QR code redirects.

---

## ✨ Features

### Core Functionality
- **Dynamic QR Code Generation** - Create QR codes with custom titles and target URLs
- **Campaign Management** - Organize multiple QR codes into campaigns
- **Real-time Analytics** - Track scan counts and performance metrics in real-time
- **Expiration Control** - Set expiration dates for QR codes
- **Scan Limits** - Configure maximum scan limits per QR code
- **Short URL Generation** - Automatic short URL creation for easy sharing

### Advanced Features
- **Redis Caching** - Ultra-fast QR code lookups with Redis caching
- **Rate Limiting** - Protection against abuse with Upstash rate limiting
- **Real-time Updates** - Supabase real-time subscriptions for live data
- **Authentication** - Secure user authentication with Clerk
- **Responsive Design** - Beautiful, modern UI that works on all devices
- **Public/Private Routes** - Flexible routing with middleware protection

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15.5.0** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Backend & Services
- **Supabase** - PostgreSQL database and real-time subscriptions
- **Clerk** - Authentication and user management
- **Upstash Redis** - Serverless Redis for caching and rate limiting
- **Next.js API Routes** - Serverless API endpoints

### Infrastructure
- **EC2 Instances** - Application servers running Node.js
- **Load Balancer** - Distributes traffic across multiple EC2 instances
- **PM2** - Process manager for Node.js applications
- **Nginx** - Reverse proxy and load balancing (if configured)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐
│   Load Balancer  │
│   (AWS ALB)     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ EC2-1 │ │ EC2-2│  (Multiple instances)
│ PM2   │ │ PM2  │
│ Next  │ │ Next │
└───┬───┘ └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────▼──────────────┐
    │   Supabase        │
    │   (PostgreSQL)    │
    └───────────────────┘
         │
    ┌────▼──────────────┐
    │   Upstash Redis   │
    │   (Caching)       │
    └───────────────────┘
```

### Application Flow

1. **User Request** → Load Balancer distributes traffic
2. **EC2 Instance** → Next.js application processes request
3. **Authentication** → Clerk middleware validates user
4. **Data Layer** → Supabase for persistent data, Redis for caching
5. **Rate Limiting** → Upstash Redis enforces rate limits
6. **Response** → Optimized response with cached data when possible

### Key Components

- **Middleware** - Handles authentication and route protection
- **API Routes** - `/api/qr_codes` for QR code CRUD operations
- **Dynamic Routes** - `/[camid]` for campaign pages, `/r/[slug]` for QR redirects
- **Server Components** - Pre-rendered pages with server-side data fetching
- **Client Components** - Interactive UI with real-time updates

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Clerk account and application
- Upstash Redis account
- AWS EC2 instance (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalpm1110/qrly.git
   cd qrly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   See [Environment Variables](#-environment-variables) for required values.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Auth0 (if used)
AUTH0_ISSUER_BASE_URL=your_auth0_issuer_url
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | Base URL of your application | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | Yes |

---

## 🗄 Database Schema

### Tables

#### `qrs`
Stores QR code information.

| Column | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | TEXT | Unique slug for URL |
| `title` | TEXT | QR code title |
| `url` | TEXT | Target URL |
| `owner_id` | TEXT | User ID (Clerk) |
| `campaign_id` | UUID | Optional campaign ID |
| `max_scans` | INTEGER | Maximum scan limit (-1 for unlimited) |
| `expires_at` | TIMESTAMP | Expiration date |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `qranalytics`
Stores analytics data for QR codes.

| Column | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `qr_id` | UUID | Foreign key to `qrs` |
| `user_id` | TEXT | User ID |
| `campaign_id` | UUID | Campaign ID |
| `title` | TEXT | QR code title |
| `url` | TEXT | Short URL |
| `target_url` | TEXT | Target URL |
| `total_scans` | INTEGER | Total scan count |
| `expire_at` | TIMESTAMP | Expiration date |
| `max_scans` | INTEGER | Maximum scans |
| `camname` | TEXT | Campaign name |

#### `campaigns`
Stores campaign information.

| Column | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Campaign name |
| `owner_id` | TEXT | User ID |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Database Functions

- `increment_scan(qr_id)` - Increments scan count for a QR code

---

## 🚢 Deployment

### EC2 Deployment with Load Balancer

#### 1. Prepare EC2 Instances

On each EC2 instance:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone repository
git clone https://github.com/kalpm1110/qrly.git
cd qrly

# Install dependencies
npm install

# Build the application
npm run build
```

#### 2. Configure Environment Variables

Create `.env.local` on each EC2 instance with production values.

#### 3. Start Application with PM2

```bash
# Start the application
pm2 start npm --name "qrly" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 4. Configure Load Balancer

Set up an AWS Application Load Balancer (ALB) or Network Load Balancer (NLB):

- **Target Group**: Add all EC2 instances
- **Health Check**: Configure health check endpoint
- **Listener**: Configure HTTP/HTTPS listeners
- **Security Groups**: Allow traffic on ports 80/443

#### 5. Deployment Script

Use the provided `deplooy.sh` script for updates:

```bash
#!/bin/bash
git pull origin main
npm install
npm run build
pm2 restart qrly
pm2 save
```

Make it executable:
```bash
chmod +x deplooy.sh
```

#### 6. Nginx Configuration (Optional)

If using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Production Checklist

- [ ] Set up SSL/TLS certificates (Let's Encrypt or AWS Certificate Manager)
- [ ] Configure environment variables on all instances
- [ ] Set up monitoring and logging (CloudWatch, etc.)
- [ ] Configure auto-scaling groups (optional)
- [ ] Set up database backups
- [ ] Configure CDN for static assets (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure domain DNS to point to load balancer

---

## 📡 API Reference

### Create QR Code

**POST** `/api/qr_codes`

Creates a new QR code.

**Request Body:**
```json
{
  "title": "My QR Code",
  "owner_id": "user_xxx",
  "url": "https://example.com",
  "campaign_id": "uuid" | null,
  "camname": "Campaign Name" | null,
  "max_scans": 100 | -1,
  "expires_at": "2024-12-31T23:59:59Z" | null
}
```

**Response:**
```json
{
  "qr": {
    "id": "uuid",
    "slug": "abc1234",
    "title": "My QR Code",
    "url": "https://example.com",
    ...
  },
  "short_url": "https://yourdomain.com/r/abc1234"
}
```

**Rate Limit:** 100 requests per hour per user

### Update QR Code

**PUT** `/api/qr_codes`

Updates an existing QR code.

**Request Body:**
```json
{
  "qrId": "uuid",
  "title": "Updated Title",
  "url": "https://newurl.com",
  "max_scans": 200,
  "expires_at": "2025-12-31T23:59:59Z",
  "campaign_id": "uuid" | null,
  "total_scans": 50
}
```

**Response:**
```json
{
  "updatedQR": {
    "id": "uuid",
    "slug": "abc1234",
    ...
  }
}
```

### Delete QR Code

**DELETE** `/api/qr_codes`

Deletes a QR code.

**Request Body:**
```json
{
  "qrId": "uuid"
}
```

**Response:**
```json
{
  "msg": "QR deleted successfully"
}
```

### QR Code Redirect

**GET** `/r/[slug]`

Redirects to the target URL associated with the QR code slug.

**Rate Limit:** 6 requests per minute per IP

---

## 🛡 Rate Limiting

QRly implements rate limiting using Upstash Redis to protect against abuse:

### QR Code Creation
- **Limit:** 100 requests per hour per user
- **Type:** Fixed window
- **Endpoint:** `POST /api/qr_codes`

### QR Code Scanning
- **Limit:** 6 requests per minute per IP
- **Type:** Sliding window
- **Endpoint:** `GET /r/[slug]`

Rate limit responses return HTTP 429 with appropriate error messages.

---

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Project Structure

```
qrly/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── [camid]/      # Dynamic campaign routes
│   │   ├── api/          # API routes
│   │   ├── r/[slug]/     # QR redirect routes
│   │   ├── about/        # About page
│   │   ├── dashboard/    # Dashboard page
│   │   └── yourqrs/      # User QR codes page
│   ├── components/       # React components
│   │   ├── QR/          # QR code components
│   │   ├── campaign/    # Campaign components
│   │   ├── forms/       # Form components
│   │   └── ui/          # UI primitives
│   ├── lib/             # Utility libraries
│   │   ├── supabase.js  # Supabase client
│   │   ├── redis.js     # Redis client
│   │   ├── rateLimit.js # Rate limiting
│   │   └── slug.js      # Slug generation
│   └── middleware.js    # Next.js middleware
├── public/              # Static assets
├── package.json
├── next.config.mjs
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Clerk](https://clerk.com/) - Authentication
- [Upstash](https://upstash.com/) - Serverless Redis
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components

---

## 📞 Support

For support, email support@qrly.app or open an issue in the [GitHub repository](https://github.com/kalpm1110/qrly).

---

<div align="center">

**Made with ❤️ by the QRly team**

[⭐ Star on GitHub](https://github.com/kalpm1110/qrly) • [🐛 Report Bug](https://github.com/kalpm1110/qrly/issues) • [💡 Request Feature](https://github.com/kalpm1110/qrly/issues)

</div>