export interface Icomment {
  id: string;
  user: IcommentWriter;
  comment: string;
  contentId: string;
}

export interface IcommentFind {
  id: string;
  page?: number;
}

export interface IcommentFindResult {
  comments: Icomment[];
  totalPage: number;
  currentPage: number;
  dataPerPage: number;
}

export interface IcommentWriter {
  id: string;
  name: string;
}
