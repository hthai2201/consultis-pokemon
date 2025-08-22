export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      showdown: {
        front_default: string;
      };
    };
  };
  types: PokemonType[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface TypeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TypeBasic[];
}

export interface TypeBasic {
  name: string;
  url: string;
}

export interface TypeDetail {
  id: number;
  name: string;
  pokemon: {
    pokemon: PokemonBasic;
    slot: number;
  }[];
}
