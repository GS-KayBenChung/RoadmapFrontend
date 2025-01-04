import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function RoadmapAudit() {
  const { roadmapStore } = useStore();
  const { logs, loadLogs, loadingInitial } = roadmapStore;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("CreatedAt");
  const [asc, setAsc] = useState<number>(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get("filter") || "";
    const searchParam = queryParams.get("search") || "";
    const dateParam = queryParams.get("date") || "";
    const pageParam = parseInt(queryParams.get("page") || "1", 10);
    const pageSizeParam = parseInt(queryParams.get("pageSize") || "10", 10);
    const sortByParam = queryParams.get("sortBy") || "CreatedAt";
    const ascParam = parseInt(queryParams.get("asc") || "1", 10);

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
      page: 1,
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
        page: 1,
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
      page: 1,
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
      page: 1,
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
      page: 1,
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
      page: 1,
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
      page: (page || 1).toString(),
      pageSize: (pageSize || 10).toString(),
      sortBy: sortBy || "Date",
      asc: (asc || 0).toString()
    }).toString();
    navigate(`?${queryParams}`);
    loadLogs(
      filter || undefined,
      search || undefined,
      date || undefined,
      page || 1,
      pageSize || 10,
      sortBy || "Date",
      asc || 1
    );
  };

  if (loadingInitial) return <LoadingComponent />;

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

        <TableContainer className="shadow-md rounded-lg overflow-hidden min-w-full">
          <Table className="text-sm">
            <TableHead>
              <TableRow className="border-black border-2">
                <TableCell className="font-semibold text-gray-700 text-right">UserName</TableCell>
                <TableCell className="font-semibold text-gray-700 text-right">Action</TableCell>
                <TableCell className="font-semibold text-gray-700 text-right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="border-2 border-black">
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.logId} className="hover:bg-gray-100">
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>{log.activityAction}</TableCell>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ): (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No Audit Logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex justify-center mt-6">
          <Pagination
            count={roadmapStore.totalPages} 
            page={roadmapStore.currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </>
  );
});