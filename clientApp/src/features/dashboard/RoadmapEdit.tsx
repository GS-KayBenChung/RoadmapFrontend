import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";;
// import LoadingComponent from "../../app/layout/LoadingComponent";
import EditStepperFirst from "../roadmapEdit/EditStepperFirst";
import EditStepperSecond from "../roadmapEdit/EditStepperSecond";
import EditStepperComponent from "../roadmapEdit/EditStepperComponent";
import { ToastContainer } from "react-toastify";
import EditStepperThird from "../roadmapEdit/EditStepperThird";
import {roadmapEditTestStore} from "../../app/stores/roadmapEditTestStore";

const steps = ["Roadmap Details", "Milestones & Sections", "Overview & Submit"];

export default observer(function RoadmapEdit() {
  const { activeStep } = roadmapEditTestStore;
  const { roadmapStore } = useStore();
  const { loadRoadmap } = roadmapStore;
  const { id } = useParams();
  const [roadmapToEdit, setRoadmapToEdit] = useState<any>(null);


  useEffect(() => {
    if (id) {
      loadRoadmap(id).then((roadmap) => {
        if (roadmap) {
          setRoadmapToEdit({ ...roadmap });
        }
      });
    }
  }, [id, loadRoadmap]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <EditStepperFirst />;
      case 1:
        return <EditStepperSecond />;
      case 2:
        return <EditStepperThird />
      default:
        return <div>Unknown step</div>;
    }
  };

  // if (loadingInitial) {
  //   return <LoadingComponent />;
  // }

  // if (!roadmapToEdit) {
  //   return <div>Failed to load roadmap. Please try again.</div>;
  // }

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
      <div className="flex flex-col items-center mx-32">
        <ScreenTitleName title="Edit Roadmap" />
        <EditStepperComponent steps={steps} activeStep={activeStep} />
        <div className="w-full mt-8">
          {renderStepContent(activeStep)}
        </div>
      </div>
    </>
  ); 

});