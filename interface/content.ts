export interface Icontent {
  id: string;
  author: {
    userId: string;
    userName: string;
    profileImage: string;
  };
  artist: {
    artistId: string;
    artistName: string;
    group: string;
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
<<<<<<< HEAD
  artist?: {
    artistId: string;
    artistName: string;
    group: string;
    profileImage: string;
  };
=======
>>>>>>> 3449e4d1ff8877da71f80f78995d19cdb1fd1af0
  images?: string[];
  artist?: {
    artistId: string;
    artistName: string;
    group: string;
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

export interface Iauthor {
  userName: string;
  profileImg: string;
}
