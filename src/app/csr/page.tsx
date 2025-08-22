"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PokemonCard from "@/components/PokemonCard";
import TypeFilterWithParams from "@/components/TypeFilterWithParams";
import PaginationWithParams from "@/components/PaginationWithParams";
import Navigation from "@/components/Navigation";
import { PokemonGridSkeleton } from "@/components/PokemonSkeleton";
import {
  fetchAllTypesClient,
  fetchPokemonByMultipleTypesClient,
  getTotalPokemonCountClient,
} from "@/lib/pokemon-api";
import { Pokemon, TypeDetail } from "@/types/pokemon";

const ITEMS_PER_PAGE = 24;

function PokemonListCSR() {
  const searchParams = useSearchParams();
  const selectedTypesParam = searchParams.get("types");
  const selectedTypes = selectedTypesParam ? selectedTypesParam.split(",") : [];
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Fetch types
  const {
    data: typesData,
    isLoading: typesLoading,
    error: typesError,
  } = useQuery({
    queryKey: ["pokemon-types"],
    queryFn: fetchAllTypesClient,
  });

  // Fetch Pokemon data based on type filter
  const {
    data: pokemonData,
    isLoading: pokemonLoading,
    error: pokemonError,
  } = useQuery({
    queryKey: ["pokemon", selectedTypes, currentPage],
    queryFn: async () => {
      return await fetchPokemonByMultipleTypesClient(
        selectedTypes,
        currentPage,
        ITEMS_PER_PAGE
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (typesError || pokemonError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Failed to load Pokemon data. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {typesData && <TypeFilterWithParams types={typesData.results} />}

      {(typesLoading || pokemonLoading) && (
        <PokemonGridSkeleton count={ITEMS_PER_PAGE} />
      )}

      {pokemonData && !pokemonLoading && (
        <>
          {pokemonData.pokemon.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {pokemonData.pokemon.map((pokemon: Pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>

              <PaginationWithParams
                currentPage={currentPage}
                totalCount={pokemonData.totalCount}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Pokemon match your filters
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your type selections to see more results.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CSRPageContent() {
  const searchParams = useSearchParams();
  const selectedTypesParam = searchParams.get("types");
  const selectedTypes = selectedTypesParam ? selectedTypesParam.split(",") : [];

  // Query for total count
  const { data: totalCount } = useQuery({
    queryKey: ["total-pokemon-count"],
    queryFn: getTotalPokemonCountClient,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Consultis</h1>
        <h2 className="text-xl text-gray-600 mb-4">
          Welcome to Pokemon world (CSR)
        </h2>
        <p className="text-lg text-gray-700">
          Total: {totalCount || "Loading..."}
          {selectedTypes.length > 0 && (
            <span className="text-sm text-blue-600 block mt-1">
              Filtering by: {selectedTypes.join(", ")}
            </span>
          )}
        </p>
      </header>

      <PokemonListCSR />
    </div>
  );
}

export default function CSRPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <Suspense
        fallback={
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        }
      >
        <CSRPageContent />
      </Suspense>
    </main>
  );
}
