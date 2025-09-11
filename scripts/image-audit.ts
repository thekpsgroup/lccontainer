/**
 * LC Container Image Audit Script
 * Analyzes image usage and provides optimization recommendations
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { getContrastRatio } from '../src/lib/contrast';

interface ImageInfo {
  path: string;
  filename: string;
  size: number;
  extension: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  estimatedSavings: number;
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

interface AuditResult {
  totalImages: number;
  totalSize: number;
  potentialSavings: number;
  imagesByPriority: Record<string, ImageInfo[]>;
  formatDistribution: Record<string, number>;
  optimizationOpportunities: ImageInfo[];
}

class ImageAuditor {
  private publicDir = join(process.cwd(), 'public');
  private images: ImageInfo[] = [];
  private auditResults: AuditResult = {
    totalImages: 0,
    totalSize: 0,
    potentialSavings: 0,
    imagesByPriority: { high: [], medium: [], low: [] },
    formatDistribution: {},
    optimizationOpportunities: []
  };

  async audit(): Promise<AuditResult> {
    console.log('🔍 Starting image audit...');

    // Scan for images in public directory
    this.scanImages();

    // Analyze each image
    await this.analyzeImages();

    // Categorize by priority
    this.categorizeImages();

    // Generate recommendations
    this.generateRecommendations();

    return this.auditResults;
  }

  private scanImages(): void {
    const scanDirectory = (dir: string): void => {
      try {
        const files = readdirSync(dir);

        for (const file of files) {
          const fullPath = join(dir, file);
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            // Skip node_modules and other non-public directories
            if (!file.startsWith('.') && file !== 'node_modules') {
              scanDirectory(fullPath);
            }
          } else if (this.isImageFile(file)) {
            const relativePath = fullPath.replace(this.publicDir, '').replace(/\\/g, '/');

            this.images.push({
              path: fullPath,
              filename: file,
              size: stat.size,
              extension: extname(file).toLowerCase(),
              estimatedSavings: 0,
              priority: 'low',
              recommendations: []
            });
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not scan directory ${dir}:`, error.message);
      }
    };

    scanDirectory(this.publicDir);
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    return imageExtensions.includes(extname(filename).toLowerCase());
  }

  private async analyzeImages(): Promise<void> {
    console.log(`📊 Analyzing ${this.images.length} images...`);

    for (const image of this.images) {
      this.auditResults.totalSize += image.size;
      this.auditResults.formatDistribution[image.extension] = (this.auditResults.formatDistribution[image.extension] || 0) + 1;

      // Estimate dimensions from filename if available (e.g., image-1920x1080.jpg)
      const dimensionMatch = image.filename.match(/(\d+)x(\d+)/);
      if (dimensionMatch) {
        image.width = parseInt(dimensionMatch[1]);
        image.height = parseInt(dimensionMatch[2]);
        image.aspectRatio = `${image.width}/${image.height}`;
      }

      // Calculate estimated savings based on format and size
      this.calculateSavings(image);
    }

    this.auditResults.totalImages = this.images.length;
  }

  private calculateSavings(image: ImageInfo): void {
    let estimatedSavings = 0;
    const recommendations: string[] = [];

    // Format optimization
    if (image.extension === '.png' && image.size > 100000) {
      // PNG to WebP/AVIF savings estimate
      estimatedSavings += image.size * 0.3;
      recommendations.push('Convert to WebP/AVIF for better compression');
    } else if (image.extension === '.jpg' && image.size > 200000) {
      estimatedSavings += image.size * 0.2;
      recommendations.push('Optimize JPEG quality/compression');
    }

    // Size optimization
    if (image.size > 500000) {
      estimatedSavings += image.size * 0.4;
      recommendations.push('Consider responsive images with multiple sizes');
    }

    // Dimension optimization
    if (image.width && image.width > 2000) {
      recommendations.push('Image width exceeds typical viewport, consider responsive sizing');
    }

    image.estimatedSavings = estimatedSavings;
    image.recommendations = recommendations;
    this.auditResults.potentialSavings += estimatedSavings;
  }

  private categorizeImages(): void {
    // Priority categorization based on path and usage patterns
    for (const image of this.images) {
      if (image.path.includes('/hero') || image.path.includes('logo') || image.filename.includes('hero')) {
        image.priority = 'high';
        this.auditResults.imagesByPriority.high.push(image);
      } else if (image.path.includes('/container') || image.path.includes('/standard')) {
        image.priority = 'medium';
        this.auditResults.imagesByPriority.medium.push(image);
      } else {
        image.priority = 'low';
        this.auditResults.imagesByPriority.low.push(image);
      }
    }

    // Sort by potential savings (descending)
    this.auditResults.optimizationOpportunities = this.images
      .filter(img => img.estimatedSavings > 0)
      .sort((a, b) => b.estimatedSavings - a.estimatedSavings)
      .slice(0, 20); // Top 20 optimization opportunities
  }

  private generateRecommendations(): void {
    console.log('💡 Generating optimization recommendations...');

    // Add general recommendations
    if (this.auditResults.formatDistribution['.png'] > this.auditResults.formatDistribution['.webp'] || 0) {
      console.log('📈 Consider converting PNG files to WebP/AVIF for better compression');
    }

    if (this.auditResults.totalSize > 10 * 1024 * 1024) { // 10MB
      console.log('⚠️  Total image size exceeds 10MB, consider optimization');
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async generateReport(): Promise<string> {
    const result = await this.audit();

    let report = `
🖼️  LC Container Image Audit Report
${'='.repeat(40)}

📊 OVERVIEW
Total Images: ${result.totalImages}
Total Size: ${this.formatBytes(result.totalSize)}
Potential Savings: ${this.formatBytes(result.potentialSavings)}
Savings Percentage: ${((result.potentialSavings / result.totalSize) * 100).toFixed(1)}%

📈 FORMAT DISTRIBUTION
${Object.entries(result.formatDistribution)
  .map(([format, count]) => `${format}: ${count} files`)
  .join('\n')}

🎯 PRIORITY BREAKDOWN
High Priority (Hero/Logos): ${result.imagesByPriority.high.length} images
Medium Priority (Content): ${result.imagesByPriority.medium.length} images
Low Priority (Other): ${result.imagesByPriority.low.length} images

🚀 TOP 10 OPTIMIZATION OPPORTUNITIES
${result.optimizationOpportunities.slice(0, 10).map((img, index) =>
  `${index + 1}. ${img.filename}\n   Size: ${this.formatBytes(img.size)}\n   Savings: ${this.formatBytes(img.estimatedSavings)}\n   ${img.recommendations.join(', ')}\n`
).join('')}

💡 RECOMMENDATIONS
${result.optimizationOpportunities.length > 0 ?
  '1. Focus on the top optimization opportunities listed above\n2. Implement responsive images with multiple sizes\n3. Convert large PNG files to WebP/AVIF format\n4. Use appropriate compression levels for different image types' :
  '✅ All images appear to be well-optimized!'
}

✨ Audit completed successfully!
`;

    return report;
  }
}

// CLI execution
if (require.main === module) {
  const auditor = new ImageAuditor();

  auditor.generateReport().then(report => {
    console.log(report);

    // Write to CSV file
    const csvContent = [
      'Filename,Path,Size (bytes),Extension,Priority,Estimated Savings (bytes),Recommendations',
      ...auditor['images'].map(img =>
        `"${img.filename}","${img.path.replace(process.cwd(), '')}",${img.size},"${img.extension}","${img.priority}",${img.estimatedSavings},"${img.recommendations.join('; ')}"`
      )
    ].join('\n');

    const fs = require('fs');
    const reportsDir = join(process.cwd(), 'reports');

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(join(reportsDir, 'image-audit-results.csv'), csvContent);
    console.log('📄 CSV report saved to: reports/image-audit-results.csv');

  }).catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
}

export { ImageAuditor, ImageInfo, AuditResult };
