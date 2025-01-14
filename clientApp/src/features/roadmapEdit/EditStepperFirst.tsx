import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Box, TextField } from "@mui/material";
import { useStore } from "../../app/stores/store";
import { roadmapEditTestStore } from "../../app/stores/roadmapEditTestStore";
import { toast } from "react-toastify";

export default observer(function EditStepperFirst() {
  const { roadmapStore } = useStore();
  const { id } = useParams();

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (id) {
        try {
          const roadmap = await roadmapStore.loadRoadmap(id.toString()); 
          roadmapEditTestStore.loadRoadmap(roadmap); 
        } catch (error) {
          toast.error("Failed to load roadmap:");
        }
      }
    };

    fetchRoadmap(); 
  }, [id, roadmapStore]);

  return (
    <Box className="flex flex-col items-center p-3">
      <TextField
        fullWidth
        margin="normal"
        label="Roadmap Title"
        name="title"
        value={roadmapEditTestStore.roadmapToEdit?.title || ""}
        onChange={(e) => roadmapEditTestStore.handleInputChange(e)}
        inputProps={{ maxLength: 50 }}
        className="max-w-[600px]"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Roadmap Description"
        multiline
        rows={4}
        name="description"
        value={roadmapEditTestStore.roadmapToEdit?.description || ""}
        onChange={(e) => roadmapEditTestStore.handleInputChange(e)}
        inputProps={{ maxLength: 100 }}
        className="max-w-[600px]"
      />
    </Box>
  );
});