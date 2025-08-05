# Coloring Book GPT - Educational Code Example

## Overview

This is an AI-powered coloring book generator that creates custom coloring pages based on user prompts. Users can generate books, view them online, and purchase PDF downloads. This application serves as an educational example of building a modern web application with AI integration.

## Tech Stack

- **Backend**: Ruby on Rails 7.1.2 with PostgreSQL
- **Frontend**: React 18 with React Router for SPA navigation
- **AI Services**: OpenAI GPT-4 for prompt generation, Midjourney API for image generation
- **Authentication**: Google OAuth2 via OmniAuth
- **File Storage**: Google Cloud Storage with Active Storage
- **Image Processing**: ImageMagick (RMagick) for PDF generation
- **Hosting**: Google App Engine

## How It Works

### 1. User Flow (`app/javascript/src/components/App.jsx:11-21`)

```
User Input → AI Prompt Generation → Image Generation → Book Creation → PDF Export
```

The application uses a simple React router that conditionally renders pages based on authentication status.

### 2. Book Creation Process (`app/controllers/api/v1/books_controller.rb:8-21`)

When a user creates a book:

1. **Prompt Generation**: Uses GPT-4 to generate detailed prompts from user input
2. **Image Requests**: Sends requests to Midjourney API for each prompt
3. **Database Storage**: Creates book and image records with tracking IDs
4. **Webhook Processing**: Waits for Midjourney to complete images via webhooks

### 3. AI Integration (`app/services/ai_client.rb`)

**Dual AI Strategy:**

- **OpenAI GPT-4**: Generates creative prompts from user queries (`get_book_prompts:36-44`)
- **Midjourney API**: Creates actual coloring book images (`request_book_image:24-33`)

The service uses a fallback system where DALLE-3 can be used for immediate results while Midjourney provides higher quality images.

### 4. Database Schema (`db/schema.rb`)

**Many-to-Many Design:**

- `users` ↔ `user_books` ↔ `books`
- `books` → `images` (one-to-many)
- `books` → Active Storage (for PDFs)

This allows multiple users to access the same book while maintaining individual purchase status.

### 5. Authentication Flow (`config/routes.rb:20-24`)

Simple Google OAuth implementation:

- Login redirects to Google OAuth
- Callback creates/finds user session
- Frontend checks `window.USER` for authentication state

## Architectural Decisions

**Image Generation (Midjourney vs DALLE):** I opted for Midjourney over DALLE-3, primarily due to DALLE-3's rate limit of one image per minute and some issues with image quality with DALLE. For creating a 12-page coloring book in real-time, Midjourney's ability to generate 12 images in under a minute was a game-changer. However, this choice also brought challenges due to the absence of an official API (I'm using a third party, unofficial API). Architecture-wise, going with Midjourney necessitated a webhook setup for the API to push images updates to and it also required polling to check for updates. This was a more complex solution than the simple API call I would have needed for DALLE-3.

**Authentication (OmniAuth with Google):** For user authentication, I utilized OmniAuth with Google. This approach negated the need for handling password storage while maintaining robust security. The decision to manage authentication on the backend was driven by the desire to keep the front-end as simple as possible, and let Rails handle the heavy lifting.

**Database Schema (Many-to-Many Relationship):** The database schema was designed with a many-to-many relationship between users and books. While the current application associates books primarily with individual users, I envisioned future adaptability where users can share books while maintaining individual purchase statuses.

## Building a Similar Application

### Prerequisites

- Ruby 3.2.2+ and Rails 7.1+
- Node.js for React frontend
- PostgreSQL database
- Google Cloud account (for storage and OAuth)
- OpenAI API key
- Midjourney API access (or DALLE-3 alternative)

### Key Implementation Steps

#### 1. Set Up Rails API with React Frontend

```bash
rails new coloring-book-app --api --database=postgresql
cd coloring-book-app
bundle add jsbundling-rails cssbundling-rails
rails javascript:install:esbuild
rails css:install:bootstrap
```

#### 2. Implement Authentication (`config/initializers/omniauth.rb`)

```ruby
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET']
end
```

#### 3. Create Core Models

- **User**: Authentication and session management
- **Book**: Container for generated coloring pages
- **Image**: Individual coloring page with prompt and status tracking
- **UserBook**: Join table with purchase status

#### 4. AI Service Integration Pattern

```ruby
class AiClient
  def initialize
    @openai_client = OpenAI::Client.new
  end

  def generate_prompts(query)
    # Use GPT-4 to expand user input into detailed prompts
  end

  def request_images(prompts)
    # Send requests to image generation API
    # Handle async processing with webhooks
  end
end
```

#### 5. Webhook Processing (`app/controllers/webhook_controller.rb`)

Handle async image generation updates:

- Receive webhook notifications
- Update image records with generated URLs
- Trigger frontend updates

#### 6. File Processing with Active Storage

- Store generated images in cloud storage
- Convert images to PDF using ImageMagick
- Generate signed URLs for secure access

### Development Best Practices Demonstrated

#### API Design

- RESTful routes with clear separation of concerns
- Proper error handling and status codes
- Authentication checks on sensitive operations

#### Frontend Architecture

- Component-based React structure
- Client-side routing with protected routes
- State management with custom hooks

#### Database Design

- Many-to-many relationships for scalability
- Proper foreign key constraints
- Indexing for query performance

#### External API Integration

- Service objects for third-party API calls
- Retry logic and error handling
- Webhook processing for async operations

### Environment Variables Required

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_key
MIDJOURNEY_API_KEY=your_midjourney_key
GOOGLE_CLOUD_PROJECT_ID=your_gcp_project
COLORING_BOOK_GPT_DATABASE_PASSWORD=your_database_password
```

### Running the Application

```bash
# Install dependencies
bundle install
yarn install

# Set up database
rails db:create db:migrate db:seed

# Start development servers
./bin/dev  # Runs Rails + esbuild + CSS watch
```
