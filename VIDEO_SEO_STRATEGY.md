# 🎥 Video SEO Strategy for LC Container

## 🎯 Video Content Opportunities

### **High-Impact Video Ideas:**

#### **1. Product Demo Videos (High Priority)**

- **Container Walkthrough Series**: Interior/exterior tours of each container type
- **Size Comparison Videos**: 20ft vs 40ft vs high cube visual comparisons
- **Condition Comparison**: New vs used vs cargo-worthy containers
- **Modification Before/After**: Time-lapse of container transformations

#### **2. Service Process Videos (Medium Priority)**

- **Delivery Process**: Crane delivery and container placement
- **Site Preparation**: What customers need to prepare for delivery
- **Modification Process**: HVAC, electrical, window installation time-lapses
- **Custom Build Process**: Container office/home construction

#### **3. Educational Content (Long-term Strategy)**

- **Container 101**: Beginner's guide to shipping containers
- **Sizing Guide**: How to choose the right container size
- **Use Case Examples**: Containers as offices, storage, homes, workshops
- **Maintenance Tips**: How to care for your container

## 🏗️ VIDEO SEO IMPLEMENTATION

### **1. Video Schema Markup**

#### Create VideoSchema.astro component:

```astro
---
// src/components/seo/VideoSchema.astro
export interface Props {
  video: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string; // ISO 8601 format (PT1M30S = 1 min 30 sec)
    contentUrl?: string;
    embedUrl?: string;
    transcript?: string;
  };
  breadcrumb?: Array<{name: string, url: string}>;
}

const { video, breadcrumb } = Astro.props;
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "{video.name}",
  "description": "{video.description}",
  "thumbnailUrl": ["{video.thumbnailUrl}"],
  "uploadDate": "{video.uploadDate}",
  "duration": "{video.duration}",
  "contentUrl": "{video.contentUrl}",
  "embedUrl": "{video.embedUrl}",
  "publisher": {
    "@type": "Organization",
    "name": "LC Container",
    "logo": {
      "@type": "ImageObject",
      "url": "https://lccontainer.com/photos/lccontainer-dark.png"
    }
  },
  "author": {
    "@type": "Organization",
    "name": "LC Container"
  },
  "transcript": "{video.transcript}",
  "inLanguage": "en-US",
  "regionsAllowed": ["US"],
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/WatchAction",
    "userInteractionCount": 0
  }
}
</script>
```

### **2. Video Landing Pages**

#### Create dedicated video pages:

```astro
---
// src/pages/videos/20ft-container-tour.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import VideoSchema from '../../components/seo/VideoSchema.astro';

const video = {
  name: "20ft Shipping Container Complete Tour - LC Container Texas",
  description: "Take a complete interior and exterior tour of our 20ft shipping containers. See condition, dimensions, and modification potential. Available for sale and rental in Dallas, Fort Worth, and throughout Texas.",
  thumbnailUrl: "https://lccontainer.com/photos/videos/20ft-tour-thumb.jpg",
  uploadDate: "2025-10-21T00:00:00Z",
  duration: "PT3M45S",
  contentUrl: "https://lccontainer.com/videos/20ft-container-tour.mp4",
  embedUrl: "https://youtube.com/embed/20ft-tour-video",
  transcript: "Welcome to LC Container. Today we're taking a complete tour of our 20-foot shipping containers..."
};

const title = "20ft Container Tour | See Inside Before You Buy | LC Container Texas";
const description = "Watch our complete 20ft container tour video. See interior space, door mechanisms, and condition details. Call (214) 524-4168 for pricing and delivery.";
---

<BaseLayout title={title} description={description}>
  <VideoSchema video={video} />

  <main class="video-page">
    <div class="video-hero">
      <h1>20ft Shipping Container Complete Tour</h1>
      <p>See exactly what you're getting with our detailed container walkthrough</p>
    </div>

    <div class="video-container">
      <iframe
        src="https://youtube.com/embed/20ft-tour-video"
        title="20ft Container Tour"
        frameborder="0"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>

    <div class="video-content">
      <h2>What You'll See in This Video</h2>
      <ul>
        <li>✅ Complete exterior inspection</li>
        <li>✅ Interior dimensions and layout</li>
        <li>✅ Door mechanisms and locking system</li>
        <li>✅ Flooring and wall condition</li>
        <li>✅ Modification potential points</li>
        <li>✅ Available container grades</li>
      </ul>

      <div class="cta-section">
        <h3>Ready to Order Your 20ft Container?</h3>
        <p>Call (214) 524-4168 for pricing and same-day delivery throughout Texas</p>
        <a href="/contact" class="cta-button">Get Quote Now</a>
      </div>

      <div class="related-videos">
        <h3>Related Container Videos</h3>
        <div class="video-grid">
          <a href="/videos/40ft-container-tour">40ft Container Tour</a>
          <a href="/videos/container-delivery-process">Delivery Process</a>
          <a href="/videos/container-modifications">Modification Options</a>
        </div>
      </div>
    </div>
  </main>
</BaseLayout>
```

### **3. Video Sitemap Integration**

#### Add video sitemap generation:

```typescript
// src/pages/video-sitemap.xml.ts
export const GET: APIRoute = async ({ site }) => {
  const videos = [
    {
      title: "20ft Container Tour",
      description: "Complete walkthrough of 20ft shipping container",
      contentLoc: "https://lccontainer.com/videos/20ft-container-tour.mp4",
      playerLoc: "https://lccontainer.com/videos/20ft-container-tour",
      thumbnailLoc: "https://lccontainer.com/photos/videos/20ft-tour-thumb.jpg",
      duration: 225, // seconds
      publicationDate: "2025-10-21T00:00:00Z",
    },
    // Add more videos...
  ];

  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos
  .map(
    (video) => `
  <url>
    <loc>${site}${video.playerLoc}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumbnailLoc}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:content_loc>${video.contentLoc}</video:content_loc>
      <video:duration>${video.duration}</video:duration>
      <video:publication_date>${video.publicationDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>
`
  )
  .join("")}
</urlset>`;

  return new Response(videoSitemap, {
    headers: { "Content-Type": "application/xml" },
  });
};
```

## 📱 YOUTUBE CHANNEL STRATEGY

### **Channel Optimization:**

#### **Channel Setup:**

```
Channel Name: LC Container Texas
Handle: @LCContainerTexas
Description: "Texas' premier shipping container supplier. New & used containers, custom modifications, same-day delivery. Serving Dallas, Fort Worth & all of Texas since 2003."

Keywords: shipping containers Texas, container sales Dallas, container modifications, storage containers Fort Worth

Playlists:
- Container Tours & Reviews
- Delivery & Installation Process
- Modification Projects
- Customer Success Stories
- Container Education
```

#### **Video SEO Optimization:**

```
Title Format: "[Container Type] [Action] | [Location] | LC Container Texas"
Examples:
- "20ft Container Complete Tour | Dallas Texas | LC Container"
- "Container Delivery Process | Same Day Service | LC Container Texas"
- "Office Container Modification | HVAC Install | LC Container"

Description Template:
"[Detailed description with keywords]

🏗️ Container Services:
- New & Used Container Sales
- Container Modifications
- Same-Day Delivery
- Custom Container Builds

📞 Call (214) 524-4168 for pricing
🌐 Visit: https://lccontainer.com
📍 Serving Dallas, Fort Worth & All Texas

#ShippingContainers #ContainerSales #Dallas #Texas #Storage"

Tags: shipping containers, container sales, Dallas containers, Texas storage, container modifications, LC Container
```

## 🎯 VIDEO CONTENT CALENDAR

### **Month 1: Foundation Videos**

- Week 1: 20ft Container Complete Tour
- Week 2: 40ft Container Complete Tour
- Week 3: Container Delivery Process
- Week 4: Size Comparison Guide

### **Month 2: Service Showcase**

- Week 1: HVAC Installation Process
- Week 2: Window & Door Installation
- Week 3: Container Office Conversion
- Week 4: Container Storage Solutions

### **Month 3: Customer Stories**

- Week 1: Home Office Container Project
- Week 2: Restaurant Container Build
- Week 3: Farm Storage Solution
- Week 4: Workshop Container Setup

## 📊 VIDEO SEO METRICS

### **YouTube Analytics to Track:**

- Views and watch time
- Click-through rate from thumbnails
- Audience retention rates
- Traffic to website from videos
- Subscriber growth
- Comment engagement

### **Website Video Metrics:**

- Video page organic traffic
- Time spent on video pages
- Conversion rate from video viewers
- Video-to-lead conversion rate

## 🛠 TECHNICAL IMPLEMENTATION

### **1. Video Page Template**

#### Create reusable video page component:

```astro
---
// src/components/VideoPage.astro
export interface Props {
  video: {
    title: string;
    description: string;
    embedUrl: string;
    duration: string;
    transcript?: string;
  };
  relatedVideos?: Array<{title: string, url: string}>;
  ctaText?: string;
}

const { video, relatedVideos = [], ctaText = "Get Your Container Quote" } = Astro.props;
---

<div class="video-page-layout">
  <header class="video-header">
    <h1>{video.title}</h1>
    <p>{video.description}</p>
  </header>

  <div class="video-player">
    <iframe
      src={video.embedUrl}
      title={video.title}
      frameborder="0"
      allowfullscreen
      loading="lazy"
      width="100%"
      height="400"
    ></iframe>
  </div>

  {video.transcript && (
    <details class="video-transcript">
      <summary>Video Transcript</summary>
      <p>{video.transcript}</p>
    </details>
  )}

  <div class="video-cta">
    <h3>Ready to Get Started?</h3>
    <p>Call (214) 524-4168 for pricing and delivery information</p>
    <a href="/contact" class="cta-button">{ctaText}</a>
  </div>

  {relatedVideos.length > 0 && (
    <section class="related-videos">
      <h3>Related Videos</h3>
      <div class="video-grid">
        {relatedVideos.map(v => (
          <a href={v.url} class="video-card">{v.title}</a>
        ))}
      </div>
    </section>
  )}
</div>
```

### **2. Video Lazy Loading**

#### Optimize video loading performance:

```astro
<script>
  // Intersection Observer for video lazy loading
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.dataset.src;
        videoObserver.unobserve(iframe);
      }
    });
  });

  document.querySelectorAll('iframe[data-src]').forEach(iframe => {
    videoObserver.observe(iframe);
  });
</script>
```

## 📈 EXPECTED VIDEO SEO IMPACT

### **30 Days:**

- +15% brand search volume
- +25% time on site for video pages
- +20% engagement on container product pages

### **90 Days:**

- +40% video snippet appearances in search
- +30% organic traffic from video keywords
- +50% lead quality improvement

### **180 Days:**

- Establish video authority in container industry
- +100% YouTube subscriber base
- +60% overall brand awareness in Texas market

## 🎬 PRODUCTION RECOMMENDATIONS

### **Equipment & Setup:**

- High-quality smartphone or DSLR camera
- Tripod for stable shots
- External microphone for clear audio
- Good lighting (outdoor natural light preferred)
- Branded intro/outro graphics

### **Content Quality Standards:**

- 4K resolution when possible
- Clear, professional audio
- Consistent branding and graphics
- Engaging thumbnail designs
- Comprehensive descriptions with keywords
- Call-to-action in every video

This video SEO strategy will significantly boost your search presence and provide valuable content that converts viewers into customers.
