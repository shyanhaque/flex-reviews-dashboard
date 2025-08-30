# Flex Living Reviews Dashboard

A comprehensive review management system for Flex Living properties that integrates with Hostaway API and provides a modern dashboard for managers to review and approve guest feedback.

## � Documentation

- **[Technical Documentation](./TECHNICAL_DOCUMENTATION.md)**: Comprehensive technical overview including tech stack, design decisions, API behaviors, and Google Reviews integration findings
- **Setup Instructions**: See below for local development and deployment guides

---

- **Manager Dashboard**: Review, filter, and approve guest reviews
- **Property Overview**: Summary statistics for each property
- **Public Display**: Clean property pages showing approved reviews
- **Hostaway Integration**: Fetches and normalizes review data from Hostaway API
- **Google Reviews Exploration**: Basic integration structure for Google Places API
- **Real-time Approval**: Toggle review visibility for public website
- **Advanced Filtering**: Sort by date, rating, property, and approval status

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **API Routes**: Next.js API routes for backend functionality
- **State Management**: React hooks for local state
- **Environment**: Node.js with environment variable configuration

## 📦 Project Structure

```
src/
├── app/
│   ├── api/reviews/
│   │   ├── hostaway/route.ts     # Hostaway API integration
│   │   └── google/route.ts       # Google Places API exploration
│   ├── dashboard/page.tsx        # Manager dashboard
│   ├── properties/page.tsx       # Public property pages
│   └── layout.tsx                # Root layout
├── components/
│   └── ReviewCard.tsx            # Review display component
└── types/
    └── reviews.ts                # TypeScript interfaces
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Hostaway API credentials (provided)
- Optional: Google Places API key for Google Reviews

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd Flex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   The `.env.local` file is already configured with provided Hostaway credentials:
   ```
   HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
   HOSTAWAY_ACCOUNT_ID=61148
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - **Homepage**: http://localhost:3000
   - **Manager Dashboard**: http://localhost:3000/dashboard
   - **Properties Page**: http://localhost:3000/properties

## 🔍 API Endpoints

### GET /api/reviews/hostaway
Fetches and normalizes reviews from Hostaway API.

**Parameters:**
- `propertyId` (optional): Filter reviews by specific property
- `mock=true` (optional): Use mock data instead of live API

**Response:**
```json
{
  "success": true,
  "data": [...], // Array of normalized reviews
  "meta": {
    "total": 5,
    "source": "mock",
    "timestamp": "2024-08-30T..."
  }
}
```

### GET /api/reviews/google
Explores Google Places API integration for Google Reviews.

**Parameters:**
- `placeId` (optional): Google Place ID for specific location
- `mock=true` (optional): Use mock data

## 📊 Data Models

### NormalizedReview Interface
All reviews are normalized to a consistent structure:
```typescript
interface NormalizedReview {
  id: number;
  source: 'hostaway' | 'google';
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number | null;
  overallRating?: number;
  reviewText: string;
  categories: ReviewCategory[];
  submittedAt: Date;
  channel: string;
  type: string;
  status: 'published' | 'pending' | 'hidden';
  isApprovedForPublic: boolean;
}
```

## 🎯 Key Design Decisions

### 1. **API Route Design**
- **Centralized normalization**: All review sources are normalized to a common structure
- **Mock data support**: Enables development and testing without live API calls
- **Error handling**: Comprehensive error responses for debugging

### 2. **Component Architecture**
- **Separation of concerns**: Dashboard logic separate from display components
- **Reusable components**: ReviewCard component can be used across different views
- **State management**: Local state with React hooks for simplicity

### 3. **User Experience**
- **Intuitive filtering**: Multiple filter and sort options for review management
- **Visual feedback**: Clear approval toggles and status indicators
- **Responsive design**: Works across desktop and mobile devices

### 4. **Data Flow**
- **API-first approach**: Frontend fetches from internal API routes
- **Real-time updates**: UI updates immediately when approvals change
- **Property grouping**: Reviews automatically grouped by property for better overview

## 🔍 Google Reviews Integration Findings

### Current Implementation
- **Mock data structure**: Implemented with Google Places API response format
- **Normalization**: Converts 5-star Google ratings to 10-point scale for consistency
- **API endpoint**: `/api/reviews/google` ready for Google Places API integration

### Requirements for Full Integration
1. **Google Cloud Console setup**: Enable Places API
2. **API key configuration**: Add `GOOGLE_PLACES_API_KEY` to environment
3. **Place ID mapping**: Map Flex Living properties to Google Place IDs
4. **Rate limiting**: Implement caching to respect Google's API limits

### Challenges & Considerations
- **API costs**: Google Places API has usage-based pricing
- **Review freshness**: Google reviews update independently
- **Attribution requirements**: Google requires proper attribution for reviews
- **Limited control**: Cannot approve/hide Google reviews like Hostaway reviews

### Recommendation
Google Reviews integration is technically feasible but requires:
- Google Cloud billing account setup
- Proper Place ID mapping for each property
- Caching strategy to minimize API calls
- Separate handling in dashboard (view-only for Google reviews)

## 🚀 Production Considerations

### Environment Variables
```bash
# Required for production
HOSTAWAY_API_KEY=your_production_api_key
HOSTAWAY_ACCOUNT_ID=your_account_id

# Optional for Google Reviews
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Performance Optimizations
- Implement caching for API responses
- Add pagination for large review datasets
- Consider server-side rendering for public pages
- Optimize images and assets for production

### Security
- API key rotation strategy
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for production domains

## 📝 Future Enhancements

1. **Database Integration**: Store approval status and local modifications
2. **User Authentication**: Secure manager dashboard with login system
3. **Review Analytics**: Trends, insights, and reporting features
4. **Email Notifications**: Alert managers of new reviews
5. **Bulk Actions**: Approve multiple reviews at once
6. **Review Responses**: Allow managers to respond to reviews
7. **API Integration**: Additional review sources (Booking.com, Expedia, etc.)

## 🤝 Contributing

This project follows modern React and Next.js best practices. When contributing:
- Use TypeScript for all new code
- Follow the existing component structure
- Add proper error handling for API calls
- Ensure responsive design compatibility
- Test with both mock and live API data

---

*Built with ❤️ for Flex Living property management*
