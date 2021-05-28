export interface Icontent {
  id: string;
  author: {
    id: string;
    name: string;
    profileImage: string;
  };
  artist: {
    id: string;
    name: string;
    group: string | null;
    profileImage: string;
  };
  title: string;
  images: string[];
  date: {
    start: string;
    end: string;
  };
  time: {
    open: string;
    close: string;
  };
  address: {
    storeName: string;
    roadAddress: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  mobile: string;
  description: string;
  tags: string[];
  perks: any;
}

export interface IcontentUpdate {
  title?: string;
  images?: string[];
  artist?: {
    id: string;
    name: string;
    group: string | null;
    profileImage: string;
  };
  date?: {
    start: string;
    end: string;
  };
  time?: {
    open: string;
    close: string;
  };
  address?: {
    storeName: string;
    roadAddress: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  mobile?: string;
  description?: string;
  tags?: string[];
  perks?: any;
}

export interface IcontentFind {
  artistId: string;
  location: string;
  date: {
    start: string;
    end: string;
  };
  page?: number;
}

export interface IcontentFindResult {
  contents: Icontent[];
  totalPage: number;
  currentPage: number;
  dataPerPage: number;
}
