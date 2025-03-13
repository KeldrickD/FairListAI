# FairListAI

FairListAI is a modern web application designed for real estate professionals to generate Fair Housing compliant property listings. It uses AI to help real estate agents create effective, compliant, and optimized property listings.

## Features

- **AI-powered Listing Generation**: Create professional property listings with just a few clicks
- **Fair Housing Compliance**: Automatically check listings for potential Fair Housing violations
- **SEO Optimization**: Analyze and enhance listings for better search engine visibility
- **Social Media Integration**: Generate platform-specific content for social media promotion
- **Hashtag Suggestions**: Get relevant hashtags for your property listings
- **PDF Export**: Export your listings as professional PDF documents

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
   git clone https://github.com/yourusername/fairlistai.git
   cd fairlistai
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

1. Navigate to "Create Listing" in the dashboard
2. Fill in your property details
3. Click "Generate Listing"
4. Review, edit, and save your AI-generated listing

### Checking Compliance

1. Go to the "Compliance Checker" page
2. Paste your listing content
3. Click "Check Compliance"
4. Review any potential Fair Housing issues
5. Use "Auto-Fix Issues" for quick compliance corrections

### Optimizing for SEO

1. Visit the "SEO Analyzer" page
2. Enter your listing content
3. Add target keywords (optional)
4. Click "Analyze SEO"
5. Review recommendations and scoring
6. Use "Optimize Listing" to enhance your content

### Managing Listings

1. View all your listings on the "My Listings" page
2. Filter and sort by various criteria
3. Edit, copy, or download any listing

## Project Structure

```
fairlistai/
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
- All contributors who have helped build and improve FairListAI 