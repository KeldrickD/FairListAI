# Listing Genie

Listing Genie is a modern web application designed for real estate professionals to generate engaging, Fair Housing compliant property listings. It uses AI to help real estate agents save time and create more effective listings with just a few clicks.

## Features

- **AI-powered Listing Generation**: Create professional property descriptions in seconds
- **Catchy Headlines**: Generate attention-grabbing headlines that highlight key property features
- **Fair Housing Compliance**: Automatically check listings for potential Fair Housing violations
- **Social Media Content**: Generate platform-specific content for Instagram, Facebook, LinkedIn, and Twitter
- **Email Templates**: Create professional email announcements for your listings
- **Neighborhood Insights**: Add relevant neighborhood highlights without demographic assumptions
- **Hashtag Suggestions**: Get relevant hashtags for your property listings
- **PDF Export**: Export your listings as professional PDF documents

## Pricing

- **Basic Plan**: $29/month - 20 listings/month, basic features
- **Pro Plan**: $59/month - 50 listings/month, advanced features and neighborhood highlights 
- **Business Plan**: $99/month - Unlimited listings, team access, analytics dashboard

Add-ons:
- **Market Analysis**: $19/month - Get market insights and pricing suggestions
- **AI Copywriting Assistant**: $15/month - Access advanced copywriting features

## Screenshots

*(Screenshots of the application would be placed here)*

## Installation

### Prerequisites

- Node.js 18+ 
- npm
- PostgreSQL database (optional, for full functionality)

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/listing-genie.git
   cd listing-genie
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Usage

### Creating Listings

1. Navigate to "New Listing" in the dashboard
2. Fill in your property details
3. Click "Generate Listing"
4. Review your generated listing, headlines, social media content, and more
5. Save or download your content

### Checking Compliance

1. The system automatically checks for Fair Housing compliance
2. Review any potential issues flagged by the system
3. Use suggestions to fix potential violations

### Optimizing for Social Media

1. Use the generated platform-specific content for Instagram, Facebook, LinkedIn, and Twitter
2. Copy and paste the content directly into your social media platforms
3. Use the suggested hashtags to increase visibility

## Project Structure

```
listing-genie/
├── components/        # UI components
├── pages/             # Next.js pages
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard pages
│   └── auth/          # Authentication pages
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── styles/            # Global styles
└── public/            # Static assets
```

## Technology Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **API**: Next.js API routes
- **AI Integration**: OpenAI GPT-4
- **PDF Generation**: PDFKit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI models
- All contributors who have helped build and improve Listing Genie 