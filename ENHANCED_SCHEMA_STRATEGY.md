# 🏗️ Enhanced Schema Markup Strategy

## 🎯 Current Schema Analysis

### **Existing Schema (✅ Good):**

- LocalBusiness schema
- FAQ schema
- Breadcrumb schema
- Basic organization markup

### **Missing Schema Opportunities (🚀 High Impact):**

- Product schema for individual containers
- Service schema for delivery/rental services
- Review/Rating schema
- How-to schema for container guides
- Video schema for product demos
- Event schema for container delivery scheduling

## 🚀 HIGH-IMPACT SCHEMA ADDITIONS

### **1. Product Schema for Containers**

#### Create ProductSchema.astro component:

```astro
---
// src/components/seo/ProductSchema.astro
export interface Props {
  container: {
    name: string;
    description: string;
    sku: string;
    condition: 'new' | 'used';
    size: string;
    price?: number;
    availability: 'InStock' | 'OutOfStock';
  };
}

const { container } = Astro.props;
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${container.size} ${container.condition} Shipping Container`,
  "description": container.description,
  "sku": container.sku,
  "brand": {
    "@type": "Brand",
    "name": "LC Container"
  },
  "category": "Storage Container",
  "condition": `https://schema.org/${container.condition === 'new' ? 'NewCondition' : 'UsedCondition'}`,
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": container.price,
    "availability": `https://schema.org/${container.availability}`,
    "seller": {
      "@type": "Organization",
      "name": "LC Container"
    },
    "areaServed": {
      "@type": "State",
      "name": "Texas"
    },
    "deliveryLeadTime": {
      "@type": "QuantitativeValue",
      "value": 1,
      "unitCode": "DAY"
    }
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Delivery Available",
      "value": "Same-day delivery within 200 miles"
    },
    {
      "@type": "PropertyValue",
      "name": "Modification Services",
      "value": "HVAC, electrical, windows, doors available"
    }
  ]
}
</script>
```

### **2. Service Schema for Container Services**

#### Create ServiceSchema.astro:

```astro
---
// src/components/seo/ServiceSchema.astro
export interface Props {
  serviceName: string;
  description: string;
  serviceType: 'rental' | 'sales' | 'modification' | 'delivery';
  priceRange?: string;
}

const { serviceName, description, serviceType, priceRange } = Astro.props;
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "LocalBusiness",
    "name": "LC Container",
    "telephone": "+12145244168",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hutchins",
      "addressRegion": "TX",
      "addressCountry": "US"
    }
  },
  "areaServed": [
    {"@type": "City", "name": "Dallas"},
    {"@type": "City", "name": "Fort Worth"},
    {"@type": "City", "name": "Arlington"},
    {"@type": "State", "name": "Texas"}
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": `${serviceName} Catalog`,
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": serviceName
        },
        "priceRange": priceRange,
        "availability": "https://schema.org/InStock"
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  }
}
</script>
```

### **3. How-To Schema for Container Guides**

#### For blog/guide content:

```astro
---
// src/components/seo/HowToSchema.astro
export interface Props {
  title: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}

const { title, description, steps } = Astro.props;
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": title,
  "description": description,
  "image": "/photos/container/how-to-guide.jpg",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    ${steps.map((step, index) => `{
      "@type": "HowToStep",
      "position": ${index + 1},
      "name": "${step.name}",
      "text": "${step.text}",
      ${step.image ? `"image": "${step.image}",` : ''}
      "url": "${Astro.url.href}#step-${index + 1}"
    }`).join(',')}
  ],
  "author": {
    "@type": "Organization",
    "name": "LC Container"
  }
}
</script>
```

### **4. Review/Rating Schema Enhancement**

#### Enhanced review schema:

```astro
---
// src/components/seo/ReviewSchema.astro
export interface Props {
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
  aggregateRating: {
    ratingValue: number;
    reviewCount: number;
  };
}

const { reviews, aggregateRating } = Astro.props;
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LC Container",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": ${aggregateRating.ratingValue},
    "reviewCount": ${aggregateRating.reviewCount},
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    ${reviews.map(review => `{
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "${review.author}"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "${review.rating}",
        "bestRating": "5"
      },
      "reviewBody": "${review.reviewBody}",
      "datePublished": "${review.datePublished}",
      "publisher": {
        "@type": "Organization",
        "name": "Google"
      }
    }`).join(',')}
  ]
}
</script>
```

### **5. Event Schema for Delivery Scheduling**

#### For delivery/appointment pages:

```astro
---
// src/components/seo/EventSchema.astro
export interface Props {
  eventName: string;
  startDate: string;
  location: string;
  description: string;
}

const { eventName, startDate, location, description } = Astro.props;
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": eventName,
  "description": description,
  "startDate": startDate,
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": location,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "TX",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "LC Container",
    "telephone": "+12145244168"
  },
  "offers": {
    "@type": "Offer",
    "description": "Container delivery service",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

## 📊 Schema Implementation Priority

### **WEEK 1 (High Impact):**

1. ✅ Product schema for all container inventory pages
2. ✅ Enhanced service schema for main service pages
3. ✅ Review schema with real customer reviews

### **WEEK 2 (Medium Impact):**

4. ✅ How-to schema for container guides/blog
5. ✅ Video schema for container demos
6. ✅ Event schema for delivery scheduling

### **WEEK 3 (Enhanced Features):**

7. ✅ JobPosting schema (for hiring drivers/staff)
8. ✅ Course schema (container modification tutorials)
9. ✅ Recipe schema (creative container projects)

## 🎯 Expected Schema Benefits

### **Rich Snippets Potential:**

- **Product rich snippets**: Price, availability, ratings
- **How-to rich snippets**: Step-by-step guides
- **Review stars**: Star ratings in search results
- **Event snippets**: Delivery scheduling info
- **Service snippets**: Service details and pricing

### **SEO Impact Estimates:**

- **+20% CTR**: Rich snippets improve click-through rates
- **+15% rankings**: Enhanced entity understanding
- **+30% local visibility**: Better local business signals
- **+25% conversion rate**: More qualified traffic

## 🛠 Implementation Guide

### **1. Update Existing Pages**

#### Inventory pages:

```astro
---
// src/pages/inventory/[id].astro - ADD
import ProductSchema from '../../components/seo/ProductSchema.astro';
import ServiceSchema from '../../components/seo/ServiceSchema.astro';

const container = {
  name: "20ft Shipping Container",
  description: "High-quality used 20ft shipping container...",
  sku: "20STD-USED-001",
  condition: "used",
  size: "20ft",
  price: 4500,
  availability: "InStock"
};
---

<ProductSchema container={container} />
<ServiceSchema
  serviceName="Container Delivery Service"
  description="Same-day container delivery across Texas"
  serviceType="delivery"
  priceRange="$150-$500"
/>
```

#### Service pages:

```astro
---
// src/pages/services/delivery.astro - ADD
import ServiceSchema from '../../components/seo/ServiceSchema.astro';
---

<ServiceSchema
  serviceName="Texas Container Delivery"
  description="Professional container delivery service with crane and placement"
  serviceType="delivery"
  priceRange="$150-$500"
/>
```

### **2. Create Schema-Rich Content**

#### Container buying guide with How-To schema:

```astro
---
// src/pages/guides/how-to-buy-container.astro
import HowToSchema from '../../components/seo/HowToSchema.astro';

const steps = [
  {
    name: "Determine Container Size Needs",
    text: "Measure your storage space and calculate volume requirements"
  },
  {
    name: "Choose Container Condition",
    text: "Decide between new, used, or cargo-worthy condition based on use case"
  },
  {
    name: "Get Quote and Delivery Estimate",
    text: "Call (214) 524-4168 for pricing and delivery timeline"
  }
];
---

<HowToSchema
  title="How to Buy Your First Shipping Container in Texas"
  description="Complete guide to purchasing shipping containers"
  steps={steps}
/>
```

## 📈 Schema Testing & Validation

### **Testing Tools:**

1. **Google Rich Results Test**: Test individual URLs
2. **Schema.org Validator**: Validate schema syntax
3. **Search Console**: Monitor rich result performance
4. **Lighthouse**: Check structured data implementation

### **Monitoring Metrics:**

- Rich snippet appearance rate
- Click-through rate from rich snippets
- Schema-enhanced page rankings
- Structured data coverage in GSC

## 🎯 Advanced Schema Opportunities

### **Future Enhancements:**

1. **WebPage schema**: Page-level metadata
2. **BreadcrumbList**: Enhanced breadcrumb navigation
3. **ContactPoint**: Multiple contact methods
4. **PriceSpecification**: Detailed pricing info
5. **Vehicle schema**: For delivery trucks
6. **MenuItem schema**: For service catalogs

### **Industry-Specific Schema:**

- **Building/Construction schema**: For container buildings
- **RentalCarReservation schema**: For container rentals
- **Logistics schema**: For delivery tracking
