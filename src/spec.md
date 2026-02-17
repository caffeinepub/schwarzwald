# Schwarzwald

## Overview
An ultra-premium vacation rental website for exclusive forest holiday homes in the Schwarzwald (Black Forest) region of Germany, built with Next.js, TypeScript, and Tailwind CSS. The application features a luxurious, minimalist design inspired by high-end hospitality brands, targeting discerning guests seeking tranquility and elegance in the ancient forest landscape. The application supports both German and English languages with seamless switching.

## Core Features

### Language Support
- **Bilingual Application**: Full support for German and English languages
- **Language Context**: Global language state management using React Context
- **Dynamic Content**: All text content updates immediately when language is changed
- **Language Persistence**: Selected language preference maintained across page navigation

### Navigation Structure
- **Scroll-Reactive Header**:
  - **Transparent state**: Fully transparent background in hero sections with white text, logo, and navigation elements (#FFFFFF)
  - **Scrolled state**: White background (#FFFFFF) with black text (#000000), subtle shadow, and smooth 300ms transition
  - **Smooth transitions**: All color and background changes animate smoothly during scroll
  - **Mobile burger menu**: Cream background (#FAFAF5) with body scroll locked when open
  - **Responsive behavior**: Consistent functionality across all devices
  - **Brand Name**: Header displays "Schwarzwald" as the main brand name
  - **Dynamic Language Selector**: Language button that adapts its label and dropdown content based on the currently selected language
    - **English Mode**: Button displays "Language" with dropdown options "English" and "German"
    - **German Mode**: Button displays "Sprache" with dropdown options "Englisch" and "Deutsch"
    - **Dynamic Label Updates**: Button text changes instantly when language is switched via LanguageContext
    - **Localized Dropdown Options**: Dropdown items display in the current language context
    - **Instant Language Switching**: Selecting any dropdown option immediately updates the entire site language and button state
    - **Consistent Styling**: Maintains minimalistic luxury styling with black text, gold hover underline, small serif font matching Instagram button design
    - **Smooth Animations**: Dropdown slides down with fade effect, closes when clicking outside
    - **Responsive Design**: Same spacing, typography, and styling as other header buttons across all devices
    - **Premium Aesthetic**: Consistent with overall header aesthetic and luxury design language

- **Main Navigation Items** (multilingual):
  - Startseite / Home
  - Domizil / Residences (Dropdown with four houses):
    - Waldhaus Tannenhof
    - Forsthaus Hirschgrund
    - Domizil Fichtenberg
    - Domizil Schwarzwaldblick
  - Bewertungen / Reviews
  - Verfügbarkeit / Availability

- **Dropdown Menu Styling**:
  - **Hero section state**: When background images are visible (transparent header), dropdown options display with white text (#FFFFFF) and white border lines around each item for enhanced visibility
  - **Scrolled state**: When users scroll past hero sections (white background), dropdown menu, options, and border lines transition smoothly to black (#000000)
  - **Smooth transitions**: All dropdown color changes animate gracefully with 300ms transition matching header behavior
  - **Consistent layout**: Dropdown maintains same positioning, spacing, and luxury design aesthetic across all states
  - **Mobile compatibility**: Dropdown styling transitions work consistently on both desktop and mobile devices

### Pages Structure

#### Homepage (/)
- **Hero Section**:
  - Fullscreen background image showcasing the mystical Black Forest landscape
  - Main title: "Zwischen Wipfeln und Stille" / "Between Treetops and Silence"
  - Subtitle: "Handverlesene Refugien in den Tiefen des Schwarzwalds – wo uralte Tannen auf zeitlose Eleganz treffen und jeder Atemzug zur Meditation wird." / "Hand-selected refuges in the depths of the Black Forest – where ancient firs meet timeless elegance and every breath becomes meditation."
  - White text overlay with elegant typography
  - Proper responsive scaling for all screen sizes

- **Content Sections**:
  - Introductory text about forest luxury and traditional craftsmanship (multilingual)
  - Property showcase with four Black Forest holiday homes
  - Region highlights and forest activities teaser (multilingual)
  - Guest testimonials preview (multilingual)
  - Call-to-action for booking inquiries (multilingual)

#### Property Detail Pages (/domizil/[residence])
- **Individual Residence Pages** for each property:
  - Waldhaus Tannenhof
  - Forsthaus Hirschgrund
  - Domizil Fichtenberg
  - Domizil Schwarzwaldblick

- **Page Structure**:
  - Hero section with property-specific background image
  - Property description and amenities (multilingual)
  - Image gallery showcasing the residence
  - **No Call-to-Action Section**: The bottom CTA section with "Erleben Sie unvergessliche Momente" heading, descriptive paragraph, and "Verfügbarkeit prüfen" button has been completely removed from all property detail pages
  - Clean transition to footer after main content sections

#### Reviews Page (/bewertungen)
- **Luxury Minimalist Design**:
  - Pure white background (#FFFFFF)
  - Thin solid black borders (1px) (#111111)
  - Soft grey dividers (#E5E5E5)
  - Dark green buttons (#0F3D2E) with darker hover shade (#0C3226) and smooth transitions
  - Serif typography (Playfair Display or Cormorant Garamond) for headings
  - Sans-serif typography (Inter or Lato) for body text
  - Font sizing: Residence name 22-26px on desktop, 18px on mobile; section heading ≈ 18px; body ≈ 15px with line-height 1.5-1.6
  - Generous whitespace and padding throughout all sections

- **Page Structure**:
  - **Residence Cards Grid**: Display four residence cards at the top of the page, each featuring:
    - Residence image with rounded rectangle styling
    - Residence title
    - "Bewertung schreiben →" / "Write Review →" clickable link (multilingual)
    - **Fully Functional Click Handlers**: Both card and link trigger form display with proper state management
  
  - **Dynamic Review Form Section** (Client Component):
    - **Initial State**: Review form hidden by default
    - **Selected Residence Image**: Dynamic image element positioned directly above the form heading
      - Uses same rounded rectangle styling, size, and aspect ratio as residence card images
      - Updates to show the selected residence's image when a card is clicked
      - Maintains luxury minimalist styling consistent with the rest of the website
    - **Dynamic Heading**: "Bewertung schreiben für [Residence Name]" / "Write Review for [Residence Name]" with residence name updating based on selected card (multilingual)
    - **Form Activation**: When any residence card or "Bewertung schreiben →" / "Write Review →" link is clicked:
      - Sets `selectedResidenceId` state variable
      - Form appears smoothly with fade-in animation using `transition-opacity`
      - Page automatically scrolls to bring the form into view using `scrollIntoView({ behavior: "smooth" })`
      - Selected residence image displays with the exact image from the clicked card
      - Heading updates to show correct residence name dynamically
    - **TypeScript Type-Safe Form State**:
      - `name: string` - Guest name input field (required) - "Name" / "Name"
      - `email: string` - Email input field (required) - "E-Mail" / "Email"
      - `stayPeriod: string` - Stay period input field (required) - "Aufenthaltszeitraum" / "Stay Period"
      - `overallRating: number` - Overall rating (1-5 stars, required) - "Gesamtbewertung" / "Overall Rating"
      - `message: string` - Large textarea labeled "Teilen Sie Ihre Erfahrung mit…" / "Share your experience…" (required) (multilingual)
    - **Interactive Star Rating Components**:
      - **Overall Rating**: 1-5 star selection with hover and click states using `InteractiveStarRating` component
      - **Visual Feedback**: Active states, hover effects, and smooth transitions
      - **Type Safety**: All rating values properly typed as numbers
      - **Persistent Selection**: Selected stars remain highlighted until changed
      - **Touch-Friendly**: Optimized for mobile tap interactions
    - **Form Validation**: 
      - Required field validation for name, email, stay period, message, and overall rating
      - Inline error message display for each field (multilingual)
      - Prevent submission until all required fields are completed
    - **Submit Button**: "Bewertung absenden" / "Submit Review" styled in dark green (#0F3D2E) with hover effects (#0C3226) (multilingual)
    - **Real-time Review Addition**: When form is submitted, new review appears immediately in the relevant residence section without page reload
    - **Smooth Animations**: 
      - Fade-in effects for form reveal and interactions
      - Smooth transitions for star hover states
      - Elegant scroll animations to form section
      - Feedback animations for successful submission

- **Individual Residence Review Sections**:
  - **Section Layout**:
    - Residence name displayed prominently in serif typography (22-26px desktop, 18px mobile)
    - **Overall Rating Summary**: Display average rating with star icons only
    - Clean card design with white background and thin black borders (#111111)
    - Proper spacing and alignment with generous whitespace and padding
  
  - **Review Display** (per residence):
    - **Individual Review Cards**: Display reviews specific to each residence with actual review content (multilingual)
    - **Review Content**: Guest name, stay period, star rating, and review text
    - **Luxury Card Style**: White background with thin black borders (#111111, 1px solid)
    - **Visual Separation**: Soft grey dividers (#E5E5E5) between reviews
    - **Delete Functionality**: Review removal capability with delete button/icon per review using `confirm("Diese Bewertung entfernen?" / "Remove this review?")` (multilingual)
    - **Dynamic Updates**: New reviews appear immediately after form submission with smooth fade-in animation
    - **Persistent Mock Data**: Each residence displays demonstration reviews that persist across page loads
    - **Interactive Content**: Reviews feel visually alive with hover effects and smooth transitions
    - **Consistent Typography**: Matching the overall page design with proper spacing
    - **Residence-Specific Reviews**: Users can leave and view reviews specific to each residence without page reload
    - **Real-time Delete**: Removing reviews updates UI immediately without page refresh

- **Rating Summary Features** (per residence):
  - **Average Rating Display**: Overall star rating calculated from all reviews for that residence
  - **Dynamic Updates**: Rating summary updates automatically when new reviews are submitted or deleted
  - **Real-time Calculation**: Averages recalculate immediately upon review addition or removal
  - **Minimalist Design**: Clean presentation matching the luxury aesthetic

- **Responsive Design**:
  - Fully responsive layout optimized for all screen sizes
  - Perfect mobile viewport containment with no overlapping or cropped elements
  - Clean alignment and spacing across all devices
  - Touch-friendly interactive elements for star rating selection and residence card clicks
  - Responsive typography scaling (22-26px desktop to 18px mobile for residence names)
  - Mobile-optimized form layouts and button sizing
  - **Smooth Scroll and Fade Animations**: Fully responsive animations that work seamlessly across all devices

- **Animation and Interaction**:
  - **Smooth Fade-in Effects**: Forms and reviews appear with elegant fade-in animations
  - **Interactive Star Ratings**: Hover and selection states for star rating system with smooth transitions
  - **Form Feedback**: Visual confirmation for successful review submission (multilingual)
  - **Responsive Interactions**: Touch-optimized for mobile devices
  - **Performance Optimized**: Lightweight animations that don't impact mobile performance
  - **Smooth Scrolling**: Automatic scroll to form when residence card is clicked
  - **Dynamic Image Updates**: Smooth transitions when residence images change in the form
  - **Real-time Content Updates**: New reviews appear immediately with smooth animations
  - **Premium Aesthetic Harmony**: All interactions maintain the Schwarzwald luxury design language

#### Availability Page (/verfügbarkeit)
- **Multi-Residence Calendar Interface**:
  - **Individual Calendar for Each Residence**:
    - Four separate booking sections for all Schwarzwald properties with correct residence names:
      - Waldhaus Tannenhof
      - Forsthaus Hirschgrund
      - Domizil Fichtenberg
      - Domizil Schwarzwaldblick
    - Each residence displays its correct name prominently as a heading in both German and English
    - Individual calendar widget for each residence using the same clean minimalist design
    - Full month view in a 7-column grid layout per residence
    - Column headers labeled: Mo, Di, Mi, Do, Fr, Sa, So / Mon, Tue, Wed, Thu, Fri, Sat, Sun (multilingual)
    - White background with thin black lines and modern typography
    - Rounded rectangle framing each individual calendar
    - Left and right navigation arrows for month navigation per calendar
    - Dynamic month header that automatically updates based on current system date for each calendar (multilingual month names)
    - All days evenly spaced and easily tappable on mobile devices
    - Optimized for mobile viewport (around 390px width)
    - Vertical layout matching luxury minimalist design aesthetic
    - Balanced spacing and elegant proportions for each residence section

- **Date Range Selection Per Residence**:
  - **Start Date Selection**: Click to select arrival date, highlighted with dark green or black circle
  - **End Date Selection**: Click to select departure date, all days between start and end highlighted as continuous soft blue range
  - **Range Validation**: Ensure end date is after start date for each residence independently
  - **Visual Feedback**: Clear indication of selected date range with smooth transitions per residence
  - **Range Reset**: Allow users to clear selection and start over for each residence independently
  - **Independent Selection**: Date range selection works independently for each residence

- **Dynamic Month Navigation Per Residence**:
  - Automatic display of current month based on system date for each residence calendar
  - Smooth navigation between months (November → December → January) per residence
  - Month header updates dynamically to show correct month and year for each calendar (multilingual)
  - Navigation arrows for moving between months independently per residence
  - Consistent calendar layout across all months for each residence

- **Individual Booking Inquiry Forms**:
  - **Form Visibility**: Appears below each residence calendar only after valid date range is selected for that specific residence
  - **Form Fields** (per residence, multilingual):
    - Name input field - "Name" / "Name"
    - Email input field - "E-Mail" / "Email"
    - Phone input field - "Telefon" / "Phone"
    - Guest number dropdown (1–8 guests) - "Anzahl Gäste" / "Number of Guests"
  - **Guest Dropdown Functionality** (per residence):
    - Clean dropdown that opens above or below other fields without overlap
    - Solid white background with clear black text
    - Selected value displays clearly (e.g., "2 Gäste" / "2 Guests") without UI artifacts (multilingual)
    - No covering triangles or cut elements
    - Smooth open/close animations
  - **Form Submission** (per residence):
    - "Anfrage senden" / "Send Inquiry" button in dark green (multilingual)
    - Form validation for all required fields (multilingual error messages)
    - Confirmation message after successful submission (multilingual)
    - Integration with selected date range data for specific residence
    - Independent form handling per residence

- **Mobile Performance Optimizations**:
  - GPU acceleration using `transform: translateZ(0)` for calendar animations
  - `will-change: transform` property applied to animated calendar elements
  - `requestAnimationFrame` implementation for smooth scrolling and calendar updates
  - Reduced shadow effects on mobile devices to prevent repaint lag
  - Disabled heavy hover effects on touch devices
  - Optimized for iOS Safari and Android browser performance
  - Lightweight component rendering to minimize re-renders
  - Efficient layout calculations to prevent animation lag
  - Smooth rendering and interaction specifically optimized for mobile browsers
  - Lightweight transitions for enhanced performance

### Design Requirements
- **Luxurious Aesthetic**:
  - Calm, minimalist design with abundant white space
  - Color palette: white (#FFFFFF), black (#111111) for borders, dark green (#0F3D2E) for buttons with hover (#0C3226), soft grey (#E5E5E5) for dividers, gold for hover accents
  - Serif font (Playfair Display or Cormorant Garamond) for headings
  - Sans-serif font (Inter or Lato) for body text

- **Visual Elements**:
  - Rounded cards with soft shadows (reduced on mobile for performance)
  - Generous padding throughout
  - Smooth hover transitions and micro-interactions (optimized for mobile)
  - Mobile-first responsive design with performance considerations
  - Consistent spacing and alignment
  - Perfect mobile viewport containment

- **Component Structure**:
  - Global layout with Header and Footer components
  - Reusable components: Hero, ReviewCard, Calendar, PropertyCard, ResidenceReviewSection, BookingForm
  - Modular component architecture under /components directory
  - Well-commented code sections for clarity
  - Performance-optimized calendar component for mobile devices
  - **Review System Components**: Organized under `/components/reviews` for modularity
  - **Language Components**: LanguageContext and dynamic language selector components with adaptive dropdown functionality

### Technical Requirements
- **Next.js Implementation**:
  - TypeScript for type safety with strict typing
  - Tailwind CSS for styling
  - App Router for navigation
  - Responsive design patterns

- **Language Implementation**:
  - React Context for global language state management
  - Language switching functionality with immediate content updates
  - Multilingual content support for all text elements
  - Language persistence across navigation

- **Functionality**:
  - Smooth scroll behavior throughout the application
  - Mobile burger menu with proper state management
  - Individual calendar per residence with date range selection and mobile optimizations
  - Dynamic month navigation based on system date per residence (multilingual)
  - Individual booking inquiry forms with guest dropdown functionality per residence (multilingual)
  - Form submission and validation per residence (multilingual)
  - **Dynamic Language Dropdown Button**: Adaptive language button that changes its label and dropdown content based on current language
    - **English State**: Button shows "Language" with dropdown options "English" and "German"
    - **German State**: Button shows "Sprache" with dropdown options "Englisch" and "Deutsch"
    - **Instant Updates**: Button label and dropdown content update immediately when language is switched
    - **Smooth Animations**: Dropdown slides down with fade effect and closes when clicking outside
    - **Language Context Integration**: Uses existing LanguageContext for immediate site-wide language switching
    - **Consistent Styling**: Maintains luxury styling matching other header buttons with proper spacing and typography
  - **Correct Residence Names**: All four residences display proper Schwarzwald house names in availability section
  - **Fully Functional Dynamic Review Form**: 
    - Interactive residence card selection with proper click handlers for both cards and links
    - TypeScript type-safe state management using `useState<Record<ResidenceId, Review[]>>`
    - Form display with smooth fade-in animations and scroll behavior using `scrollIntoView({ behavior: "smooth" })`
    - Dynamic image updates and heading changes based on selected residence
    - Interactive star rating components with hover and click states that persist selection
    - Comprehensive form validation for all required fields with inline error messages (multilingual)
    - Real-time review submission and display without page reload
  - **Residence Selection Logic**: Click handlers for residence cards and "Bewertung schreiben →" / "Write Review →" links with proper state management
  - **Dynamic Image Display**: Selected residence image element that updates based on selected residence with exact image matching from clicked card
  - **Dynamic Heading Updates**: Form heading that changes to show selected residence name (multilingual)
  - **Fully Functional Review System**: Complete review submission, storage, and display per residence with real-time updates (multilingual)
  - **TypeScript Type Safety**: All review components use proper TypeScript interfaces:
    - `ResidenceId` type with specific residence identifiers
    - `Review` interface with required fields (name, email, stayPeriod, overallRating, message)
  - **Interactive Star Rating**: Hover and click responsive star selection system for overall rating with persistent visual state using `InteractiveStarRating` component
  - **Rating Summary Calculation**: Automatic calculation and display of average ratings per residence
  - **Review Management**: Individual review submission, display, and deletion per residence with immediate UI updates and confirmation dialogs (multilingual)
  - **Persistent Mock Reviews**: Demonstration review data that persists across page loads for each residence
  - **Real-time Review Addition**: New reviews appear immediately in residence sections without page reload
  - **Real-time Review Deletion**: Reviews can be deleted with immediate UI updates and rating recalculation
  - **Smooth Animations**: Fade-in effects for review forms, star transitions, and submitted reviews with full responsiveness

- **Performance**:
  - Optimized image loading and display
  - Smooth animations and transitions with GPU acceleration
  - Mobile-responsive layouts with performance optimizations
  - Cross-browser compatibility with focus on mobile browsers
  - Efficient calendar rendering using requestAnimationFrame
  - Reduced visual effects on mobile to prevent lag

### Content & Language
- **Primary languages**: German and English with seamless switching
- **Tone**: Refined, elegant, emphasizing luxury and forest tranquility (both languages)
- **Content focus**: Forest serenity, exclusive accommodations, premium hospitality rooted in Black Forest tradition (multilingual)
- **SEO optimization**: Proper meta tags and heading hierarchy (multilingual)
- **Brand Name**: "Schwarzwald"
- **Contact Email**: welcome@schwarzwald.at
- **Footer Content**: Updated to reflect "Schwarzwald" branding while maintaining luxury aesthetic and tone (multilingual)

## Backend Requirements
- **Data Management**:
  - In-memory simulation of booking, review, and token data
  - Property information for four Black Forest holiday homes: Waldhaus Tannenhof, Forsthaus Hirschgrund, Domizil Fichtenberg, and Domizil Schwarzwaldblick
  - **Multilingual Content Support**: Backend data structures supporting both German and English content
  - **Language-Aware API**: Backend endpoints that can serve content in requested language
  - **Simplified Review Management**: Review collections per residence with overall star ratings only (multilingual)
  - **TypeScript Interface Support**: Backend data structures that support frontend TypeScript interfaces for simplified review data
  - **Rating Calculations**: Backend logic to calculate average overall ratings per residence
  - Individual availability data for calendar display per residence
  - Independent booking inquiry data storage and processing per residence (multilingual)
  - **Persistent Mock Review Data**: Pre-populated demonstration reviews for each residence that persist across sessions (multilingual)
  - **Real-time Review Processing**: Backend support for immediate review submission and retrieval per residence
  - **Brand Name Updates**: All backend references updated to "Schwarzwald"
  - **Contact Information**: Backend contact email updated to welcome@schwarzwald.at

- **Review System**:
  - **Simplified Review Processing**: Review submission handling with residence-specific association and real-time processing (overall rating only) (multilingual)
  - **TypeScript Data Models**: Backend data structures that match frontend TypeScript interfaces for simplified Review interface
  - **Star Rating Storage**: Store 1-5 star ratings for overall rating only per residence
  - **Rating Summary Generation**: Calculate and provide average overall ratings per residence with automatic updates
  - **Review CRUD Operations**: Create, read, update, and delete reviews per residence with immediate data persistence (multilingual)
  - Form validation and error handling per residence with proper TypeScript typing (multilingual)
  - **Review Display Logic**: Provide review data with guest information, stay periods, and overall star ratings per residence (multilingual)
  - **Demonstration Review Data**: Rich sample review data with varied overall ratings per residence for immediate display (multilingual)
  - **Rating Aggregation**: Backend logic to aggregate and calculate overall rating summaries per residence with real-time updates
  - **Real-time Review Updates**: Backend support for immediate review addition and display without page refresh
  - **Real-time Review Deletion**: Backend support for immediate review removal with rating recalculation
  - **Residence-Specific Data**: Separate review collections and rating calculations for each of the four residences

- **Booking System**:
  - Individual date range selection processing per residence
  - Booking inquiry submission handling with guest information per residence (multilingual)
  - Date range validation and availability checking per residence
  - Form validation and error handling for booking inquiries per residence (multilingual)
  - Guest number processing (1-8 guests) per residence
  - Inquiry confirmation and response handling per residence (multilingual)
  - Independent booking management for each of the four residences

- **Content Storage**:
  - Property descriptions and amenities for all four Black Forest residences (multilingual)
  - **Simplified Review Data**: Review collections with overall star ratings only per residence (multilingual)
  - **TypeScript-Compatible Data**: All stored data structures compatible with frontend TypeScript interfaces
  - **Rating Summary Data**: Calculated averages for overall ratings per residence with automatic updates
  - Individual booking information and availability per residence
  - Independent review and rating data per residence with persistent mock data (multilingual)
  - Individual booking inquiry records with guest details and selected dates per residence
  - **Mock Review Persistence**: Demonstration review data that remains available across page loads and sessions (multilingual)
  - **Residence-Specific Storage**: Separate data collections for each residence to support independent review systems
  - **Updated Brand References**: All content and data references updated to "Schwarzwald" branding
  - **Multilingual Static Content**: All static text content available in both German and English

## Technical Implementation
- **Project Structure**:
  - Next.js with TypeScript configuration
  - Tailwind CSS setup and customization
  - Component organization under /components
  - Page routing with App Router
  - Responsive design implementation
  - **Review Components**: Modular review system components under `/components/reviews`
  - **Language Components**: Language context and dynamic dropdown selector components

- **Component Requirements**:
  - Header with scroll-reactive behavior and adaptive dropdown styling, displaying "Schwarzwald" as brand name, including dynamic language button with adaptive label and dropdown content
  - Footer with consistent styling and updated "Schwarzwald" branding (multilingual)
  - Hero section with Black Forest background image (multilingual content)
  - **Enhanced ReviewCard**: Display reviews with overall star ratings and real-time updates (multilingual)
  - **RatingSummary Component**: Display average overall ratings per residence with automatic recalculation
  - **InteractiveStarRating Component**: Dynamic star selection for review forms with hover and click states that persist selection
  - **Functional Residence Selection**: Interactive residence cards with proper click handlers for both cards and "Bewertung schreiben →" / "Write Review →" links
  - **TypeScript Review Form**: Client component with type-safe state management for simplified review data fields (multilingual)
  - **Dynamic Review Form**: Form with selected residence image element that matches clicked card image and dynamic heading updates (multilingual)
  - Mobile-optimized individual Calendar widget per residence with date range selection and GPU acceleration (multilingual)
  - PropertyCard for house showcases
  - **Complete ResidenceReviewSection**: Fully functional simplified review system per residence with inline forms, rating summaries, real-time updates, and smooth animations (multilingual)
  - Individual BookingForm component per residence with guest dropdown and form validation (multilingual)
  - **Smooth Animation Components**: Fade-in and transition components for form reveals and interactions
  - **Review Delete Component**: Delete functionality with confirmation and real-time UI updates (multilingual)
  - **Property Detail Components**: Individual residence pages without bottom CTA sections, ensuring clean layout transitions to footer
  - **Dynamic Language Dropdown Component**: Adaptive language button that changes label and dropdown options based on current language with smooth animations and outside click detection
  - **LanguageContext**: React context for global language state management

- **Development Setup**:
  - Runnable after npm install and npm run dev
  - Proper TypeScript configuration with strict typing
  - Tailwind CSS integration
  - Mobile-responsive testing with performance validation
  - Cross-browser compatibility verification for mobile devices
  - **Type-Safe Review System**: All review components use proper TypeScript interfaces without `any` types
  - **Language Support Setup**: LanguageContext provider and multilingual content structure with dynamic dropdown functionality
