export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EpisodeFilter {
  page: number;
  name?: string;
}
