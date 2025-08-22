# IT Consultis Pokemon Exercise

A Next.js application showcasing Pokemon data with pagination and type filtering, built for the IT Consultis front-end position exercise. This application demonstrates both Server-Side Rendering (SSR) and Client-Side Rendering (CSR) approaches with advanced performance optimizations.

## 🌟 Features

- **Dual Implementation**: Both SSR (/) and CSR (/csr) pages demonstrating different rendering strategies
- **Pokemon Listing**: Display Pokemon with images, names, and numbers
- **Type Filtering**: Filter Pokemon by their types with optimistic UI updates
- **Pagination**: Navigate through all 1302+ Pokemon with smooth pagination
- **Search Parameters**: URL-based state management for filtering and pagination
- **TanStack Query**: Efficient client-side data fetching with caching
- **Performance Optimizations**: Debounced navigation, optimistic updates, and streaming SSR
- **Shadcn/UI Components**: Modern design system with consistent styling
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TypeScript**: Fully typed with no 'any' types
- **Interactive UI**: Cursor pointer styling and enhanced user feedback

## 🏗️ Architecture

This application demonstrates a clear understanding of Next.js 15 App Router with proper separation of server and client components across two different approaches:

### Pages

- **`/` (SSR Page)**: Server-side rendered page with initial data fetching on the server
- **`/csr` (CSR Page)**: Client-side rendered page using TanStack Query for data management

### Server Components

- **`app/page.tsx`**: Main SSR page that fetches Pokemon and types data on the server using searchParams
- **`app/layout.tsx`**: Root layout with metadata configuration and QueryProvider wrapper

### Client Components

- **`app/csr/page.tsx`**: CSR implementation using TanStack Query hooks
- **`components/Navigation.tsx`**: Navigation between SSR and CSR pages
- **`components/PokemonCard.tsx`**: Individual Pokemon display component
- **`components/TypeFilterWithParams.tsx`**: Type selection using URL search parameters
- **`components/PaginationWithParams.tsx`**: Pagination using URL search parameters
- **`components/QueryProvider.tsx`**: TanStack Query client setup with caching configuration

### Utilities

- **`lib/pokemon-api.ts`**: API functions with both server-side (cached) and client-side variants
- **`types/pokemon.ts`**: TypeScript interfaces for all Pokemon data structures

## 🔧 Technical Decisions

### SSR vs CSR Implementation

1. **Server-Side Rendering (`/`)**:

   - Initial data fetching on server for better SEO and performance
   - Uses Next.js searchParams for URL state management
   - Server components with async data fetching
   - Better for SEO and initial page load performance

2. **Client-Side Rendering (`/csr`)**:
   - Uses TanStack Query for efficient data fetching and caching
   - Client-side state management with URL search parameters
   - Better for interactive user experiences
   - Demonstrates modern React patterns

### State Management

- **URL Search Parameters**: Both implementations use search params for filter and pagination state
- **TanStack Query**: CSR page uses Query for server state management with automatic caching
- **No Local State**: All filtering and pagination state is managed via URL for better UX

### Caching Strategy

- **Server-side**: Next.js revalidation for optimal caching (1 hour for Pokemon, 24 hours for types)
- **Client-side**: TanStack Query with 5-minute stale time and background refetching

### Type Safety

- Complete TypeScript coverage with specific interfaces
- No use of 'any' types throughout the codebase
- Proper typing for async searchParams in Next.js 15

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/htthai2201/consultis-pokemon.git
cd consultis-pokemon
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) for SSR or [http://localhost:3000/csr](http://localhost:3000/csr) for CSR.

### Building for Production

```bash
npm run build
npm start
```

## 📱 Usage

### SSR Page (`/`)

1. **Server-Rendered**: Initial data is fetched on the server
2. **Filter by Type**: Click on any type button to update URL and refetch on server
3. **Navigate Pages**: Pagination updates URL and triggers server-side data fetching

### CSR Page (`/csr`)

1. **Client-Rendered**: Data is fetched using TanStack Query on the client
2. **Filter by Type**: Click on any type button to update URL and trigger client-side refetch
3. **Navigate Pages**: Pagination updates URL and uses Query cache for optimal performance
4. **Loading States**: Displays loading indicators during data fetching

### Navigation

- Use the navigation bar to switch between SSR and CSR implementations
- URL state is preserved when switching between pages

## 🛠️ Built With

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **TanStack Query v5** - Server state management for CSR implementation
- **Tailwind CSS** - Utility-first CSS framework
- **Pokemon API (PokeAPI)** - RESTful Pokemon data source
- **React Hooks** - State management and side effects

## 📊 API Integration

The application integrates with [PokeAPI](https://pokeapi.co/) using these endpoints:

- `/pokemon` - List Pokemon with pagination
- `/pokemon/{id}` - Individual Pokemon details
- `/type` - List all Pokemon types
- `/type/{name}` - Pokemon of specific type

### API Functions

```typescript
// Server-side with caching
export async function getPokemonList(
  page: number = 1
): Promise<PokemonListResponse>;
export async function getPokemonTypes(): Promise<TypeListResponse>;

// Client-side variants
export async function getPokemonListClient(
  page: number = 1
): Promise<PokemonListResponse>;
export async function getPokemonTypesClient(): Promise<TypeListResponse>;
```

## 🔍 Code Quality

- **ESLint**: Code linting with Next.js recommended rules
- **TypeScript**: Strict type checking enabled
- **Component Architecture**: Clean separation of concerns between SSR and CSR
- **Error Boundaries**: Proper error handling throughout
- **Loading States**: User feedback during data fetching
- **URL State Management**: Consistent state management via search parameters

## 📈 Performance Considerations

### SSR Implementation

- Server-side data fetching for initial load
- Next.js caching with revalidation
- Search params for stateless navigation

### CSR Implementation

- TanStack Query for efficient client-side caching
- Background refetching for fresh data
- Optimistic updates and error recovery

### Shared Optimizations

- Image optimization with Next.js Image component
- Efficient re-rendering with proper React patterns
- API response caching for improved performance

## 🧭 Navigation Between Approaches

The application includes a navigation component that allows users to:

- Switch between SSR (`/`) and CSR (`/csr`) implementations
- Compare different rendering strategies
- See how each approach handles the same functionality

## 🏛️ Architecture Comparison

| Feature        | SSR (/)              | CSR (/csr)              |
| -------------- | -------------------- | ----------------------- |
| Initial Load   | Server-rendered      | Client-rendered         |
| Data Fetching  | Server-side          | TanStack Query          |
| Caching        | Next.js revalidation | Query cache             |
| SEO            | Excellent            | Good (with meta tags)   |
| Interactivity  | Page reloads         | Seamless transitions    |
| Loading States | Minimal              | Rich loading indicators |

## 📚 Documentation

For detailed technical information, please refer to:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Comprehensive architecture documentation covering component design, data flow diagrams, performance optimizations, and scalability considerations
- **[FLOW.md](./docs/FLOW.md)** - Detailed application flow documentation with sequence diagrams showing user interactions, state management, and rendering strategies
- **[TIME_TRACKING.md](./docs/TIME_TRACKING.md)** - Development time breakdown and progress tracking

## 🤝 Contributing

This is an exercise project, but suggestions and improvements are welcome!

## 📄 License

This project is for educational purposes as part of the IT Consultis interview process.

---

**Developed by**: hthai2201
**For**: IT Consultis Pokemon Front-End Exercise  
**Date**: 22 August 2025
