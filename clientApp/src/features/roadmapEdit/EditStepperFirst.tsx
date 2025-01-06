import { Box, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";
import { useStore } from "../../app/stores/store";

export default observer(function EditStepperFirst() {
    const { roadmapTitle, roadmapDescription, setRoadmapTitle, setRoadmapDescription } = roadmapEditStore;
    const {roadmapStore} = useStore();
    const {selectedRoadmap} = roadmapStore;
    const isDraft = selectedRoadmap?.isDraft; 


    return (
        <Box className="flex flex-col items-center p-3">
            <TextField
                fullWidth
                margin="normal"
                label="Roadmap Title"
                value={roadmapTitle}
                onChange={(e) => setRoadmapTitle(e.target.value)}
                inputProps={{ maxLength: 50 }}
                className="max-w-[600px]"
                disabled={!isDraft}
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
                disabled={!isDraft}
            />
        </Box>
    );
});