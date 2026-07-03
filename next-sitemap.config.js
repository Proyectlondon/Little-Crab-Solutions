/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://little-crab-solutions.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/api/*', '/_next/*', '/static/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/_next/', '/static/'] },
    ],
    additionalSitemaps: [
      'https://little-crab-solutions.vercel.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq || 'weekly',
      priority: config.priority || 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};