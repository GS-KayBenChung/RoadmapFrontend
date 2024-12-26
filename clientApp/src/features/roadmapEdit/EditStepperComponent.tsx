import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";

interface Props {
  steps: string[];
  activeStep: number;
}

export default observer(function EditStepperComponent({ steps, activeStep }: Props) {
  const { setActiveStep, roadmapTitle, roadmapDescription } = roadmapEditStore;

  const handleNext = () => {
    if (!roadmapTitle || !roadmapDescription) {
      toast.warning("Please fill out both the Roadmap Title and Roadmap Description before proceeding.");
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-32">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box className="flex justify-center w-full mt-12 space-x-4">
        <button
          className={`py-2 px-6 rounded-lg ${
            activeStep === 0
              ? "hidden"
              : "bg-gray-400 text-white hover:bg-gray-600"
          }`}
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </button>
        <button
          className={`bg-blue-500 text-white py-2 px-6 rounded-lg
            ${ 
              activeStep === 2
              ? "hidden"
              : "hover:bg-blue-600"
            }
          `}
          onClick={handleNext}
        >
          Next
        </button>
      </Box>
    </div>
  );
});