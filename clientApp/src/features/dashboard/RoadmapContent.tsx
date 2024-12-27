import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NavBar from "../../app/layout/NavBar";
import RoadmapCard from "../../app/layout/RoadmapCard";
import TableComponent from "../../app/layout/TableComponent";
import { useStore } from "../../app/stores/store";
import ScreenTitleName from "../ScreenTitleName";
import { FaTh, FaListUl } from "react-icons/fa";

export default observer(function RoadmapsPage() {
  const { roadmapStore } = useStore();
  const { loadRoadmaps, roadmaps, loadingInitial } = roadmapStore;
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Created Date", accessor: "createdAt" },
    { header: "Description", accessor: "description" },
    { header: "Link", accessor: "lel" },
  ];

  const [filter, setFilter] = useState<string>(""); 
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };

  const [search, setSearch] = useState<string>("");

  const [viewType, setViewType] = useState<string>("card");
  const toggleView = (type: string) => setViewType(type);

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const normalizedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();
      if (normalizedSearch === "") {
        return; 
      }
      loadRoadmaps(filter, normalizedSearch);
    }
  };
  
  const handleClear = () => {
    setSearch(""); 
    loadRoadmaps(filter, ""); 
  };

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get("filter");

    if (filterParam) {
      setFilter(filterParam); 
      loadRoadmaps(filterParam, ""); 
    }
  }, [location.search, loadRoadmaps]);
  
  
  // useEffect(() => {
  //   loadRoadmaps(filter, "").then(() => {
  //   });
  // }, [filter, loadRoadmaps]);

  if (loadingInitial) return <LoadingComponent />;

  return (
    <>
      <NavBar />
      <div className="p-16">
        <ScreenTitleName title="ROADMAPS" />
        <div className="mx-80 mt-24">
          <div className="flex justify-between items-center gap-4 mb-6 flex-wrap mx-10">
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
                value={search} // Use the search state as the value
                onChange={(e) => setSearch(e.target.value)} // Update the state as the user types
                onKeyDown={handleSearchKeyDown} // Trigger search only on Enter key
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {search ? ( // Check if the `search` state has a value
                        <IconButton onClick={handleClear} edge="end">
                          <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </IconButton>
                      ) : (
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </InputAdornment>
                  ),
                }}
                className="w-52"
              />

            </div>

            <div className="flex items-center gap-4">
              <NavLink to="/roadmapCreate">
                <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-sm">
                  Create Roadmap
                </button>
              </NavLink>
              <button
                onClick={() => toggleView("card")}
                className={`px-3 py-3 rounded ${
                  viewType === "card" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                } hover:bg-blue-600`}
              >
                <FaTh className="text-lg" />
              </button>
              <button
                onClick={() => toggleView("list")}
                className={`px-3 py-3 rounded ${
                  viewType === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                } hover:bg-blue-600`}
              >
                <FaListUl className="text-lg" />
              </button>
            </div>
          </div>

          {viewType === "card" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
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
            <div className="pt-4">
              <TableComponent columns={columns} data={roadmaps} />
            </div>
          )}
        </div>
      </div>
    </>
  );
});
