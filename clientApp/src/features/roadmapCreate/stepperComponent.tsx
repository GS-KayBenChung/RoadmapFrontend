import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { roadmapCreateStore } from "../../roadmapCreateStore";

interface Props {
  steps: string[];
  activeStep: number;
}

export default observer(function StepperComponent({ steps, activeStep }: Props) {
  const { setActiveStep } = roadmapCreateStore;

  const handleNext = () => {
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
  );
});
