export interface PaginatedRoadmap<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}