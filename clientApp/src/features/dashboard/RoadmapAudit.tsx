import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default observer(function RoadmapAudit() {
  const { roadmapStore } = useStore();
  const { logs, loadLogs } = roadmapStore;
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilter = params.get("filter") || "";
    const urlSearch = params.get("search") || "";

    setFilter(urlFilter);
    setSearch(urlSearch);

    loadLogs(urlFilter, urlSearch);
  }, [location.search, loadLogs]);

  const handleFilterChange = (event: any) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("filter", selectedFilter);

    const newUrl = `?${queryParams.toString()}`;
    navigate(newUrl);
    loadLogs(selectedFilter, search);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const normalizedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();

      const queryParams = new URLSearchParams(location.search);
      queryParams.set("search", normalizedSearch);

      const newUrl = `?${queryParams.toString()}`;
      navigate(newUrl);
      loadLogs(filter, normalizedSearch);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete("search");
    navigate(`?${queryParams.toString()}`);
    loadLogs(filter, "");
  };

  return (
    <>
      <NavBar />
      <div className="p-12">
        <ScreenTitleName title="Audit Trails" />
        <div className="flex justify-between gap-4 mb-6">
          <FormControl variant="outlined" size="small" className="w-52">
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
            onChange={(e) => setSearch(e.target.value)}
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
            className="max-w-[400px]"
          />
        </div>

        <TableContainer className="shadow-md rounded-lg overflow-hidden min-w-full">
          <Table className="text-sm">
            <TableHead>
              <TableRow className="border-black border-2">
                <TableCell className="font-semibold text-gray-700">LogId</TableCell>
                <TableCell className="font-semibold text-gray-700 text-right">UserId</TableCell>
                <TableCell className="font-semibold text-gray-700 text-right">Action</TableCell>
                <TableCell className="font-semibold text-gray-700 text-right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="border-2 border-black">
              {logs.map((log) => (
                <TableRow key={log.logId} className="hover:bg-gray-100">
                  <TableCell>{log.logId}</TableCell>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.activityAction}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
});