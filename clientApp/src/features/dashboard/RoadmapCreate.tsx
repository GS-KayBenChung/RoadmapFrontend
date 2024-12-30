import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import { roadmapCreateStore } from "../../app/stores/roadmapCreateStore";
import StepperComponent from "../roadmapCreate/stepperComponent";
import StepperFirst from "../roadmapCreate/stepperFirst";
import StepperSecond from "../roadmapCreate/stepperSecond";
import StepperThird from "../roadmapCreate/stepperThird";
import { ToastContainer } from "react-toastify";

export default observer(function RoadmapCreate() {
  const { activeStep } = roadmapCreateStore;

  const steps = ["Roadmap Details", "Milestones & Sections", "Overview & Submit"];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepperFirst/>;
      case 1:
        return <StepperSecond/>
      case 2:
        return <StepperThird/>
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        position="top-center"
      />
      <NavBar />
      <div className="flex flex-col items-center justify-center mx-32">
        <div className="mt-36">
          <ScreenTitleName title="Create Roadmap" />
        </div>
        <StepperComponent
          steps={steps}
          activeStep={activeStep}  
        />
        <Box className="w-full mt-12">{renderStepContent(activeStep)}</Box>
      </div>
    </>
  );
});
