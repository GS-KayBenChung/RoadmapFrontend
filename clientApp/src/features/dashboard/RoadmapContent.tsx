import { observer } from "mobx-react-lite";
import { FaTh, FaListUl } from "react-icons/fa"; 
import { useEffect, useRef, useState } from "react";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NavBar from "../../app/layout/NavBar";
import RoadmapCard from "../../app/layout/RoadmapCard";
import ScreenTitleName from "../ScreenTitleName";
import { useStore } from "../../store";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Link, NavLink } from "react-router-dom";
import TableComponent from "../../app/layout/TableComponent";

export default observer(function RoadmapsPage() {
  const { roadmapStore } = useStore();
  // const { loadRoadmaps, roadmaps, selectedRoadmap, editMode, openForm, closeForm, createOrEditRoadmap, deleteRoadmap, submitting } = roadmapStore;
  const { loadRoadmaps, roadmaps} = roadmapStore;
  //For Filter
  const [filter, setFilter] = useState("");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };
  //For Search
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClear = () => {
    setValue("");
  };
  //Toggle View
  const handleFocus = () => {
    inputRef.current?.focus();
  };
  const [viewType, setViewType] = useState("card"); 
  const toggleView = (type: string) => {
    setViewType(type);
  };
  //Table View
  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Created Date', accessor: 'createdAt' },
    { header: 'Description', accessor: 'description' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Link',
      accessor: 'link',
      Cell: ({ value }: { value: string }) => (
        <Link to={value} className="text-blue-500 hover:underline">
          Go to Roadmap
        </Link>
      ),
    },
  ];

  useEffect(() => {
    if (roadmaps.length === 0) loadRoadmaps();
  }, [loadRoadmaps, roadmaps.length]);

  if (roadmapStore.loadingInitial) return <LoadingComponent content="Loading..." />;

  return (
    <>
      <NavBar />
      <div className="p-16">
        <ScreenTitleName title="ROADMAPS" />
        <div className="mx-80 mt-24">
          <div className="flex justify-between items-center gap-4 mb-6 flex-wrap mx-10">
            <div className="flex items-center gap-4">
            
              <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                <InputLabel>Filter By</InputLabel>
                <Select value={filter} onChange={handleChange} label="Filter By">
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="nearDue">Near Due</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
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
                        <IconButton onClick={handleFocus} edge="end">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                style={{ width: 250 }}
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
              {roadmaps.map((roadmap) => (
                <div key={roadmap.roadmapId}>
                  <RoadmapCard name={roadmap.title} progress={roadmap.overallProgress} roadmapId={roadmap.roadmapId} />
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-4">
              <TableComponent columns={columns} data={roadmaps} />
            </div>
          )}
        </div>

          {/* FOR TEST */}
      {/* <Button className="" onClick={() => openForm()}>Create Roadmap</Button>

      <TestList 
        roadmaps={roadmapStore.roadmaps} 
        selectRoadmap={roadmapStore.selectRoadmap} 
        deleteRoadmap={roadmapStore.deleteRoadmap}
        submitting={roadmapStore.submitting}
      />
      {selectedRoadmap && !editMode &&
        <TestDetails 
          roadmap={selectedRoadmap} 
          cancelSelectRoadmap={roadmapStore.cancelSelectRoadmap}
          openForm={roadmapStore.openForm}
        />
      }
      {editMode && 
        <RoadmapForm 
          closeForm={closeForm} 
          roadmap={selectedRoadmap}
          createOrEdit={createOrEditRoadmap}
          submitting={submitting}
        />
      } */}
    </div>
    </>
  );
})