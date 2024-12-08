import { useState } from "react";
import {
  Box,
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
import NavBar from "../../app/layout/NavBar";

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
      case 0:
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
  
      case 1:
        return (
          <Box>
            <button
              onClick={addMilestone}
              className="mb-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Milestone
            </button>
            {milestones.map((milestone, milestoneIndex) => (
              <Card 
                key={milestoneIndex} 
                className="mb-3 p-2 mt-8 border-2 border-black">
                <CardContent>
                  <Box className="flex justify-between">
                    <h6 className="font-extrabold text-xl">{`Milestone ${milestoneIndex + 1}`}</h6>
                    <IconButton
                      onClick={() => deleteMilestone(milestoneIndex)}
                    >
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </IconButton>
                  </Box>
                  <Box className="flex flex-col items-center">
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
                      className="max-w-[500px]"
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
                      className="max-w-[500px]"
                    />
                    <button
                      onClick={() => addSection(milestoneIndex)}
                      className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Section
                    </button>

                    {milestone.sections.map((section, sectionIndex) => (
                      <Card 
                        key={sectionIndex} 
                        className="w-3/5 mt-3 ml-2 p-3 border border-black text-black rounded">
                        <CardContent>
                          <Box className="flex justify-between">
                            <h6 className="font-extrabold text-xl">{`Section ${sectionIndex + 1}`}</h6>
                            <IconButton
                              onClick={() => deleteSection(milestoneIndex, sectionIndex)}
                              aria-label="delete section"
                            >
                              <TrashIcon className="h-5 w-5 text-red-600"/>
                            </IconButton>
                            
                          </Box>
                          <Box className="flex flex-col items-center">
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
                              className="max-w-[400px]"
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
                              className="max-w-[400px]"
                            />
                            <button
                              onClick={() => addTask(milestoneIndex, sectionIndex)}
                              className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Add Task
                            </button>
                            {section.tasks.map((task, taskIndex) => (
                              <Card key={taskIndex} 
                                className="w-3/5 mt-3 ml-2 p-3 border border-black text-black rounded">
                                <CardContent>
                                  <Box className="flex justify-between">
                                    <h6 className="font-extrabold text-xl">{`Task ${taskIndex + 1}`}</h6>
                                    <IconButton
                                      onClick={() => deleteTask(milestoneIndex, sectionIndex, taskIndex)}
                                      aria-label="delete task"
                                    >
                                      <TrashIcon className="h-5 w-5 text-red-600" />
                                    </IconButton>
                                  </Box>
                                  <Box className="flex flex-col items-center">
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
                                      className="max-w-[400px]"
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
                                      className="w-[400px]"
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
                                      className="w-[400px]"
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
    <>
        <NavBar/>
        <div className="flex flex-col items-center justify-center mx-32">
          <div className="mt-36">
            <ScreenTitleName title="Create Roadmap"/>
          </div>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box className="w-full mt-12">
              {renderStepContent(activeStep)}
          </Box>
          <Box className="flex justify-center w-full my-12 space-x-4">
            <button 
               className={`py-2 px-6 rounded-lg
                ${activeStep === 0 
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                  : "bg-gray-400 text-white hover:bg-gray-600"
                }`}
              onClick={handleBack} 
              disabled={activeStep === 0}
            >
              Back
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              onClick={handleNext}
            >
              Next
            </button>
          </Box>

        </div>
    </>
  );
};

export default RoadmapStepper;
