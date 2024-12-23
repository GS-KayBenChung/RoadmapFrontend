import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import NavBar from "../../app/layout/NavBar";
import StepperComponent from "../roadmapCreate/stepperComponent";
import ScreenTitleName from "../ScreenTitleName";
import StepperFirst from "../roadmapCreate/stepperFirst";
import StepperSecond from "../roadmapCreate/stepperSecond";
import StepperThird from "../roadmapCreate/stepperThird";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";

export default observer(function RoadmapEdit() {
  const { roadmapStore } = useStore();
  const { selectedRoadmap, loadRoadmap } = roadmapStore;
  const { id } = useParams();
  const {activeStep} = roadmapEditStore;

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

  useEffect(() => {
    if (id) {
      loadRoadmap(id).then(() => {
        if (selectedRoadmap) {
          roadmapEditStore.populateFromRoadmap(selectedRoadmap);
        }
      });
    }
  }, [id, loadRoadmap, selectedRoadmap]);

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
            <ScreenTitleName title="Edit Roadmap" />
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
