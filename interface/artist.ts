export interface Iartist {
  id: string;
  name: string;
  group: string | null;
  profileImage: string | null;
}

export interface IartistUpdate {
  name?: string;
  group?: string | null;
  profileImage?: string | null;
}
