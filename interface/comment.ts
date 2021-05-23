export interface Icomment {
  id: string;
  userId: string;
  comment: string;
  contentId: string;
}

export interface IcommentFind {
  contentId: string;
  page?: number;
}

export interface IcommentFindResult {
  comments: Icomment[];
  totalPage: number;
  currentPage: number;
  dataPerPage: number;
}
