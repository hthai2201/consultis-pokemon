import { Suspense } from "react";
import PokemonCard from "@/components/PokemonCard";
import PaginationWithParams from "@/components/PaginationWithParams";
import { PokemonGridSkeleton } from "@/components/PokemonSkeleton";
import { fetchPokemonByMultipleTypesClient } from "@/lib/pokemon-api";

const ITEMS_PER_PAGE = 24;

interface PokemonGridSSRProps {
  selectedTypes: string[];
  currentPage: number;
}

async function PokemonGrid({
  selectedTypes,
  currentPage,
}: PokemonGridSSRProps) {
  // Fetch Pokemon data based on selected types
  const pokemonResult = await fetchPokemonByMultipleTypesClient(
    selectedTypes,
    currentPage,
    ITEMS_PER_PAGE
  );

  const pokemonData = pokemonResult.pokemon;
  const filteredTotalCount = pokemonResult.totalCount;

  if (pokemonData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Pokemon match your filters
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your type selections to see more results.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {pokemonData.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <PaginationWithParams
        currentPage={currentPage}
        totalCount={filteredTotalCount}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </>
  );
}

export default function PokemonGridSSR({
  selectedTypes,
  currentPage,
}: PokemonGridSSRProps) {
  return (
    <Suspense
      fallback={
        <>
          <PokemonGridSkeleton count={ITEMS_PER_PAGE} />
          <div className="mt-8 text-center">
            <div className="animate-pulse bg-gray-200 h-10 w-64 mx-auto rounded"></div>
          </div>
        </>
      }
    >
      <PokemonGrid selectedTypes={selectedTypes} currentPage={currentPage} />
    </Suspense>
  );
}
