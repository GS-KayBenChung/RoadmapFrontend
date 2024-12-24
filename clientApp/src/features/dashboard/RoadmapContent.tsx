import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NavBar from "../../app/layout/NavBar";
import RoadmapCard from "../../app/layout/RoadmapCard";
import TableComponent from "../../app/layout/TableComponent";
import { useStore } from "../../app/stores/store";
import ScreenTitleName from "../ScreenTitleName";
import { FaTh, FaListUl } from "react-icons/fa"; 

export default observer(function RoadmapsPage() {
  const { roadmapStore } = useStore();
  const { loadRoadmaps, roadmaps } = roadmapStore;

  //Table View
  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Created Date', accessor: 'createdAt' },
    { header: 'Description', accessor: 'description' },
    { header: 'Status', accessor: 'status' },
    { header: 'Link', accessor: 'lel'},
  ];

  // For Filter
  const [filter, setFilter] = useState(""); // Default: no filter (all roadmaps)
  const handleChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value); // Update the selected filter
  };

  // For Search
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClear = () => setValue("");

  // Toggle View
  const [viewType, setViewType] = useState("card");
  const toggleView = (type: string) => setViewType(type);

  // Fetch roadmaps on component mount
  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  if (roadmapStore.loadingInitial) return <LoadingComponent/>;

  // Filter roadmaps based on the selected filter
  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    if (filter === "all" || filter === "") return true; // Show all roadmaps if no filter is applied
    if (filter === "draft") return roadmap.isDraft;
    if (filter === "completed") return roadmap.isCompleted;
    if (filter === "inProgress") return !roadmap.isCompleted && !roadmap.isDraft;
    if (filter === "overdue") return roadmap.isCompleted; // Assuming `isOverdue` is a property in the roadmap
    return false;
  });

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
                <Select value={filter} onChange={handleChange} label="Filter By">
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                variant="outlined"
                size="small"
                inputRef={inputRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {value ? (
                        <IconButton onClick={handleClear} edge="end">
                          <XMarkIcon className="h-5 w-5 text-gray-500" />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => inputRef.current?.focus()} edge="end">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                        </IconButton>
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
                className={`px-3 py-3 rounded ${viewType === "card" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600`}
              >
                <FaTh className="text-lg" />
              </button>
              <button
                onClick={() => toggleView("list")}
                className={`px-3 py-3 rounded ${viewType === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600`}
              >
                <FaListUl className="text-lg" />
              </button>
            </div>
          </div>

          {viewType === "card" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
              {filteredRoadmaps.map((roadmap) => (
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
              <TableComponent columns={columns} data={filteredRoadmaps} />
            </div>
          )}
        </div>
      </div>
    </>
  );
});
