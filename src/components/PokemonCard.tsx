"use client";

import Image from "next/image";
import { Pokemon } from "@/types/pokemon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  // Use the showdown sprite if available, otherwise fall back to front_default
  const imageUrl =
    pokemon.sprites.other?.showdown?.front_default ||
    pokemon.sprites.front_default;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg capitalize">{pokemon.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {imageUrl && (
          <div className="relative w-24 h-24 mx-auto mb-3">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain"
              sizes="96px"
              unoptimized={imageUrl.endsWith(".gif")}
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-2">
          Number: {pokemon.id}
        </p>

        <div className="flex flex-wrap gap-1 justify-center">
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              variant="secondary"
              className={getTypeColor(type.type.name)}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: "bg-gray-200 text-gray-800",
    fighting: "bg-red-200 text-red-800",
    flying: "bg-blue-200 text-blue-800",
    poison: "bg-purple-200 text-purple-800",
    ground: "bg-yellow-200 text-yellow-800",
    rock: "bg-stone-200 text-stone-800",
    bug: "bg-green-200 text-green-800",
    ghost: "bg-indigo-200 text-indigo-800",
    steel: "bg-slate-200 text-slate-800",
    fire: "bg-orange-200 text-orange-800",
    water: "bg-cyan-200 text-cyan-800",
    grass: "bg-emerald-200 text-emerald-800",
    electric: "bg-amber-200 text-amber-800",
    psychic: "bg-pink-200 text-pink-800",
    ice: "bg-sky-200 text-sky-800",
    dragon: "bg-violet-200 text-violet-800",
    dark: "bg-zinc-200 text-zinc-800",
    fairy: "bg-rose-200 text-rose-800",
    stellar: "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800",
    unknown: "bg-gray-100 text-gray-600",
  };

  return colors[type] || "bg-gray-200 text-gray-800";
}
