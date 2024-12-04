import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ScreenTitleName from "../ScreenTitleName";
import { TrashIcon } from "@heroicons/react/16/solid";

interface Task {
  title: string;
  startDate: string;
  endDate: string;
}

interface Section {
  title: string;
  description: string;
  tasks: Task[];
}

interface Milestone {
  title: string;
  description: string;
  sections: Section[];
}

const RoadmapStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [roadmapDescription, setRoadmapDescription] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const steps = ["Roadmap Details", "Milestones & Sections", "Overview & Submit"];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { title: "", description: "", sections: [] },
    ]);
  };

  const addSection = (milestoneIndex: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex].sections.push({
      title: "",
      description: "",
      tasks: [],
    });
    setMilestones(updatedMilestones);
  };

  const addTask = (milestoneIndex: number, sectionIndex: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex].sections[sectionIndex].tasks.push({
      title: "",
      startDate: "",
      endDate: "",
    });
    setMilestones(updatedMilestones);
  };

  const deleteMilestone = (milestoneIndex: number) => {
    const updatedMilestones = milestones.filter((_, index) => index !== milestoneIndex);
    setMilestones(updatedMilestones);
  };

  const deleteSection = (milestoneIndex: number, sectionIndex: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex].sections = updatedMilestones[milestoneIndex].sections.filter(
      (_, index) => index !== sectionIndex
    );
    setMilestones(updatedMilestones);
  };

  const deleteTask = (milestoneIndex: number, sectionIndex: number, taskIndex: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex].sections[sectionIndex].tasks = updatedMilestones[milestoneIndex].sections[sectionIndex].tasks.filter(
      (_, index) => index !== taskIndex
    );
    setMilestones(updatedMilestones);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Roadmap Details
        return (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Roadmap Title"
              value={roadmapTitle}
              onChange={(e) => setRoadmapTitle(e.target.value)}
              sx={{ maxWidth: "600px", mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Roadmap Description"
              multiline
              rows={4}
              value={roadmapDescription}
              onChange={(e) => setRoadmapDescription(e.target.value)}
              sx={{ maxWidth: "600px" }}
            />
          </Box>
        );
  
        case 1:
          return (
            <Box sx={{ padding: 3 }}>
              <Button
                variant="contained"
                onClick={addMilestone}
                sx={{ mb: 3, display: "block", margin: "0 auto" }}
              >
                Add Milestone
              </Button>
              {milestones.map((milestone, milestoneIndex) => (
                <Card key={milestoneIndex} variant="outlined" sx={{ mb: 3, padding: 2, marginTop: 4 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="h6">{`Milestone ${milestoneIndex + 1}`}</Typography>
                      <IconButton
                        onClick={() => deleteMilestone(milestoneIndex)}
                        color="error"
                        aria-label="delete milestone"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Milestone Title"
                        value={milestone.title}
                        onChange={(e) => {
                          const updatedMilestones = [...milestones];
                          updatedMilestones[milestoneIndex].title = e.target.value;
                          setMilestones(updatedMilestones);
                        }}
                        sx={{ maxWidth: "500px", mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Milestone Description"
                        multiline
                        rows={2}
                        value={milestone.description}
                        onChange={(e) => {
                          const updatedMilestones = [...milestones];
                          updatedMilestones[milestoneIndex].description = e.target.value;
                          setMilestones(updatedMilestones);
                        }}
                        sx={{ maxWidth: "500px", mb: 2 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => addSection(milestoneIndex)}
                        sx={{ mt: 2, display: "block", margin: "0 auto" }}
                      >
                        Add Section
                      </Button>
                      {milestone.sections.map((section, sectionIndex) => (
                        <Card key={sectionIndex} variant="outlined" sx={{ mt: 3, ml: 2, padding: 2 }}>
                          <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="subtitle1">{`Section ${sectionIndex + 1}`}</Typography>
                              <IconButton
                                onClick={() => deleteSection(milestoneIndex, sectionIndex)}
                                color="error"
                                aria-label="delete section"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </IconButton>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <TextField
                                fullWidth
                                margin="normal"
                                label="Section Title"
                                value={section.title}
                                onChange={(e) => {
                                  const updatedMilestones = [...milestones];
                                  updatedMilestones[milestoneIndex].sections[sectionIndex].title =
                                    e.target.value;
                                  setMilestones(updatedMilestones);
                                }}
                                sx={{ maxWidth: "400px", mb: 2 }}
                              />
                              <TextField
                                fullWidth
                                margin="normal"
                                label="Section Description"
                                multiline
                                rows={2}
                                value={section.description}
                                onChange={(e) => {
                                  const updatedMilestones = [...milestones];
                                  updatedMilestones[milestoneIndex].sections[sectionIndex].description =
                                    e.target.value;
                                  setMilestones(updatedMilestones);
                                }}
                                sx={{ maxWidth: "400px", mb: 2 }}
                              />
                              <Button
                                variant="outlined"
                                onClick={() => addTask(milestoneIndex, sectionIndex)}
                                sx={{ mt: 2, display: "block", margin: "0 auto" }}
                              >
                                Add Task
                              </Button>
                              {section.tasks.map((task, taskIndex) => (
                                <Card key={taskIndex} variant="outlined" sx={{ mt: 2, ml: 2, padding: 2 }}>
                                  <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography>{`Task ${taskIndex + 1}`}</Typography>
                                      <IconButton
                                        onClick={() => deleteTask(milestoneIndex, sectionIndex, taskIndex)}
                                        color="error"
                                        aria-label="delete task"
                                      >
                                        <TrashIcon className="h-5 w-5" />
                                      </IconButton>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                      <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Task Title"
                                        value={task.title}
                                        onChange={(e) => {
                                          const updatedMilestones = [...milestones];
                                          updatedMilestones[milestoneIndex].sections[sectionIndex].tasks[taskIndex].title =
                                            e.target.value;
                                          setMilestones(updatedMilestones);
                                        }}
                                        sx={{ maxWidth: "300px", mb: 2 }}
                                      />
                                      <TextField
                                        margin="normal"
                                        type="date"
                                        label="Start Date"
                                        InputLabelProps={{ shrink: true }}
                                        value={task.startDate}
                                        onChange={(e) => {
                                          const updatedMilestones = [...milestones];
                                          updatedMilestones[milestoneIndex].sections[sectionIndex].tasks[taskIndex].startDate =
                                            e.target.value;
                                          setMilestones(updatedMilestones);
                                        }}
                                        sx={{ maxWidth: "300px", mb: 2 }}
                                      />
                                      <TextField
                                        margin="normal"
                                        type="date"
                                        label="End Date"
                                        InputLabelProps={{ shrink: true }}
                                        value={task.endDate}
                                        onChange={(e) => {
                                          const updatedMilestones = [...milestones];
                                          updatedMilestones[milestoneIndex].sections[sectionIndex].tasks[taskIndex].endDate =
                                            e.target.value;
                                          setMilestones(updatedMilestones);
                                        }}
                                        sx={{ maxWidth: "300px", mb: 2 }}
                                      />
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          );
  
      case 2: // Overview & Submit
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" align="center">Roadmap Overview:</Typography>
            <Typography><strong>Title:</strong> {roadmapTitle}</Typography>
            <Typography><strong>Description:</strong> {roadmapDescription}</Typography>
            <Typography variant="h6" mt={2}>Milestones:</Typography>
            {milestones.map((milestone, milestoneIndex) => (
              <Box key={milestoneIndex} p={1}>
                <Typography>
                  <strong>{`Milestone ${milestoneIndex + 1}`}</strong>: {milestone.title} - {milestone.description}
                </Typography>
                {milestone.sections.map((section, sectionIndex) => (
                  <Box key={sectionIndex} pl={2}>
                    <Typography>
                      <strong>{`Section ${sectionIndex + 1}`}</strong>: {section.title} - {section.description}
                    </Typography>
                    {section.tasks.map((task, taskIndex) => (
                      <Box key={taskIndex} pl={4}>
                        <Typography>
                          <strong>{`Task ${taskIndex + 1}`}</strong>: {task.title} 
                          (Start: {task.startDate}, End: {task.endDate})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        );
  
      case 3: // Review & Submit
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" align="center">Review Your Roadmap</Typography>
            <Typography><strong>Title:</strong> {roadmapTitle}</Typography>
            <Typography><strong>Description:</strong> {roadmapDescription}</Typography>
            {milestones.map((milestone, milestoneIndex) => (
              <Box key={milestoneIndex} my={2}>
                <Typography variant="h6">{`Milestone ${milestoneIndex + 1}: ${milestone.title}`}</Typography>
                <Typography>{milestone.description}</Typography>
                {milestone.sections.map((section, sectionIndex) => (
                  <Box key={sectionIndex} ml={4} mt={1}>
                    <Typography variant="subtitle1">{`Section ${sectionIndex + 1}: ${section.title}`}</Typography>
                    <Typography>{section.description}</Typography>
                    {section.tasks.map((task, taskIndex) => (
                      <Box key={taskIndex} ml={4}>
                        <Typography>{`Task ${taskIndex + 1}: ${task.title} (Start: ${task.startDate}, End: ${task.endDate})`}</Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            ))}
            <Typography align="center" color="textSecondary" mt={4}>
              Ensure all details are correct before submitting.
            </Typography>
          </Box>
        );
  
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
      <ScreenTitleName title="Create Roadmap" />
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ width: "100%" }}>{renderStepContent(activeStep)}</Box>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 3 }}>
        <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default RoadmapStepper;
