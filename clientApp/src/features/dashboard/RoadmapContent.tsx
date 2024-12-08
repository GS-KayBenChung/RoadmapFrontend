import { useState, useEffect, useRef } from "react";
import { FaTh, FaListUl } from "react-icons/fa"; 
import RoadmapCard from "../../app/layout/RoadmapCard"; 
import ScreenTitleName from "../ScreenTitleName"; 
import { Roadmap } from "../../app/models/roadmap";
import { Link, NavLink } from "react-router-dom";
import TableComponent from "../../app/layout/TableComponent";
import TestList from "../TestList";
import TestDetails from "../details/TestDetails";
import RoadmapForm from "../form/RoadmapForm";
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import {v4 as uuid} from 'uuid'
import apiClient from "../../app/api/apiClient";
import LoadingComponent from "../../app/layout/LoadingComponent";
import NavBar from "../../app/layout/NavBar";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

//import { useStore } from "../../app/stores/store";

export default function RoadmapsPage() {

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
  
  //const {roadmapStore} = useStore();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  const [viewType, setViewType] = useState("card"); 

  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | undefined> (undefined);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const toggleView = (type: string) => {
    setViewType(type);
  };

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
  const handleFocus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    // .get<Roadmap[]>(API_URL.roadmap)
    apiClient.Roadmaps.list().then(response => {
      
      setRoadmaps(response);
      setLoading(false);
    })
  }, []);

  function handleSelectRoadmap(id: string){
    setSelectedRoadmap(roadmaps.find(x => x.roadmapId === id))
  }
  function handleCancelSelectRoadmap(){
    setSelectedRoadmap(undefined)
  }
  function handleFormOpen(id?: string){
    id ? handleSelectRoadmap(id) : handleCancelSelectRoadmap();
    setEditMode(true);
  }
  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditRoadmap(roadmap: Roadmap){
    setSubmitting(true);
    if(roadmap.roadmapId){
      apiClient.Roadmaps.update(roadmap).then(() => {
        setRoadmaps([...roadmaps.filter(x => x.roadmapId !== roadmap.roadmapId), roadmap])
        setSelectedRoadmap(roadmap);
        setEditMode(false);
        setSubmitting(false);
      })
    } 
    else {
      roadmap.roadmapId = uuid();
      console.log('Payload being sent:', roadmap); // Debug log
      apiClient.Roadmaps.create(roadmap).then(() => {
        setRoadmaps([...roadmaps, roadmap])
        setSelectedRoadmap(roadmap);
        setEditMode(false);
        setSubmitting(false);
      })
    } 
  }

  function handleDeleteRoadmap(id: string){
    setSubmitting(true);
    apiClient.Roadmaps.delete(id).then(() => {
      setRoadmaps([...roadmaps.filter(x => x.roadmapId !==id)]);
      setSubmitting(false);
    })
  }

  if(loading) return <LoadingComponent content="Loading..."/>
  
  return (
    <>

    <NavBar/>
    <div className="p-16">
      
      <ScreenTitleName title="ROADMAPS"/>
      
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
              {/* <input
                type="text"
                placeholder="Search Roadmap"
                className="border px-4 py-2 rounded text-sm focus:outline-none"
              /> */}
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
                  <RoadmapCard name={roadmap.title} progress={roadmap.overallProgress} />
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-4">
              <TableComponent columns={columns} data={roadmaps} />
            </div>
          )}
        </div>


      <Button className="" onClick={() => handleFormOpen()}>Create Roadmap</Button>

      <TestList 
        roadmaps={roadmaps} 
        selectRoadmap={handleSelectRoadmap} 
        deleteRoadmap={handleDeleteRoadmap}
        submitting={submitting}
      />
      {selectedRoadmap && !editMode &&
        <TestDetails 
          roadmap={selectedRoadmap} 
          cancelSelectRoadmap={handleCancelSelectRoadmap}
          openForm={handleFormOpen}
        />
      }
      {editMode && 
        <RoadmapForm 
          closeForm={handleFormClose} 
          roadmap={selectedRoadmap}
          createOrEdit={handleCreateOrEditRoadmap}
          submitting={submitting}
        />
      }
    </div>
    </>
  );
}
