import TypeFilterWithParams from "@/components/TypeFilterWithParams";
import Navigation from "@/components/Navigation";
import PokemonGridSSR from "@/components/PokemonGridSSR";
import { fetchAllTypes, getTotalPokemonCount } from "@/lib/pokemon-api";

const ITEMS_PER_PAGE = 24;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ types?: string; page?: string }>;
}) {
  try {
    const params = await searchParams;
    const selectedTypesParam = params.types;
    const selectedTypes = selectedTypesParam
      ? selectedTypesParam.split(",")
      : [];
    const currentPage = parseInt(params.page || "1");

    // Fetch types data and total count in parallel
    const [typesResponse, totalCount] = await Promise.all([
      fetchAllTypes(),
      getTotalPokemonCount(),
    ]);

    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              IT Consultis
            </h1>
            <h2 className="text-xl text-gray-600 mb-4">
              Welcome to Pokemon world (SSR)
            </h2>
            <p className="text-lg text-gray-700">
              Total: {totalCount}
              {selectedTypes.length > 0 && (
                <span className="text-sm text-blue-600 block mt-1">
                  Filtering by: {selectedTypes.join(", ")}
                </span>
              )}
            </p>
          </header>

          <TypeFilterWithParams types={typesResponse.results} />

          <PokemonGridSSR
            selectedTypes={selectedTypes}
            currentPage={currentPage}
          />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading initial data:", error);

    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to load Pokemon data
          </h1>
          <p className="text-gray-600 mb-4">
            Please check your internet connection and try again.
          </p>
        </div>
      </main>
    );
  }
}
