# LC Container - Modern Lead Magnet Website

A modern, SEO-optimized lead magnet website for LC Container, Texas' premier shipping container supplier since 2003. Built with Astro for maximum performance and SEO benefits.

## 🚀 Features

- **Modern Design**: Clean, professional design with glassmorphism effects
- **SEO Optimized**: Comprehensive meta tags, structured data, and sitemap
- **Lead Generation**: Dedicated lead magnet page with form capture
- **Mobile Responsive**: Fully responsive design for all devices
- **Fast Performance**: Static site generation with Astro
- **Accessibility**: WCAG compliant design and navigation

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Language**: TypeScript
- **Deployment**: Static hosting ready

## 📁 Project Structure

```
lccontainer/
├── public/                 # Static assets
│   ├── photos/            # Container and logo images
│   ├── robots.txt         # Search engine crawling
│   └── favicon.ico        # Site favicon
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.astro   # Navigation header
│   │   ├── Hero.astro     # Homepage hero section
│   │   ├── Services.astro # Services showcase
│   │   ├── Footer.astro   # Site footer
│   │   └── ...
│   ├── layouts/           # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/             # Site pages
│   │   ├── index.astro    # Homepage
│   │   ├── about.astro    # About page
│   │   ├── services.astro # Services page
│   │   ├── contact.astro  # Contact page
│   │   ├── lead-magnet.astro # Lead capture page
│   │   ├── 404.astro      # Error page
│   │   └── sitemap.xml.ts # SEO sitemap
│   └── ...
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lccontainer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

### Build for Production

```bash
npm run build
```

The built site will be in the `dist/` directory, ready for deployment.

## 📄 Pages

### Homepage (`/`)
- Hero section with lead magnet form
- Trust badges and statistics
- Container gallery
- Services overview
- Customer testimonials

### About (`/about`)
- Company story and history
- Team information
- Why choose LC Container
- Call-to-action sections

### Services (`/services`)
- Detailed service offerings
- Container types and specifications
- Custom build options
- Leasing information

### Contact (`/contact`)
- Contact form
- Business information
- Location and hours
- Phone and email

### Lead Magnet (`/lead-magnet`)
- Free Container Buyer's Guide
- Lead capture form
- Value proposition
- Customer testimonials
- FAQ section

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9) - Brand color
- **Secondary**: Gray (#64748b) - Text and accents
- **Background**: White and light grays

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Glassmorphism cards with backdrop blur
- Gradient backgrounds
- Hover animations
- Responsive grid layouts

## 🔍 SEO Features

- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Structured Data**: LocalBusiness schema markup
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling instructions
- **Canonical URLs**: Prevent duplicate content
- **Image Optimization**: Lazy loading and alt tags

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly navigation
- Optimized images for all screen sizes

## 🚀 Performance

- Static site generation
- Optimized images with lazy loading
- Minimal JavaScript
- Fast loading times
- Lighthouse score optimized

## 📧 Lead Generation

- Dedicated lead magnet page
- Form validation
- Email capture
- Phone number collection
- Container interest tracking

## 🔧 Configuration

### Astro Config (`astro.config.mjs`)
- Tailwind CSS integration
- Image optimization
- Site URL configuration
- Build optimizations

### Tailwind Config (`tailwind.config.mjs`)
- Custom color palette
- Font family configuration
- Animation definitions
- Content paths

## 📊 Analytics Ready

The site is prepared for:
- Google Analytics
- Google Tag Manager
- Facebook Pixel
- Custom event tracking

## 🚀 Deployment

### Static Hosting
The site can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Enable GitHub Actions
- **AWS S3**: Upload to S3 bucket

### Environment Variables
Create a `.env` file for production:
```env
PUBLIC_SITE_URL=https://lccontainer.com
```

## 📞 Support

For questions or support:
- **Phone**: (214) 524-4168
- **Email**: info@lccontainer.com
- **Address**: 1211 E Fulghum Rd, Hutchins, TX 75141

## 📄 License

This project is proprietary to LC Container.

---

**Built with ❤️ for LC Container - Texas' Premier Container Supplier Since 2003**
