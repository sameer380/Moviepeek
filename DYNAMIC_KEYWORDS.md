# Dynamic Keyword Generation from TMDB API

## Overview
Instead of hardcoding trending movie keywords, we now dynamically fetch them from TMDB API. This ensures our SEO keywords are always up-to-date with the latest trending movies.

## How It Works

### 1. Dynamic Keyword Fetching
- **Source**: TMDB API (The Movie Database)
- **Region**: India (IN) - ensures Indian audience relevance
- **Endpoints Used**:
  - `/trending/movie/day` - Daily trending movies
  - `/movie/upcoming` - Upcoming releases
  - `/movie/popular` - Popular movies
  - `/movie/now_playing` - Currently playing movies
  - `/discover/movie` - Indian regional movies (Hindi, Tamil, Telugu)

### 2. Keyword Generation Process

#### Step 1: Fetch Trending Data
```javascript
const trendingKeywords = await getTrendingKeywords();
```
- Fetches from 4 TMDB endpoints
- Combines and deduplicates movies
- Sorts by popularity
- Gets top 20 trending movies

#### Step 2: Fetch Indian Movies
```javascript
const indianKeywords = await getIndianMovieKeywords();
```
- Fetches Hindi movies (Bollywood)
- Fetches Tamil movies
- Fetches Telugu movies
- Gets top 10 from each category

#### Step 3: Generate SEO Keywords
```javascript
const { allKeywords } = generateSEOKeywords(trendingKeywords, indianKeywords);
```
- Combines trending movie titles
- Adds upcoming movie titles
- Includes Indian regional movies
- Adds quality keywords (300MB, 480p, 720p, 1080p)
- Adds format keywords (download, watch online, stream)
- Adds language keywords (Hindi, Tamil, Telugu)
- Adds genre keywords (Action, Comedy, Romance, etc.)

### 3. Server-Side Rendering
Keywords are fetched server-side in `getServerSideProps`:
- Ensures keywords are in initial HTML (better for SEO)
- Fresh data on each request
- Falls back to static keywords if API fails

## Benefits

### 1. Always Up-to-Date
- No manual updates needed
- Automatically includes latest trending movies
- Reflects current Indian movie trends

### 2. Better SEO
- Real trending movies = better search rankings
- Indian regional movies = better local SEO
- Upcoming movies = capture early search traffic

### 3. Scalability
- Easy to add more data sources
- Can integrate with other APIs
- Can add caching for performance

### 4. Regional Relevance
- India-specific movies (region=IN)
- Hindi, Tamil, Telugu movies
- Bollywood focus

## File Structure

```
utils/helpers/getTrendingKeywords.js
├── getTrendingKeywords()      # Fetch trending movies from TMDB
├── getIndianMovieKeywords()   # Fetch Indian regional movies
└── generateSEOKeywords()      # Generate SEO keyword string

pages/index.js
├── getServerSideProps()       # Fetch keywords server-side
└── Home component             # Use keywords in meta tags
```

## API Configuration

### TMDB API Endpoints
- Base URL: `https://api.themoviedb.org/3`
- Region: `IN` (India)
- Languages: `hi` (Hindi), `ta` (Tamil), `te` (Telugu)

### Rate Limiting
- TMDB API allows 40 requests per 10 seconds
- Our implementation makes ~7 requests per page load
- Well within rate limits

## Fallback Strategy

If TMDB API fails:
1. Returns static fallback keywords
2. Logs error for monitoring
3. Site continues to function normally
4. No impact on user experience

## Caching Strategy

### Current Implementation
- Keywords fetched on each request (getServerSideProps)
- Fresh data for every page load
- Good for always up-to-date keywords

### Future Optimization
- Can add Redis caching (6-hour TTL)
- Can use ISR with getStaticProps (revalidate: 21600)
- Can cache in CDN

## Example Output

### Trending Movies
```
["Dune: Part Two", "Oppenheimer", "Barbie", "Kantara 2", ...]
```

### Indian Movies
```
{
  bollywood: ["Pathaan", "Jawan", "Animal", ...],
  tamil: ["Leo", "Vikram", "Master", ...],
  telugu: ["RRR", "Baahubali 2", "Pushpa", ...]
}
```

### Generated Keywords
```
"Dune: Part Two, Oppenheimer, Barbie, Pathaan download, Jawan watch online, 
Hindi movies, Tamil movies, Telugu movies, Action movies, Comedy movies, 
300MB movies, 480p movies, 720p movies, 1080p movies, download movies, 
watch movies online, stream movies free, 2025 movies, Bollywood movies 2025"
```

## Monitoring

### Error Handling
- All API calls wrapped in try-catch
- Fallback to static keywords on error
- Error logging for debugging

### Performance
- Parallel API calls (Promise.all)
- Efficient data processing
- Minimal impact on page load time

## Future Enhancements

### 1. Additional Data Sources
- YouTube trending movies
- Google Trends data
- Social media trending topics
- Box office data

### 2. Advanced Filtering
- Filter by release date
- Filter by rating
- Filter by genre
- Filter by language

### 3. Machine Learning
- Predict trending movies
- Optimize keyword selection
- A/B test keywords

### 4. Real-time Updates
- WebSocket for live updates
- Server-sent events
- Push notifications

## Conclusion

Dynamic keyword generation from TMDB API ensures our SEO keywords are always relevant and up-to-date. This approach is:
- ✅ Scalable
- ✅ Maintainable
- ✅ SEO-friendly
- ✅ Region-specific (India)
- ✅ Always fresh
- ✅ Error-resistant

No more hardcoded keywords that become outdated! 🎬

