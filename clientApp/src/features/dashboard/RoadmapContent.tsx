import { useNavigate } from "react-router-dom"; // Import useNavigate
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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

export default observer(function RoadmapsPage() {
  const { roadmapStore } = useStore();
  const { loadRoadmaps, roadmaps, loadingInitial } = roadmapStore;
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [viewType, setViewType] = useState<string>("card");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterChange = (event: any) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    if (selectedFilter === "") {
      navigate('?');
    } else {
      navigate(`?filter=${selectedFilter}`);
    }
    loadRoadmaps(selectedFilter, search, selectedDate);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const normalizedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();
      loadRoadmaps(filter, normalizedSearch, selectedDate);
    }
  };

  const handleClear = () => {
    setSearch("");
    loadRoadmaps(filter, "", selectedDate);
  };

  const handleDateChange = (event: any) => {
    const date = event.target.value;
    setSelectedDate(date);
    if (date) {
      loadRoadmaps(filter, search, date);  
    } else {
      loadRoadmaps(filter, search, ""); 
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get("filter");

    if (filterParam) {
      setFilter(filterParam);
      loadRoadmaps(filterParam, "", selectedDate); 
    } else {
      loadRoadmaps(filter, search, selectedDate);
    }
  }, [location.search, loadRoadmaps]);

  if (loadingInitial) return <LoadingComponent />;

  return (
    <>
      <NavBar />
      <div className="py-16">
        <ScreenTitleName title="ROADMAPS" />
        <div className="mt-24">
          <div className="flex justify-between gap-4 mb-6 flex-wrap w-full max-w-screen-lg mx-auto px-4">
          <TextField
            margin="normal"
            type="date"
            label="Date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            className="w-[200px]"
          />
            <div className="flex items-center gap-4">
              <FormControl variant="outlined" size="small" className="w-52">
                <InputLabel>Filter By</InputLabel>
                <Select value={filter} onChange={handleFilterChange} label="Filter By">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                className="max-w-[400px]"
              />
            </div>

            <div className="flex items-center gap-4">
              <NavLink to="/roadmapCreate">
                <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-sm">
                  Create Roadmap
                </button>
              </NavLink>
              <button
                onClick={() => setViewType("card")}
                className={`px-3 py-3 rounded ${viewType === "card" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600`}
              >
                <FaTh className="text-lg" />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`px-3 py-3 rounded ${viewType === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600`}
              >
                <FaListUl className="text-lg" />
              </button>
            </div>
          </div>

          {viewType === "card" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:mx-12 lg:grid-cols-5 gap-12 p-4">
              {roadmaps.map((roadmap) => (
                <div key={roadmap.roadmapId}>
                  <RoadmapCard
                    name={roadmap.title}
                    progress={roadmap.overallProgress}
                    roadmapId={roadmap.roadmapId}
                  />
                </div>
              ))}
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
                    {roadmaps.map((roadmap) => (
                      <TableRow key={roadmap.roadmapId} className="hover:bg-gray-100">
                        <TableCell>{roadmap.title}</TableCell>
                        <TableCell>{roadmap.description}</TableCell>
                        <TableCell>{roadmap.overallProgress}%</TableCell>
                        <TableCell>{roadmap.overallDuration}days</TableCell>
                        <TableCell>{formatDate(roadmap.updatedAt)}</TableCell>
                        <NavLink key={roadmap.roadmapId} to={`/roadmap/${roadmap.roadmapId}`}>
                          <TableCell><a className="text-blue-500 underline">Roadmap</a></TableCell>
                        </NavLink>
                      </TableRow>
                    ))}
                  </TableBody>
                  
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
