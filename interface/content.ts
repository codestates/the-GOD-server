export interface Icontent {
  id: string;
  userId: string;
  title: string;
  artistId: string;
  images: string[];
  date: {
    start: string;
    end: string;
  };
  time: {
    start: string;
    end: string;
  };
  address: {
    storeName: string;
    roadAddress: string;
    lat: number;
    lng: number;
  };
  mobile: string;
  description: string;
  tegs: string[];
  perks: any;
}

export interface IcontentUpdate {
  title?: string;
  artistId?: string;
  images?: string[];
  date?: {
    start: string;
    end: string;
  };
  time?: {
    start: string;
    end: string;
  };
  address?: {
    storeName: string;
    roadAddress: string;
    lat: number;
    lng: number;
  };
  mobile?: string;
  description?: string;
  tegs?: string[];
  perks?: any;
}
