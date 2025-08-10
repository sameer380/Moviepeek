const Robots = () => {
  return null;
};

export async function getServerSideProps({ req, res }) {
  const host = req?.headers?.host || 'localhost:3000';
  const baseUrl = `https://${host}`;
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /movie/
Allow: /genre/
Allow: /search/
Allow: /person/
Allow: /list/
Allow: /watch-*
Allow: /download-*
Allow: /stream-*
Allow: /free-*
Allow: /hd-*
Allow: /latest-*
Allow: /new-*
Allow: /movie-trailers

# Specific movie and trailer pages
Allow: /watch-*-*
Allow: /download-*-*
Allow: /stream-*-*
Allow: /genre?*

# Crawl delay for better server performance
Crawl-delay: 1

# Additional directives for better SEO
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: Screaming Frog SEO Spider
Disallow: /

User-agent: rogerbot
Disallow: /

User-agent: Exabot
Disallow: /

User-agent: ia_archiver
Disallow: /

User-agent: archive.org_bot
Disallow: /

User-agent: 360Spider
Disallow: /

User-agent: Sogou
Disallow: /

User-agent: YoudaoBot
Disallow: /

User-agent: JikeSpider
Disallow: /

User-agent: Sosospider
Disallow: /

User-agent: EasouSpider
Disallow: /

User-agent: YisouSpider
Disallow: /

User-agent: Sogou web spider
Disallow: /

User-agent: Sogou inst spider
Disallow: /

User-agent: Sogou spider2
Disallow: /

User-agent: Sogou blog
Disallow: /

User-agent: Sogou News Spider
Disallow: /

User-agent: Sogou Orion spider
Disallow: /

User-agent: ChinasoSpider
Disallow: /

User-agent: Baiduspider-image
Disallow: /

User-agent: Baiduspider-video
Disallow: /

User-agent: Baiduspider-news
Disallow: /

User-agent: Baiduspider-favo
Disallow: /

User-agent: Baiduspider-cpro
Disallow: /

User-agent: Baiduspider-ads
Disallow: /

User-agent: YandexBot
Disallow: /

User-agent: YandexMobileBot
Disallow: /

User-agent: YandexDirect
Disallow: /

User-agent: YandexMetrika
Disallow: /

User-agent: YandexImages
Disallow: /

User-agent: YandexVideo
Disallow: /

User-agent: YandexMedia
Disallow: /

User-agent: YandexBlogs
Disallow: /

User-agent: YandexFavicons
Disallow: /

User-agent: YandexWebmaster
Disallow: /

User-agent: YandexPagechecker
Disallow: /

User-agent: YandexImageResizer
Disallow: /

User-agent: YandexScreenshotBot
Disallow: /

User-agent: YandexSearchShop
Disallow: /

User-agent: YandexCalenda
Disallow: /

User-agent: YandexSitelinks
Disallow: /

User-agent: YandexMarket
Disallow: /

User-agent: YandexVertis
Disallow: /

User-agent: YandexBot
Disallow: /

User-agent: YandexMobileBot
Disallow: /

User-agent: YandexDirect
Disallow: /

User-agent: YandexMetrika
Disallow: /

User-agent: YandexImages
Disallow: /

User-agent: YandexVideo
Disallow: /

User-agent: YandexMedia
Disallow: /

User-agent: YandexBlogs
Disallow: /

User-agent: YandexFavicons
Disallow: /

User-agent: YandexWebmaster
Disallow: /

User-agent: YandexPagechecker
Disallow: /

User-agent: YandexImageResizer
Disallow: /

User-agent: YandexScreenshotBot
Disallow: /

User-agent: YandexSearchShop
Disallow: /

User-agent: YandexCalenda
Disallow: /

User-agent: YandexSitelinks
Disallow: /

User-agent: YandexMarket
Disallow: /

User-agent: YandexVertis
Disallow: /`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate',
  );
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default Robots;
