import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";;
import LoadingComponent from "../../app/layout/LoadingComponent";
import EditStepperFirst from "../roadmapEdit/EditStepperFirst";
import EditStepperSecond from "../roadmapEdit/EditStepperSecond";
import EditStepperComponent from "../roadmapEdit/EditStepperComponent";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";
import { ToastContainer } from "react-toastify";
import EditStepperThird from "../roadmapEdit/EditStepperThird";

const steps = ["Roadmap Details", "Milestones & Sections", "Overview & Submit"];

const RoadmapEdit = observer(() => {
  const { roadmapStore } = useStore();
  const { selectedRoadmap, loadRoadmap, loadingInitial } = roadmapStore;
  const { id } = useParams();
  const navigate = useNavigate();

  const { activeStep, setActiveStep } = roadmapEditStore;

  useEffect(() => {
    if (selectedRoadmap) {
      roadmapEditStore.setRoadmapTitle(selectedRoadmap.title);
      roadmapEditStore.setRoadmapDescription(selectedRoadmap.description);
      roadmapEditStore.setMilestones(selectedRoadmap.milestones || []); 
    }
  }, [selectedRoadmap]);

  useEffect(() => {
    if (id) {
      loadRoadmap(id);
    }
  }, [id, loadRoadmap]);

  const handleSave = () => {
    navigate(`/roadmapDetails/${id}`);
  };

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

  if (loadingInitial) {
    return <LoadingComponent />;
  }

  if (!selectedRoadmap) {
    return <div>Failed to load roadmap. Please try again.</div>;
  }

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

export default RoadmapEdit;