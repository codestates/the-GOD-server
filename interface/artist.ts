export enum ARTST_TYPE {
  Group = 'group',
  Solo = 'solo',
}

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
  type: ARTST_TYPE;
}

export interface IgroupArtist extends IsoloArtist {
  member: Imember[];
}

export type IartistList = (IgroupArtist | IsoloArtist)[];

export interface IartistUpdate {
  name?: string;
  group?: string | null;
  profileImage?: string;
}
