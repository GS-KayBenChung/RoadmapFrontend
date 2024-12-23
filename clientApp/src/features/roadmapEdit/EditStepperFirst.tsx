import { Box, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";
import { useEffect, useState } from "react";

export default observer (function stepperFirst() {
  const { roadmapTitle, roadmapDescription, setRoadmapTitle, setRoadmapDescription } = roadmapEditStore;
  
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    testingOutput();
    forceUpdate((prev) => prev + 1);
  }, [roadmapTitle, roadmapDescription]);

  const testingOutput = () => {
    console.log("roadmapTitle:", roadmapTitle);
    console.log("roadmapDescription:", roadmapDescription);
  };

  return (
    <Box className="flex flex-col items-center p-3">
      <TextField
        fullWidth
        margin="normal"
        label="Roadmap Title"
        value={roadmapTitle}
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
        onChange={(e) => setRoadmapDescription(e.target.value)}
        className="max-w-[600px]"
      />
    </Box>
  );
})