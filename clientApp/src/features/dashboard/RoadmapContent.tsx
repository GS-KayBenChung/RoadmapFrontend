import { useNavigate } from "react-router-dom";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NavBar from "../../app/layout/NavBar";
import RoadmapCard from "../../app/layout/RoadmapCard";
import { useStore } from "../../app/stores/store";
import ScreenTitleName from "../ScreenTitleName";
import { FaTh, FaListUl } from "react-icons/fa";

const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

const PaginationConfig = {
  defaultPage: parseInt(import.meta.env.VITE_DEFAULT_PAGE || "1", 10),
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10", 10),
  defaultRoadmapSortBy: import.meta.env.VITE_DEFAULT_ROADMAP_SORT_BY || "UpdatedAt",
  defaultAsc: parseInt(import.meta.env.VITE_DEFAULT_ASC || "0", 10),
  pageSizeOptions: (import.meta.env.VITE_PAGE_SIZE_OPTIONS || "10")
};

export default observer(function RoadmapsPage() {
  const { roadmapStore } = useStore();
  const { loadRoadmaps, roadmaps, loadingInitial, dashboardStats } = roadmapStore;
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  // const [viewType, setViewType] = useState<string>("card");
  const [viewType, setViewType] = useState<string>(() => {
    return localStorage.getItem("roadmapViewType") || "card";
  });
  
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [pageSize, setPageSize] =useState<number>(PaginationConfig.defaultPageSize)
  const [sortBy, setSortBy] = useState(PaginationConfig.defaultRoadmapSortBy);
  const [asc, setAsc] = useState(PaginationConfig.defaultAsc);
  const pageSizeOptions = [5, 10, 20, 50];
  

  const navigate = useNavigate();
  const location = useLocation();

  const [loadingTable, setLoadingTable] = useState<boolean>(false);


  const handleClear = () => {
    setSearch("");
    updateQueryAndLoadRoadmaps({
      filter,
      search: "",
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy,
      asc,
    });
  };

  const updateQueryAndLoadRoadmaps = ({
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
    setLoadingTable(true); 
  
    const queryParams = new URLSearchParams({
      ...(filter && { filter }),
      ...(search && { search }),
      ...(date && { date }),
      page: (page || PaginationConfig.defaultPage).toString(),
      pageSize: (pageSize || PaginationConfig.defaultPageSize).toString(),
      sortBy: sortBy || PaginationConfig.defaultRoadmapSortBy,
      asc: (asc || PaginationConfig.defaultAsc).toString(),
    }).toString();
    
    navigate(`?${queryParams}`);
    
    loadRoadmaps(
      filter || undefined,
      search || undefined,
      date || undefined,
      page || PaginationConfig.defaultPage,
      pageSize || PaginationConfig.defaultPageSize,
      sortBy || PaginationConfig.defaultRoadmapSortBy,
      asc || PaginationConfig.defaultAsc
    ).finally(() => setLoadingTable(false)); 
  };
  
  const handleViewTypeChange = (type: string) => {
    setViewType(type);
    localStorage.setItem("roadmapViewType", type);
  };
  
  const handleFilterChange = (event: any) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    updateQueryAndLoadRoadmaps({
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
      if (normalizedSearch === "") {return}
      setSearch(normalizedSearch);
      updateQueryAndLoadRoadmaps({
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
  
  const handleDateChange = (event: any) => {
    const date = event.target.value;
    setSelectedDate(date);

    updateQueryAndLoadRoadmaps({
      filter,
      search,
      date: date ? new Date(date).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy,
      asc,
    });
  };
  
  const handlePageChange = (_: any, newPage: number) => {
    updateQueryAndLoadRoadmaps({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: newPage,
      pageSize,
      sortBy,
      asc,
    });
  };
  
  const handlePageSize = (event: any) => {
    const updatedPageSize = parseInt(event.target.value, 10);
    setPageSize(updatedPageSize);
    updateQueryAndLoadRoadmaps({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize: updatedPageSize,
      sortBy,
      asc,
    });
  };
  
  const handleSortByChange = (event: any) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    updateQueryAndLoadRoadmaps({
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
    updateQueryAndLoadRoadmaps({
      filter,
      search,
      date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page: PaginationConfig.defaultPage,
      pageSize,
      sortBy,
      asc: newAsc,
    });
  };
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get("filter") || "";
    const searchParam = queryParams.get("search") || "";
    const dateParam = queryParams.get("date") || "";
    const pageParam = parseInt(queryParams.get("page") || PaginationConfig.defaultPage.toString(), 10);
    const pageSizeParam = parseInt(queryParams.get("pageSize") || PaginationConfig.defaultPageSize.toString(), 10);
    const sortByParam = queryParams.get("sortBy") || PaginationConfig.defaultRoadmapSortBy;
    const ascParam = parseInt(queryParams.get("asc") || PaginationConfig.defaultAsc.toString(), 10);
    setFilter(filterParam);
    setSearch(searchParam);
    setSelectedDate(dateParam);
    setPageSize(pageSizeParam);
    setSortBy(sortByParam);
    setAsc(ascParam);

    setLoadingTable(true);

    loadRoadmaps(filterParam, searchParam, dateParam, pageParam, pageSizeParam, sortByParam, ascParam)
    .finally(() => setLoadingTable(false)); 
  }, [location.search, loadRoadmaps, dashboardStats]);
  
  return (
    <>
      <NavBar />
      <div className="py-16">
        <ScreenTitleName title="ROADMAPS" />
        <div className="space-y-4">
          <div className="w-full sm:w-auto mx-16">
            <div className="flex items-center justify-between w-full">
              <TextField
                margin="normal"
                type="date"
                label="Date"
                value={selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                className="w-full sm:w-[200px]"
              />
              <div className="text-gray-600">
                {roadmapStore.totalCount} results found
              </div>
              </div>
          </div>
          
          <div className="mx-16">
            <div className="flex items-center justify-between w-full">
              <FormControl variant="outlined" size="small" className="w-full sm:w-52">
                <InputLabel>Filter By</InputLabel>
                <Select value={filter} onChange={handleFilterChange} label="Filter By">
                  <MenuItem value="">All  ({roadmapStore.dashboardStats.totalRoadmaps})</MenuItem>
                  <MenuItem value="draft">Draft ({roadmapStore.dashboardStats.draftRoadmaps}) </MenuItem>
                  <MenuItem value="published">Published ({roadmapStore.dashboardStats.publishedRoadmaps})</MenuItem>
                  <MenuItem value="completed">Completed ({roadmapStore.dashboardStats.completedRoadmaps})</MenuItem>
                  <MenuItem value="neardue">Near Due ({roadmapStore.dashboardStats.nearDueRoadmaps})</MenuItem>
                  <MenuItem value="overdue">Overdue ({roadmapStore.dashboardStats.overdueRoadmaps})</MenuItem>
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
                        <IconButton onClick={handleClear} edge="end">
                          <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </IconButton>
                      ) : (
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </InputAdornment>
                  ),
                }}
                className="sm:max-w-[400px]"
              />

              <div className="flex gap-4 ml-auto">
                <NavLink to="/roadmapCreate">
                  <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-sm">
                    Create Roadmap
                  </button>
                </NavLink>
                
                <button
                  onClick={() => handleViewTypeChange('card')}
                  className={`px-3 py-3 rounded ${
                    viewType === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  } hover:bg-blue-600`}
                >
                  <FaTh className="text-lg" />
                </button>

                <button
                  onClick={() => handleViewTypeChange('list')}
                  className={`px-3 py-3 rounded ${
                    viewType === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  } hover:bg-blue-600`}
                >
                  <FaListUl className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-4 mt-4 mx-16">
    
            <div className="w-full sm:w-auto">
              <Select value={sortBy} onChange={handleSortByChange}>
                <MenuItem value="Title">Title</MenuItem>
                <MenuItem value="CreatedAt">Created At</MenuItem>
                <MenuItem value="UpdatedAt">Updated At</MenuItem>
              </Select>
              <Select value={asc} onChange={handleAscDescChange}>
                <MenuItem value={1}>Ascending</MenuItem>
                <MenuItem value={0}>Descending</MenuItem>
              </Select>
            </div>
        
            <div className="flex flex-wrap items-center gap-4 justify-end w-full sm:w-auto">
              <span>Items per page:</span>
              <Select
                value={pageSize}
                onChange={handlePageSize}
                className="ml-2 w-full sm:w-auto"
              >
                {pageSizeOptions.map((size) => (
                  <MenuItem
                    key={size}
                    value={size}
                    disabled={size > roadmapStore.totalCount && roadmapStore.totalCount !== 0}
                  >
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>


          {loadingTable ? (
            <div className="flex justify-center items-center py-10">
              <LoadingComponent />
            </div>
          ) : viewType === "card" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:mx-12 lg:grid-cols-5 gap-12 p-4">
              {roadmaps.length > 0 ? (
                roadmaps.map((roadmap) => (
                  <div key={roadmap.roadmapId}>
                    <RoadmapCard
                      name={roadmap.title}
                      progress={roadmap.overallProgress}
                      roadmapId={roadmap.roadmapId}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">No Roadmap found</div>
              )}
            </div>
          ) : (
            <div className="pt-4 mx-16">
              <TableContainer component="div" className="shadow-md rounded-lg overflow-hidden min-w-full">
                <Table className="text-sm">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold text-gray-700">Title</TableCell>
                      <TableCell className="font-semibold text-gray-700 text-right">Description</TableCell>
                      <TableCell className="font-semibold text-gray-700 text-right">Progress</TableCell>
                      <TableCell className="font-semibold text-gray-700 text-right">Duration</TableCell>
                      <TableCell className="font-semibold text-gray-700 text-right">Last Updated</TableCell>
                      <TableCell className="font-semibold text-gray-700 text-right">To Roadmap</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roadmaps.length > 0 ? (
                      roadmaps.map((roadmap) => (
                        <TableRow key={roadmap.roadmapId} className="hover:bg-gray-100">
                          <TableCell>{roadmap.title}</TableCell>
                          <TableCell>{roadmap.description}</TableCell>
                          <TableCell>{roadmap.overallProgress}%</TableCell>
                          <TableCell>{roadmap.overallDuration} days</TableCell>
                          <TableCell>{formatDate(roadmap.updatedAt)}</TableCell>
                          <TableCell>
                            <NavLink to={`/roadmap/${roadmap.roadmapId}`} className="text-blue-500 underline">
                              Roadmap
                            </NavLink>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          No Roadmap found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <Pagination
              count={roadmapStore.totalPages} 
              page={roadmapStore.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      </div>
    </>
  );
});
