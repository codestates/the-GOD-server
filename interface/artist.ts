export interface Iartist {
  id: string;
  name: string;
  group: string | null;
  profileImage: string;
}

export interface Imember {
  id: string;
  name: string;
  profileImage: string;
}

export interface IsoloArtist extends Imember {
  type: 'group' | 'solo';
}

export interface IgroupArtist extends IsoloArtist {
  type: 'group';
  member: Imember[];
}

export type Artists = (IgroupArtist | IsoloArtist)[];

export interface IartistUpdate {
  name?: string;
  group?: string | null;
  profileImage?: string;
}
