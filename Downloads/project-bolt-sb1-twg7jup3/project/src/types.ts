export interface ToiletLocation {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  paid: boolean;
  hygieneRating: number;
  wheelchairAccessible: boolean;
  familyFriendly: boolean;
  showers: boolean;
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
}

export interface NearbyStop {
  name: string;
  distance: string;
  routes: string[];
  nextBuses: string[];
}