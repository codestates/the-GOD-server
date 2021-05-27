export interface Iartist {
  id: string;
  name: string;
  group: string | null;
  profileImage: string;
}

export interface IartistUpdate {
  name?: string;
  group?: string | null;
  profileImage?: string;
}
