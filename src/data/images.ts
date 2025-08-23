export interface ContainerImage {
  src: string;
  alt: string;
  title?: string;
  category: string;
  description?: string;
}

export const customModifications: ContainerImage[] = [
  {
    src: '/photos/container/custom/custom-modification-2.jpg',
    alt: 'Custom container modification with interior finishing',
    title: 'Interior Finishing',
    category: 'Custom Modification',
    description: 'Professional interior finishing for office spaces'
  },
  {
    src: '/photos/container/custom/custom-modification-3.jpg',
    alt: 'Custom container with electrical and plumbing installation',
    title: 'Electrical & Plumbing',
    category: 'Custom Modification',
    description: 'Complete electrical and plumbing systems'
  },
  {
    src: '/photos/container/custom/custom-modification-4.jpg',
    alt: 'Custom container office with windows and doors',
    title: 'Windows & Doors',
    category: 'Custom Modification',
    description: 'Custom window and door installations'
  },
  {
    src: '/photos/container/custom/custom-modification-5.jpg',
    alt: 'Custom container with HVAC system installation',
    title: 'HVAC Systems',
    category: 'Custom Modification',
    description: 'Climate control and ventilation systems'
  },
  {
    src: '/photos/container/custom/custom-modification-6.jpg',
    alt: 'Custom container with insulation and wall finishing',
    title: 'Insulation & Walls',
    category: 'Custom Modification',
    description: 'Professional insulation and wall systems'
  },
  {
    src: '/photos/container/custom/custom-modification-7.jpg',
    alt: 'Custom container with flooring installation',
    title: 'Flooring Systems',
    category: 'Custom Modification',
    description: 'Durable flooring solutions for any use'
  },
  {
    src: '/photos/container/custom/custom-modification-8.jpg',
    alt: 'Custom container with lighting installation',
    title: 'Lighting Systems',
    category: 'Custom Modification',
    description: 'Professional lighting design and installation'
  },
  {
    src: '/photos/container/custom/custom-modification-10.jpg',
    alt: 'Custom container with bathroom facilities',
    title: 'Bathroom Facilities',
    category: 'Custom Modification',
    description: 'Complete bathroom and plumbing systems'
  },
  {
    src: '/photos/container/custom/custom-modification-11.jpg',
    alt: 'Custom container with kitchen facilities',
    title: 'Kitchen Facilities',
    category: 'Custom Modification',
    description: 'Full kitchen installations and equipment'
  },
  {
    src: '/photos/container/custom/custom-modification-15.jpg',
    alt: 'Custom container with security features',
    title: 'Security Features',
    category: 'Custom Modification',
    description: 'Advanced security and access control systems'
  },
  {
    src: '/photos/container/custom/custom-modification-16.jpg',
    alt: 'Custom container with specialized equipment',
    title: 'Specialized Equipment',
    category: 'Custom Modification',
    description: 'Custom equipment and machinery installations'
  }
];

export const standardContainers: ContainerImage[] = [
  {
    src: '/photos/container/standard/20ft_1.jpg',
    alt: '20-foot shipping container in excellent condition',
    title: '20ft Standard Container',
    category: 'Standard Container',
    description: 'High-quality 20-foot containers for storage and transport'
  },
  {
    src: '/photos/container/standard/20ft_2.jpg',
    alt: '20-foot shipping container with clean exterior',
    title: '20ft Clean Container',
    category: 'Standard Container',
    description: 'Clean and well-maintained 20-foot containers'
  },
  {
    src: '/photos/container/standard/20ft_3.jpg',
    alt: '20-foot shipping container ready for delivery',
    title: '20ft Delivery Ready',
    category: 'Standard Container',
    description: 'Ready for immediate delivery and use'
  },
  {
    src: '/photos/container/standard/20ft_4.jpg',
    alt: '20-foot shipping container with secure locking',
    title: '20ft Secure Container',
    category: 'Standard Container',
    description: 'Secure locking mechanisms for safe storage'
  },
  {
    src: '/photos/container/standard/20ft_5.jpg',
    alt: '20-foot shipping container with weather protection',
    title: '20ft Weather Protected',
    category: 'Standard Container',
    description: 'Weather-resistant containers for outdoor use'
  },
  {
    src: '/photos/container/standard/20ft_6.jpg',
    alt: '20-foot shipping container with ventilation',
    title: '20ft Ventilated Container',
    category: 'Standard Container',
    description: 'Ventilated containers for proper air circulation'
  },
  {
    src: '/photos/container/standard/20ft_7.jpg',
    alt: '20-foot shipping container with reinforced structure',
    title: '20ft Reinforced Container',
    category: 'Standard Container',
    description: 'Reinforced structure for heavy-duty applications'
  },
  {
    src: '/photos/container/standard/20ft_8.jpg',
    alt: '20-foot shipping container with easy access',
    title: '20ft Easy Access Container',
    category: 'Standard Container',
    description: 'Easy access design for convenient loading'
  },
  {
    src: '/photos/container/standard/40ft_1.jpg',
    alt: '40-foot shipping container for large storage needs',
    title: '40ft Large Container',
    category: 'Standard Container',
    description: 'Spacious 40-foot containers for large storage needs'
  },
  {
    src: '/photos/container/standard/40ft_2.jpg',
    alt: '40-foot shipping container with double doors',
    title: '40ft Double Door Container',
    category: 'Standard Container',
    description: 'Double door access for easy loading and unloading'
  }
];

export const yardAndStorage: ContainerImage[] = [
  {
    src: '/photos/container/standard/yard-overview.jpg',
    alt: 'Container yard overview showing inventory',
    title: 'Yard Overview',
    category: 'Facility',
    description: 'Our extensive container yard with full inventory'
  },
  {
    src: '/photos/container/standard/yard-storage.jpg',
    alt: 'Container storage area with organized layout',
    title: 'Storage Area',
    category: 'Facility',
    description: 'Organized storage area for easy access'
  },
  {
    src: '/photos/container/standard/yard-inventory.jpg',
    alt: 'Container inventory showing available stock',
    title: 'Inventory Management',
    category: 'Facility',
    description: 'Comprehensive inventory management system'
  },
  {
    src: '/photos/container/standard/container-yard-overview.jpg',
    alt: 'Container yard with various container types',
    title: 'Container Variety',
    category: 'Facility',
    description: 'Wide variety of container types and sizes'
  },
  {
    src: '/photos/container/standard/container-storage-area.jpg',
    alt: 'Container storage area with security',
    title: 'Secure Storage',
    category: 'Facility',
    description: 'Secure storage area with 24/7 monitoring'
  },
  {
    src: '/photos/container/standard/container-yard-inventory.jpg',
    alt: 'Container yard inventory management',
    title: 'Inventory Control',
    category: 'Facility',
    description: 'Professional inventory control and tracking'
  }
];

// Featured images for different sections
export const featuredCustomImages = customModifications.slice(0, 6);
export const featuredStandardImages = standardContainers.slice(0, 6);
export const featuredYardImages = yardAndStorage.slice(0, 3);

// Hero images
export const heroImages = [
  customModifications[0],
  standardContainers[0],
  yardAndStorage[0]
];

// All images combined
export const allImages = [
  ...customModifications,
  ...standardContainers,
  ...yardAndStorage
];
