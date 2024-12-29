import { Box, TextField } from "@mui/material";
import { roadmapCreateStore } from "../../app/stores/roadmapCreateStore";
import { observer } from "mobx-react-lite";

export default observer (function stepperFirst() {
  const { roadmapTitle, roadmapDescription, setRoadmapTitle, setRoadmapDescription } = roadmapCreateStore;

  return (
    <Box className="flex flex-col items-center p-3">
      <TextField
        fullWidth
        margin="normal"
        label="Roadmap Title"
        value={roadmapTitle}
        inputProps={{ maxLength: 50 }}
        onChange={(e) => setRoadmapTitle(e.target.value)}
        className="max-w-[600px]"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Roadmap Description"
        multiline
        rows={4}
        value={roadmapDescription} 
        inputProps={{ maxLength: 100 }}
        onChange={(e) => setRoadmapDescription(e.target.value)}
        className="max-w-[600px]"
      />
    </Box>
  );
})