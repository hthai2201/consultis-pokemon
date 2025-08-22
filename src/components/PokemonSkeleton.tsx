import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PokemonSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="text-center pb-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </CardHeader>
      <CardContent className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-3 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
        <div className="flex gap-1 justify-center">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-12"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PokemonGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <PokemonSkeleton key={i} />
      ))}
    </div>
  );
}
