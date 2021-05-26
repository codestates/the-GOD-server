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
  artistId?: string;
  images?: string[];
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

export interface Iauthor {
  userName: string;
  profileImg: string;
}
