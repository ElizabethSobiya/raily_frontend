export interface Station {
  code: string;
  name: string;
  city: string | null;
  state: string | null;
  latitude: string | null;
  longitude: string | null;
  zone: string | null;
  isJunction: boolean;
}

export interface StationSearchResult {
  code: string;
  name: string;
  city: string | null;
}
