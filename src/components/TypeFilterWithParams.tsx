"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { TypeBasic } from "@/types/pokemon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TypeFilterWithParamsProps {
  types: TypeBasic[];
}

export default function TypeFilterWithParams({
  types,
}: TypeFilterWithParamsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticTypes, setOptimisticTypes] = useState<string[]>([]);

  const selectedTypesParam = searchParams.get("types");
  const selectedTypes = selectedTypesParam ? selectedTypesParam.split(",") : [];

  // Use optimistic types during transition, fallback to actual selected types
  const displayedTypes = isPending ? optimisticTypes : selectedTypes;

  const handleTypeToggle = (typeName: string) => {
    // Optimistically update the UI immediately
    let newSelectedTypes = [...selectedTypes];

    if (newSelectedTypes.includes(typeName)) {
      newSelectedTypes = newSelectedTypes.filter((t) => t !== typeName);
    } else {
      newSelectedTypes.push(typeName);
    }

    setOptimisticTypes(newSelectedTypes);

    // Start the transition for the actual navigation
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (newSelectedTypes.length === 0) {
        params.delete("types");
      } else {
        params.set("types", newSelectedTypes.join(","));
      }

      // Reset page to 1 when changing types
      params.delete("page");

      router.push(`?${params.toString()}`);
    });
  };

  const handleClearAll = () => {
    setOptimisticTypes([]);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("types");
      params.delete("page");
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg mb-2 sm:mb-0">
            Filter by Types
          </CardTitle>
          <div className="flex items-center gap-2">
            {displayedTypes.length > 0 && (
              <Badge variant="outline" className="text-sm">
                {displayedTypes.length} type
                {displayedTypes.length > 1 ? "s" : ""} selected
              </Badge>
            )}
            {isPending && (
              <Badge variant="secondary" className="text-sm animate-pulse">
                Filtering...
              </Badge>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              className="text-sm"
              disabled={isPending}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map((type) => {
            const isSelected = selectedTypes.includes(type.name);
            return (
              <Button
                key={type.name}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleTypeToggle(type.name)}
                className="capitalize"
              >
                {type.name}
                {isSelected && <span className="ml-1 text-xs">✓</span>}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
