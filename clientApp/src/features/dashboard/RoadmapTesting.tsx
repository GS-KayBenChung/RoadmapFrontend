// import { useState } from "react";
// import { observer } from "mobx-react-lite";
// import { FaTh, FaListUl } from "react-icons/fa";
// import { Button } from "@mui/material";
// import { useStore } from "../../app/stores/store";
// import RoadmapCard from "../../app/layout/RoadmapCard";
// import TableComponent from "../../app/layout/TableComponent";
// import TestList from "../TestList";
// import TestDetails from "../details/TestDetails";
// import RoadmapForm from "../form/RoadmapForm";
// import LoadingComponent from "../../app/layout/LoadingComponent";

// const RoadmapTesting = observer(() => {
//   const { roadmapStore } = useStore();
//   const {
//     roadmaps,
//     selectedRoadmap,
//     editMode,
//     submitting,
//     loadingInitial,
//     handleSelectRoadmap,
//     handleCancelSelectRoadmap,
//     handleFormOpen,
//     handleFormClose,
//     handleCreateOrEditRoadmap,
//     handleDeleteRoadmap,
//   } = roadmapStore;

//   const [viewType, setViewType] = useState("card");

//   const toggleView = (type: string) => {
//     setViewType(type);
//   };

//   if (loadingInitial) return <LoadingComponent content="Loading Roadmaps..." />;

//   return (
//     <>
//       <Button onClick={() => handleFormOpen()}>Create Roadmap</Button>

//       <div className="flex justify-end gap-4 mb-6">
//         <button
//           onClick={() => toggleView("card")}
//           className={`px-4 py-4 rounded ${
//             viewType === "card" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
//           } hover:bg-blue-600`}
//         >
//           <FaTh className="text-lg" />
//         </button>
//         <button
//           onClick={() => toggleView("list")}
//           className={`px-4 py-4 rounded ${
//             viewType === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
//           } hover:bg-blue-600`}
//         >
//           <FaListUl className="text-lg" />
//         </button>
//       </div>

//       {viewType === "card" ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
//           {roadmaps.map((roadmap) => (
//             <div key={roadmap.roadmapId}>
//               <RoadmapCard name={roadmap.title} progress={roadmap.overallProgress} />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <TableComponent
//           columns={[
//             { header: "Title", accessor: "title" },
//             { header: "Created Date", accessor: "createdAt" },
//             { header: "Description", accessor: "description" },
//             { header: "Status", accessor: "status" },
//           ]}
//           data={roadmaps}
//         />
//       )}

//       <TestList
//         roadmaps={roadmaps}
//         selectRoadmap={handleSelectRoadmap}
//         deleteRoadmap={handleDeleteRoadmap}
//         submitting={submitting}
//       />
      
//       {selectedRoadmap && !editMode && (
//         <TestDetails
//           roadmap={selectedRoadmap}
//           cancelSelectRoadmap={handleCancelSelectRoadmap}
//           openForm={handleFormOpen}
//         />
//       )}

//       {editMode && (
//         <RoadmapForm
//           closeForm={handleFormClose}
//           roadmap={selectedRoadmap}
//           createOrEdit={handleCreateOrEditRoadmap}
//           submitting={submitting}
//         />
//       )}
//     </>
//   );
// });

// export default RoadmapTesting;
