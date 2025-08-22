import {
  Pokemon,
  PokemonListResponse,
  TypeListResponse,
  TypeDetail,
} from "@/types/pokemon";

const POKEMON_API_BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  limit = 24,
  offset = 0
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${POKEMON_API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list");
  }

  return response.json();
}

export async function fetchPokemonDetails(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKEMON_API_BASE}/pokemon/${id}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with id ${id}`);
  }

  return response.json();
}

export async function fetchAllTypes(): Promise<TypeListResponse> {
  const response = await fetch(`${POKEMON_API_BASE}/type`, {
    next: { revalidate: 86400 }, // Cache for 24 hours (types rarely change)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon types");
  }

  return response.json();
}

export async function fetchPokemonByType(
  typeName: string
): Promise<TypeDetail> {
  const response = await fetch(`${POKEMON_API_BASE}/type/${typeName}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon of type ${typeName}`);
  }

  return response.json();
}

export async function fetchPokemonWithDetails(
  limit = 24,
  offset = 0
): Promise<Pokemon[]> {
  const listResponse = await fetchPokemonList(limit, offset);

  // Extract Pokemon IDs from URLs
  const pokemonPromises = listResponse.results.map((pokemon) => {
    const id = parseInt(pokemon.url.split("/").slice(-2, -1)[0]);
    return fetchPokemonDetails(id);
  });

  return Promise.all(pokemonPromises);
}

// Client-side API functions (without Next.js caching)
export async function fetchPokemonListClient(
  limit = 24,
  offset = 0
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${POKEMON_API_BASE}/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list");
  }

  return response.json();
}

export async function fetchPokemonDetailsClient(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKEMON_API_BASE}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with id ${id}`);
  }

  return response.json();
}

export async function fetchAllTypesClient(): Promise<TypeListResponse> {
  const response = await fetch(`${POKEMON_API_BASE}/type`);

  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon types");
  }

  return response.json();
}

export async function fetchPokemonByTypeClient(
  typeName: string
): Promise<TypeDetail> {
  const response = await fetch(`${POKEMON_API_BASE}/type/${typeName}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon of type ${typeName}`);
  }

  return response.json();
}

export async function fetchPokemonWithDetailsClient(
  limit = 24,
  offset = 0
): Promise<Pokemon[]> {
  const listResponse = await fetchPokemonListClient(limit, offset);

  // Extract Pokemon IDs from URLs
  const pokemonPromises = listResponse.results.map((pokemon) => {
    const id = parseInt(pokemon.url.split("/").slice(-2, -1)[0]);
    return fetchPokemonDetailsClient(id);
  });

  return Promise.all(pokemonPromises);
}

// Function to get total Pokemon count dynamically
export async function getTotalPokemonCount(): Promise<number> {
  const response = await fetch(`${POKEMON_API_BASE}/pokemon?limit=1&offset=0`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon count");
  }
  const data: PokemonListResponse = await response.json();
  return data.count;
}

export async function getTotalPokemonCountClient(): Promise<number> {
  const response = await fetch(`${POKEMON_API_BASE}/pokemon?limit=1&offset=0`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon count");
  }
  const data: PokemonListResponse = await response.json();
  return data.count;
}

// Function to filter Pokemon by multiple types
export async function fetchPokemonByMultipleTypesClient(
  typeNames: string[],
  page = 1,
  limit = 24
): Promise<{ pokemon: Pokemon[]; totalCount: number }> {
  if (typeNames.length === 0) {
    const offset = (page - 1) * limit;
    const pokemon = await fetchPokemonWithDetailsClient(limit, offset);
    const totalCount = await getTotalPokemonCountClient();
    return { pokemon, totalCount };
  }

  // Fetch all Pokemon for each type
  const typePromises = typeNames.map((typeName) =>
    fetchPokemonByTypeClient(typeName)
  );
  const typeResults = await Promise.all(typePromises);

  // Find Pokemon that have ALL specified types
  let intersection = typeResults[0].pokemon.map((p) => ({
    id: parseInt(p.pokemon.url.split("/").slice(-2, -1)[0]),
    pokemon: p.pokemon,
  }));

  for (let i = 1; i < typeResults.length; i++) {
    const currentTypePokemon = typeResults[i].pokemon.map((p) =>
      parseInt(p.pokemon.url.split("/").slice(-2, -1)[0])
    );
    intersection = intersection.filter((p) =>
      currentTypePokemon.includes(p.id)
    );
  }

  const totalCount = intersection.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedIds = intersection.slice(startIndex, endIndex);

  // Fetch detailed data for paginated Pokemon
  const detailedPokemon = await Promise.all(
    paginatedIds.map((p) => fetchPokemonDetailsClient(p.id))
  );

  return { pokemon: detailedPokemon, totalCount };
}
