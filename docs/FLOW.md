# Application Flow Documentation

## Overview

This document describes the data flow, user interactions, and state management patterns in the Pokemon application, covering both SSR and CSR implementations.

## User Journey Flow

### Initial Application Load

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant PokeAPI
    participant Component

    User->>Browser: Navigate to localhost:3000
    Browser->>NextJS: Request SSR page
    NextJS->>PokeAPI: Fetch types & count (parallel)
    PokeAPI-->>NextJS: Return data
    NextJS->>Component: Render with initial data
    Component-->>Browser: Send HTML
    Browser-->>User: Display page with loading skeletons
    NextJS->>PokeAPI: Fetch Pokemon data (Suspense)
    PokeAPI-->>NextJS: Return Pokemon list
    NextJS-->>Browser: Stream Pokemon grid
    Browser-->>User: Display complete page
```

### Navigation Between SSR and CSR

```mermaid
graph TD
    A[User clicks navigation] --> B{Current page?}
    B -->|On SSR| C[Navigate to /csr]
    B -->|On CSR| D[Navigate to /]
    C --> E[TanStack Query hydration]
    D --> F[Server-side rendering]
    E --> G[Client-side data fetching]
    F --> H[Server-side data fetching]
    G --> I[Display CSR page]
    H --> I[Display SSR page]
```

## SSR Flow Details

### Initial Server-Side Rendering

```mermaid
flowchart TD
    A[Request /] --> B[Parse searchParams]
    B --> C[Extract types & page]
    C --> D[Parallel API calls]
    D --> E[fetchAllTypes]
    D --> F[getTotalPokemonCount]
    E --> G[Types data]
    F --> H[Total count]
    G --> I[Render TypeFilter]
    H --> I
    I --> J[Render header with total]
    J --> K[PokemonGridSSR with Suspense]
    K --> L[Stream skeleton while loading]
    K --> M[fetchPokemonByMultipleTypes]
    M --> N[Pokemon data]
    N --> O[Render Pokemon grid]
    O --> P[Complete page]
```

### SSR Type Filter Flow

```mermaid
sequenceDiagram
    participant User
    participant TypeFilter
    participant Router
    participant Server
    participant API

    User->>TypeFilter: Click type button
    TypeFilter->>TypeFilter: Set optimistic state
    TypeFilter->>TypeFilter: Update button UI immediately
    TypeFilter->>Router: Debounced navigation (300ms)
    Router->>Server: Request with new params
    Server->>API: Fetch filtered Pokemon
    API-->>Server: Return filtered data
    Server-->>Router: Render new page
    Router-->>TypeFilter: Update with real data
    TypeFilter-->>User: Show filtered results
```

### SSR Pagination Flow

```mermaid
graph LR
    A[User clicks pagination] --> B[Update URL params]
    B --> C[Server receives request]
    C --> D[Parse page number]
    D --> E[Fetch Pokemon for page]
    E --> F[Calculate pagination info]
    F --> G[Render new page]
    G --> H[Update browser]
```

## CSR Flow Details

### Client-Side Initial Load

```mermaid
flowchart TD
    A[Navigate to /csr] --> B[React hydration]
    B --> C[Parse URL params]
    C --> D[TanStack Query setup]
    D --> E[useQuery for types]
    D --> F[useQuery for Pokemon]
    E --> G{Types cached?}
    F --> H{Pokemon cached?}
    G -->|Yes| I[Return cached types]
    G -->|No| J[Fetch from API]
    H -->|Yes| K[Return cached Pokemon]
    H -->|No| L[Fetch from API]
    J --> M[Cache types data]
    L --> N[Cache Pokemon data]
    I --> O[Render components]
    K --> O
    M --> O
    N --> O
```

### CSR Type Filter Flow

```mermaid
sequenceDiagram
    participant User
    participant TypeFilter
    participant TanStack
    participant Cache
    participant API

    User->>TypeFilter: Click type button
    TypeFilter->>TypeFilter: Optimistic UI update
    TypeFilter->>TanStack: Update query key
    TanStack->>Cache: Check cache for new key
    Cache-->>TanStack: Cache miss
    TanStack->>API: Fetch filtered Pokemon
    TypeFilter-->>User: Show loading state
    API-->>TanStack: Return data
    TanStack->>Cache: Update cache
    TanStack-->>TypeFilter: Update data
    TypeFilter-->>User: Show filtered results
```

### CSR Error Handling Flow

```mermaid
graph TD
    A[API Request] --> B{Request successful?}
    B -->|Yes| C[Update cache]
    B -->|No| D[Error state]
    C --> E[Render data]
    D --> F[Show error message]
    F --> G[Retry button]
    G --> H[User clicks retry]
    H --> A
```

## State Management Flow

### URL State Management

```mermaid
graph LR
    A[User Action] --> B[Update URL params]
    B --> C[Browser history change]
    C --> D{SSR or CSR?}
    D -->|SSR| E[Server re-render]
    D -->|CSR| F[Query key change]
    E --> G[New page render]
    F --> H[Cache lookup/API call]
    G --> I[Updated UI]
    H --> I
```

### Optimistic Updates Flow

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant OptimisticState
    participant ServerState

    User->>Component: Perform action
    Component->>OptimisticState: Update immediately
    Component->>Component: Show optimistic UI
    Component->>ServerState: Trigger server update
    ServerState-->>Component: Return real data
    Component->>Component: Sync optimistic with real
    Component-->>User: Final UI state
```

## Performance Optimization Flow

### Debouncing Flow

```mermaid
graph TD
    A[User Action] --> B[Start debounce timer]
    B --> C{New action within 300ms?}
    C -->|Yes| D[Clear previous timer]
    C -->|No| E[Execute navigation]
    D --> B
    E --> F[API request]
```

### Caching Strategy Flow

```mermaid
graph LR
    A[API Request] --> B{Cache exists?}
    B -->|Yes| C{Stale time exceeded?}
    B -->|No| D[Fetch from API]
    C -->|No| E[Return cached data]
    C -->|Yes| F[Background refetch]
    D --> G[Cache new data]
    F --> H[Update cache]
    G --> E
    H --> E
```

## Error Flow Scenarios

### API Failure Flow

```mermaid
graph TD
    A[API Request] --> B{Network available?}
    B -->|No| C[Network Error]
    B -->|Yes| D{API response OK?}
    D -->|No| E[API Error]
    D -->|Yes| F[Success]
    C --> G[Show network error]
    E --> H[Show API error]
    F --> I[Display data]
    G --> J[Retry option]
    H --> J
    J --> K[User retries]
    K --> A
```

### Hydration Error Flow

```mermaid
graph TD
    A[Server HTML] --> B[Client hydration]
    B --> C{HTML matches?}
    C -->|Yes| D[Successful hydration]
    C -->|No| E[Hydration mismatch]
    D --> F[Interactive app]
    E --> G[Suppress warnings]
    G --> H[Re-render on client]
    H --> F
```

## Component Interaction Flow

### Pokemon Card Interaction

```mermaid
sequenceDiagram
    participant User
    participant PokemonCard
    participant Image
    participant Types

    User->>PokemonCard: Hover over card
    PokemonCard->>PokemonCard: Show hover effects
    PokemonCard->>Image: Load optimized image
    Image-->>PokemonCard: Image loaded
    PokemonCard->>Types: Display type badges
    Types-->>PokemonCard: Colored badges
    PokemonCard-->>User: Visual feedback
```

### Type Filter Interaction

```mermaid
graph TD
    A[User hovers button] --> B[Show hover state]
    B --> C[User clicks button]
    C --> D[Button disabled]
    D --> E[Optimistic update]
    E --> F[Show loading badge]
    F --> G[API request]
    G --> H[Response received]
    H --> I[Enable button]
    I --> J[Hide loading badge]
    J --> K[Show results]
```

## Data Synchronization Flow

### SSR to CSR Navigation

```mermaid
sequenceDiagram
    participant SSR
    participant Browser
    participant CSR
    participant TanStack

    SSR->>Browser: Rendered page with data
    Browser->>CSR: User navigates to /csr
    CSR->>TanStack: Initialize queries
    TanStack->>TanStack: Check for cached data
    TanStack-->>CSR: No cache (different keys)
    CSR->>API: Fetch fresh data
    API-->>CSR: Return data
    CSR-->>Browser: Render CSR page
```

### URL Parameter Synchronization

```mermaid
graph LR
    A[URL params change] --> B{Page type?}
    B -->|SSR| C[Server reads searchParams]
    B -->|CSR| D[Client reads URLSearchParams]
    C --> E[Pass to components as props]
    D --> F[Use in useQuery keys]
    E --> G[Component render]
    F --> G
```

## Loading State Flow

### Progressive Loading (SSR)

```mermaid
graph TD
    A[Page request] --> B[Server renders shell]
    B --> C[Send initial HTML]
    C --> D[Show skeleton]
    D --> E[Suspense boundary triggers]
    E --> F[Fetch Pokemon data]
    F --> G[Stream real content]
    G --> H[Replace skeleton]
```

### Loading States (CSR)

```mermaid
graph LR
    A[Query starts] --> B[isLoading: true]
    B --> C[Show skeleton]
    C --> D[Data received]
    D --> E[isLoading: false]
    E --> F[Show content]

    G[Background refetch] --> H[isFetching: true]
    H --> I[Show subtle indicator]
    I --> J[Fresh data received]
    J --> K[isFetching: false]
    K --> L[Hide indicator]
```

## Real-time User Experience Flow

### Instant Feedback Loop

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant OptimisticState
    participant ServerState

    User->>UI: Click action
    UI->>OptimisticState: Immediate update
    UI-->>User: Instant visual feedback
    UI->>ServerState: Background process
    Note over ServerState: 300ms debounce
    ServerState-->>UI: Real data
    UI->>UI: Reconcile states
    UI-->>User: Final state
```

This flow documentation provides a comprehensive view of how data moves through the application, how users interact with different components, and how the system maintains consistency across different rendering strategies.
