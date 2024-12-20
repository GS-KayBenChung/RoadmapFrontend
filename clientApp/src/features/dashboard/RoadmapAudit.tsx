import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton, SelectChangeEvent } from "@mui/material";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import { useState, useRef, useEffect } from "react";
import { useStore } from "../../app/stores/store";
import TableComponent from "../../app/layout/TableComponent";

export default function RoadmapAudit(){
    const { roadmapStore } = useStore();
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
    const columns = [
        { header: 'UserId', accessor: 'userId' },
        { header: 'Date Time', accessor: 'createdAt' },
        { header: 'Logs', accessor: 'activityAction' }
    ];
    useEffect(() => {
        if (roadmaps.length === 0) loadRoadmaps();
      }, [loadRoadmaps, roadmaps.length]);
    return(
        <>
            <NavBar />
            <div className="p-16">
                <ScreenTitleName title="Audit Trails" />
                <div className="max-w-screen-lg mx-auto p-4">
                    <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                        <InputLabel>Filter By</InputLabel>
                        <Select value={filter} onChange={handleChange} label="Filter By">
                        <MenuItem value="Any">Any</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Action">Action</MenuItem>
                        <MenuItem value="Date">Date</MenuItem>
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
               
                    <div className="pt-4">
                        <TableComponent columns={columns} data={roadmaps} />
                    </div>
                </div>
            </div>
        </>
    )
}