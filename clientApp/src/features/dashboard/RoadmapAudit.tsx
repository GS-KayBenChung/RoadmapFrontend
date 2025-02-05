import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem, TextField, IconButton, InputAdornment } from "@mui/material";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import AuditTable from "../../app/layout/AuditTable";

const PaginationConfig = {
  defaultPage: parseInt(import.meta.env.VITE_DEFAULT_PAGE || "1", 10),
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10", 10),
  defaultAuditSortBy: import.meta.env.VITE_DEFAULT_AUDIT_SORT_BY || "CreatedAt",
  defaultAsc: parseInt(import.meta.env.VITE_DEFAULT_ASC || "0", 10),
};

export default observer(function RoadmapAudit() {
  const { roadmapStore } = useStore();
  const { logs, loadLogs, loadingInitial } = roadmapStore;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(PaginationConfig.defaultPageSize);
  const [sortBy, setSortBy] = useState<string>(PaginationConfig.defaultAuditSortBy);
  const [asc, setAsc] = useState<number>(PaginationConfig.defaultAsc);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get("filter") || "";
    const searchParam = queryParams.get("search") || "";
    const dateParam = queryParams.get("date") || "";
    const pageParam = parseInt(queryParams.get("page") || PaginationConfig.defaultPage.toString(), 10);
    const pageSizeParam = parseInt(queryParams.get("pageSize") || PaginationConfig.defaultPageSize.toString(), 10);
    const sortByParam = queryParams.get("sortBy") || PaginationConfig.defaultAuditSortBy;
    const ascParam = parseInt(queryParams.get("asc") || PaginationConfig.defaultAsc.toString(), 10);

    setFilter(filterParam);
    setSearch(searchParam);
    setSelectedDate(dateParam);
    setPageSize(pageSizeParam);
    setSortBy(sortByParam);
    setAsc(ascParam);

    loadLogs(filterParam, searchParam, dateParam, pageParam, pageSizeParam, sortByParam, ascParam);
  }, [location.search, loadLogs]);

  const handleFilterChange = (event: any) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    updateQueryAndLoadLogs({
      filter: selectedFilter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy,
      asc,
    });
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const normalizedSearch = search.trim().toLowerCase();
      setSearch(normalizedSearch);
      updateQueryAndLoadLogs({
        filter,
        search: normalizedSearch,
        date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
        page: PaginationConfig.defaultPage,
        pageSize,
        sortBy,
        asc,
      });
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("search");
    navigate(`?${queryParams.toString()}`);
    loadLogs(filter, "");
  };

  const handlePageChange = (_: any, newPage: number) => {
    updateQueryAndLoadLogs({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: newPage,
      pageSize,
      sortBy,
      asc,
    });
  };

  const handleSortByChange = (event: any) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    updateQueryAndLoadLogs({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy: newSortBy,
      asc,
    });
  };

  const handleAscDescChange = (event: any) => {
    const newAsc = parseInt(event.target.value);
    setAsc(newAsc);
    updateQueryAndLoadLogs({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy,
      asc: newAsc,
    });
  };

  const handleDateChange = (event: any) => {
    const date = event.target.value;
    setSelectedDate(date);

    updateQueryAndLoadLogs({
      filter,
      search,
      date: date ? new Date(date).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy,
      asc,
    });
  };

  const handlePageSize = (event: any) => {
    const updatedPageSize = parseInt(event.target.value, 10);
    setPageSize(updatedPageSize);
    updateQueryAndLoadLogs({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize: updatedPageSize,
      sortBy,
      asc,
    });
  };

  const updateQueryAndLoadLogs = ({
    filter,
    search,
    date,
    page,
    pageSize,
    sortBy,
    asc,
  }: {
    filter?: string;
    search?: string;
    date?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    asc?: number;
  }) => {
    const queryParams = new URLSearchParams({
      ...(filter && { filter }),
      ...(search && { search }),
      ...(date && { date }),
      page: (page || PaginationConfig.defaultPage).toString(),
      pageSize: (pageSize || PaginationConfig.defaultPageSize).toString(),
      sortBy: sortBy || PaginationConfig.defaultAuditSortBy,
      asc: (asc || PaginationConfig.defaultAsc).toString()
    }).toString();
    navigate(`?${queryParams}`);
    loadLogs(
      filter || undefined,
      search || undefined,
      date || undefined,
      page || PaginationConfig.defaultPage,
      pageSize || PaginationConfig.defaultPageSize,
      sortBy || PaginationConfig.defaultAuditSortBy,
      asc || PaginationConfig.defaultAsc
    );
  };

  // if (roadmapStore.loadingInitial) return <LoadingComponent />;

  return (
    <>
      <NavBar />
      <div className="p-12">
        <ScreenTitleName title="Audit Trails" />
        <div className="my-4">
          
          <div className="flex">
            <TextField
              margin="normal"
              type="date"
              label="Date"
              value={selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              onKeyDown={(e) => e.preventDefault()}
              InputLabelProps={{ shrink: true }}
              className="w-full sm:w-[200px]"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
     
            <div className="flex gap-4 items-center">
              <FormControl variant="outlined" size="small" className="sm:w-[200px] w-full">
                <InputLabel>Filter By Action</InputLabel>
                <Select value={filter} onChange={handleFilterChange} label="Filter By Action">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="created">Created</MenuItem>
                  <MenuItem value="updated">Updated</MenuItem>
                  <MenuItem value="deleted">Deleted</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Search"
                value={search}
                onChange={(e) => {
                  if (e.target.value === '') return;
                  setSearch(e.target.value.trim());
                }}
                onKeyDown={handleSearchKeyDown}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {search ? (
                        <IconButton onClick={handleClearSearch} edge="end">
                          <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </IconButton>
                      ) : (
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </InputAdornment>
                  ),
                }}
                className="sm:w-[200px] w-full"
              />
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <Select value={sortBy} onChange={handleSortByChange}>
                  <MenuItem value="name">Username</MenuItem>
                  <MenuItem value="activityAction">Action</MenuItem>
                  <MenuItem value="CreatedAt">Date</MenuItem>
                </Select>
                <Select value={asc} onChange={handleAscDescChange}>
                  <MenuItem value={1}>Ascending</MenuItem>
                  <MenuItem value={0}>Descending</MenuItem>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <Select value={pageSize} onChange={handlePageSize} className="w-[80px]">
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="15">15</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <AuditTable filter={filter} search={search} selectedDate={selectedDate} pageSize={pageSize} sortBy={sortBy} asc={asc} page={pageSize} onPageChange={setPageSize} />
      </div>
    </>
  );
});
