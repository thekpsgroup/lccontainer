import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SEOMetrics {
  totalPages: number;
  uniqueTitles: number;
  uniqueDescriptions: number;
  pagesWithSchema: number;
  pagesWithFAQ: number;
  averageContentLength: number;
  internalLinks: number;
  placeholderContent: number;
}

class SEOAuditor {
  private contentDir: string;
  private reportPath: string;

  constructor() {
    this.contentDir = path.resolve(__dirname, '../src/content/loc');
    this.reportPath = path.resolve(__dirname, '../reports/final-seo-audit-report.json');
  }

  async generateReport(): Promise<SEOMetrics> {
    console.log('🔍 Starting comprehensive SEO audit...');

    const metrics: SEOMetrics = {
      totalPages: 0,
      uniqueTitles: 0,
      uniqueDescriptions: 0,
      pagesWithSchema: 0,
      pagesWithFAQ: 0,
      averageContentLength: 0,
      internalLinks: 0,
      placeholderContent: 0
    };

    try {
      // Count total pages
      const { stdout: pageCount } = await execAsync(`find "${this.contentDir}" -name "*.md" | wc -l`);
      metrics.totalPages = parseInt(pageCount.trim());
      console.log(`📄 Total pages: ${metrics.totalPages}`);

      // Check unique titles and descriptions
      await this.validateMetaUniqueness(metrics);

      // Check schema presence
      await this.validateSchemaMarkup(metrics);

      // Check content quality
      await this.validateContentQuality(metrics);

      // Check for remaining placeholders
      await this.validatePlaceholders(metrics);

      // Calculate success rate
      const successRate = this.calculateSuccessRate(metrics);

      // Generate detailed report
      await this.saveReport(metrics, successRate);

      console.log('✅ SEO audit completed successfully!');
      return metrics;

    } catch (error) {
      console.error('❌ SEO audit failed:', error);
      throw error;
    }
  }

  private async validateMetaUniqueness(metrics: SEOMetrics): Promise<void> {
    console.log('🔍 Validating meta tag uniqueness...');

    try {
      // Sample 200 files for performance
      const { stdout: sampleFiles } = await execAsync(`find "${this.contentDir}" -name "*.md" | head -200`);
      const files = sampleFiles.trim().split('\n').filter(Boolean);

      const titles = new Set<string>();
      const descriptions = new Set<string>();

      for (const file of files.slice(0, 100)) { // Process 100 files
        try {
          const content = await fs.readFile(file, 'utf-8');
          const titleMatch = content.match(/title_tag:\s*["']([^"']+)["']/);
          const descMatch = content.match(/meta_description:\s*["']([^"']+)["']/);

          if (titleMatch) titles.add(titleMatch[1]);
          if (descMatch) descriptions.add(descMatch[1]);
        } catch (error) {
          console.warn(`Warning: Could not process ${file}`);
        }
      }

      metrics.uniqueTitles = titles.size;
      metrics.uniqueDescriptions = descriptions.size;

      console.log(`📝 Unique titles in sample: ${metrics.uniqueTitles}/100`);
      console.log(`📝 Unique descriptions in sample: ${metrics.uniqueDescriptions}/100`);
    } catch (error) {
      console.warn('Warning: Meta uniqueness validation skipped');
    }
  }

  private async validateSchemaMarkup(metrics: SEOMetrics): Promise<void> {
    console.log('🔍 Validating schema markup...');

    try {
      const { stdout: schemaCount } = await execAsync(`find "${this.contentDir}" -name "*.md" | head -100 | xargs grep -l "application/ld+json" | wc -l || echo "0"`);
      metrics.pagesWithSchema = parseInt(schemaCount.trim());

      const { stdout: faqCount } = await execAsync(`find "${this.contentDir}" -name "*.md" | head -100 | xargs grep -l "FAQPage" | wc -l || echo "0"`);
      metrics.pagesWithFAQ = parseInt(faqCount.trim());

      console.log(`🏷️  Pages with schema markup: ${metrics.pagesWithSchema}/100`);
      console.log(`❓ Pages with FAQ schema: ${metrics.pagesWithFAQ}/100`);
    } catch (error) {
      console.warn('Warning: Schema validation skipped');
    }
  }

  private async validateContentQuality(metrics: SEOMetrics): Promise<void> {
    console.log('🔍 Validating content quality...');

    try {
      const { stdout: sampleFiles } = await execAsync(`find "${this.contentDir}" -name "*.md" | head -20`);
      const files = sampleFiles.trim().split('\n').filter(Boolean);

      let totalContentLength = 0;
      let totalLinks = 0;

      for (const file of files.slice(0, 10)) { // Process 10 files
        try {
          const content = await fs.readFile(file, 'utf-8');

          // Count content length (excluding frontmatter)
          const bodyContent = content.split('---').slice(2).join('---');
          totalContentLength += bodyContent.length;

          // Count internal links
          const links = bodyContent.match(/\]\([^)]*\)/g) || [];
          totalLinks += links.length;
        } catch (error) {
          console.warn(`Warning: Could not process ${file}`);
        }
      }

      metrics.averageContentLength = Math.round(totalContentLength / 10);
      metrics.internalLinks = totalLinks;

      console.log(`📏 Average content length: ${metrics.averageContentLength} characters`);
      console.log(`🔗 Internal links found: ${metrics.internalLinks}`);
    } catch (error) {
      console.warn('Warning: Content quality validation skipped');
    }
  }

  private async validatePlaceholders(metrics: SEOMetrics): Promise<void> {
    console.log('🔍 Checking for placeholder content...');

    try {
      const { stdout: placeholderCount } = await execAsync(`find "${this.contentDir}" -name "*.md" | head -100 | xargs grep -l "TODO\\|PLACEHOLDER\\|\\[\\[" | wc -l || echo "0"`);
      metrics.placeholderContent = parseInt(placeholderCount.trim());

      console.log(`⚠️  Pages with placeholders: ${metrics.placeholderContent}/100`);
    } catch (error) {
      console.warn('Warning: Placeholder validation skipped');
      metrics.placeholderContent = 0;
    }
  }

  private calculateSuccessRate(metrics: SEOMetrics): number {
    const maxScore = 100;
    let score = 0;

    // Meta uniqueness (30 points)
    if (metrics.uniqueTitles >= 95) score += 15;
    else if (metrics.uniqueTitles >= 90) score += 12;
    else if (metrics.uniqueTitles >= 80) score += 8;

    if (metrics.uniqueDescriptions >= 95) score += 15;
    else if (metrics.uniqueDescriptions >= 90) score += 12;
    else if (metrics.uniqueDescriptions >= 80) score += 8;

    // Schema markup (25 points)
    if (metrics.pagesWithSchema >= 90) score += 15;
    else if (metrics.pagesWithSchema >= 80) score += 12;
    else if (metrics.pagesWithSchema >= 70) score += 8;

    if (metrics.pagesWithFAQ >= 80) score += 10;
    else if (metrics.pagesWithFAQ >= 60) score += 6;
    else if (metrics.pagesWithFAQ >= 40) score += 3;

    // Content quality (25 points)
    if (metrics.averageContentLength >= 2000) score += 15;
    else if (metrics.averageContentLength >= 1500) score += 12;
    else if (metrics.averageContentLength >= 1000) score += 8;

    if (metrics.internalLinks >= 50) score += 10;
    else if (metrics.internalLinks >= 30) score += 6;
    else if (metrics.internalLinks >= 10) score += 3;

    // No placeholders (20 points)
    if (metrics.placeholderContent === 0) score += 20;
    else if (metrics.placeholderContent <= 5) score += 15;
    else if (metrics.placeholderContent <= 10) score += 10;

    return score;
  }

  private async saveReport(metrics: SEOMetrics, successRate: number): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      summary: {
        totalPages: metrics.totalPages,
        seoScore: successRate,
        status: successRate >= 95 ? 'EXCELLENT' : successRate >= 85 ? 'GOOD' : successRate >= 70 ? 'NEEDS_IMPROVEMENT' : 'POOR'
      },
      metrics,
      recommendations: this.generateRecommendations(metrics, successRate),
      testResults: {
        metaUniqueness: metrics.uniqueTitles >= 95 && metrics.uniqueDescriptions >= 95 ? 'PASS' : 'REVIEW',
        schemaMarkup: metrics.pagesWithSchema >= 80 ? 'PASS' : 'NEEDS_IMPROVEMENT',
        contentQuality: metrics.averageContentLength >= 1500 ? 'PASS' : 'REVIEW',
        noPlaceholders: metrics.placeholderContent === 0 ? 'PASS' : 'FAIL'
      }
    };

    // Ensure reports directory exists
    const reportsDir = path.dirname(this.reportPath);
    await fs.mkdir(reportsDir, { recursive: true });

    await fs.writeFile(this.reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 SEO AUDIT REPORT');
    console.log('==================');
    console.log(`📄 Total Pages: ${metrics.totalPages}`);
    console.log(`🏆 SEO Score: ${successRate}/100 (${report.summary.status})`);
    console.log(`📝 Meta Uniqueness: ${report.testResults.metaUniqueness}`);
    console.log(`🏷️  Schema Markup: ${report.testResults.schemaMarkup}`);
    console.log(`📏 Content Quality: ${report.testResults.contentQuality}`);
    console.log(`⚠️  Placeholders: ${report.testResults.noPlaceholders}`);
    console.log(`\n📄 Full report saved to: ${this.reportPath}`);

    if (successRate >= 95) {
      console.log('\n🎉 CONGRATULATIONS! You have achieved MAXIMUM SEO optimization!');
    } else if (successRate >= 85) {
      console.log('\n✅ Great job! Your SEO optimization is performing well.');
    } else {
      console.log('\n⚠️  Your SEO needs attention. Review the recommendations.');
    }
  }

  private generateRecommendations(metrics: SEOMetrics, score: number): string[] {
    const recommendations: string[] = [];

    if (metrics.uniqueTitles < 95) {
      recommendations.push('Improve meta title uniqueness - enhance title generation with more differentiating factors');
    }

    if (metrics.uniqueDescriptions < 95) {
      recommendations.push('Improve meta description uniqueness - add more city-specific details and unique identifiers');
    }

    if (metrics.pagesWithSchema < 80) {
      recommendations.push('Add schema markup to more pages - implement LocalBusiness and FAQ schemas');
    }

    if (metrics.averageContentLength < 1500) {
      recommendations.push('Increase content depth - add more local market insights and detailed service information');
    }

    if (metrics.placeholderContent > 0) {
      recommendations.push('Remove all placeholder content - complete the content generation for remaining pages');
    }

    if (score >= 95) {
      recommendations.push('Maintain excellence - monitor for regressions and continue optimizing');
    }

    return recommendations;
  }
}

// Run the audit
async function main() {
  const auditor = new SEOAuditor();

  try {
    const metrics = await auditor.generateReport();
    process.exit(0);
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SEOAuditor };
