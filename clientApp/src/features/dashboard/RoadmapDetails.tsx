import { useEffect, useState } from 'react';
import NavBar from '../../app/layout/NavBar';
import CircularProgressBar from '../CircularProgressBar';
import ScreenTitleName from '../ScreenTitleName';
import { Checkbox } from '@mui/material';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useNavigate } from 'react-router-dom';

interface Task{
  name: string;
  completed: boolean;
  dateStart: string;
  dateEnd: string;
};

interface Section{
  name: string;
  tasks: Task[];
};

const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

export default observer( function RoadmapDetails() {
  const {roadmapStore} = useStore();
  const {selectedRoadmap, loadRoadmap, loadingInitial} = roadmapStore;
  const {id} = useParams();
  const navigate = useNavigate();

  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<boolean[]>([]); 

  useEffect(() => {      
    if(id) {
      loadRoadmap(id);
      //console.log("SelectedRoadmap"+ selectedRoadmap?.milestones);
      //console.log("Roadmap"+ roadmapStore.roadmaps);
    }
    else {
      console.log("Failed");    
    }
  }, [id, loadRoadmap])

  if(loadingInitial || !selectedRoadmap) return <LoadingComponent/>;

  const toggleMilestone = (index: number) => {
    setExpandedMilestone(expandedMilestone === index ? null : index);
  };

  const toggleSection = (_milestoneIndex: number, sectionIndex: number) => {
    setExpandedSections((prevState) => {
      const updatedSections = [...prevState];
      updatedSections[sectionIndex] = !updatedSections[sectionIndex];
      return updatedSections;
    });
  };

  const handleDelete = async (id: string) => {
    await roadmapStore.deleteRoadmap(id, navigate);
  };

  const calculateMilestoneDuration = (milestone: any) => {
    if (milestone.sections?.length) {
      // Get the first section and its first task
      const firstSection = milestone.sections[0];
      const firstTask = firstSection.tasks?.[0];
      
      // Get the last section and its last task
      const lastSection = milestone.sections[milestone.sections.length - 1];
      const lastTask = lastSection.tasks?.[lastSection.tasks.length - 1];
  
      if (firstTask && lastTask) {
        // Parse the dates of the first and last tasks
        const firstTaskDate = new Date(firstTask.dateStart);
        const lastTaskDate = new Date(lastTask.dateEnd);
  
        // Calculate the duration in days
        const durationInDays = Math.ceil((lastTaskDate.getTime() - firstTaskDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return `${durationInDays} ${durationInDays === 1 ? 'day' : 'days'}`;
      }
    }
  
    return 'Duration not available';
  };

  return (
    <>
      <NavBar />
      <ScreenTitleName title={selectedRoadmap.title || 'Roadmap Details'} />
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="w-24 h-24 mb-2">
          <CircularProgressBar percentage={selectedRoadmap.overallProgress} />
        </div>
        <div className="text-gray-600 text-sm mt-8">
          Duration: {(() => {
            if (selectedRoadmap) {
              const totalDuration = selectedRoadmap.milestones?.reduce((acc, milestone) => {
                const allTasks = milestone.sections.flatMap((section: Section) => section.tasks || []);
                if (allTasks.length) {
                  const sortedTasks = allTasks.sort((a: { dateStart: string }, b: { dateStart: string }) =>
                    new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
                  );

                  const firstTaskDate = new Date(sortedTasks[0].dateStart);
                  const lastTaskDate = new Date(sortedTasks[sortedTasks.length - 1].dateEnd);
                  const durationInDays = Math.ceil((lastTaskDate.getTime() - firstTaskDate.getTime()) / (1000 * 60 * 60 * 24));

                  return acc + durationInDays;
                }
                return acc; 
              }, 0); 

              return `${totalDuration} ${totalDuration === 1 ? 'day' : 'days'}`;
            }
            return 'Duration';
          })()}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold leading-none flex-shrink-0">{selectedRoadmap.title}</h1>
            <Checkbox />
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-sm"
              onClick={() => navigate(`/roadmapEdit/${selectedRoadmap.roadmapId}`)}
            >
              EDIT
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 text-sm"
              onClick={() => handleDelete(roadmapStore.selectedRoadmap?.roadmapId || '')}
            >
              DELETE
            </button>
          </div>
        </div>
        <div>{selectedRoadmap.description}</div>
      </div>

      <div className="max-w-screen-lg mx-auto p-4 mb-12">
        {selectedRoadmap.milestones?.map((milestone, milestoneIndex) => (
          <div key={milestoneIndex}>
            <div className="p-4 rounded-lg border-2 border-gray-300">
              <div
                onClick={() => toggleMilestone(milestoneIndex)}
                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100"
              >
                <div className="relative w-16 h-16">
                  <CircularProgressBar percentage={ milestone.milestoneProgress || 0} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold">{milestone.name}</h2>
                      {expandedMilestone === milestoneIndex && (
                        <Checkbox onClick={(e) => e.stopPropagation()} />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      Duration: {calculateMilestoneDuration(milestone)}
                    </span>
                  </div>
                  {expandedMilestone === milestoneIndex && (
                    <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
                  )}
                </div>
              </div>

              {expandedMilestone === milestoneIndex && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {milestone.sections?.map((section: Section, sectionIndex: number) => (
                    <div
                      onClick={() => toggleSection(milestoneIndex, sectionIndex)}
                      key={sectionIndex}
                      className={`
                        p-4 border rounded-lg bg-gray-100
                        ${expandedSections[sectionIndex] ? '' : 'h-14'}
                        ${expandedSections[sectionIndex] ? 'overflow-visible' : 'overflow-hidden'}
                      `}
                    >
                      <div className="flex items-center space-x-3 w-full cursor-pointer hover:bg-gray-100">
                        <h3 className="pl-3 font-semibold break-words w-full md:max-w-[calc(100%-2rem)]">{section.name}</h3>
                        {expandedSections[sectionIndex] && <Checkbox onClick={(e) => e.stopPropagation()} />}
                      </div>
                      {expandedSections[sectionIndex] && expandedMilestone === milestoneIndex && (
                        <ul>
                          {section.tasks?.map((task: Task, taskIndex: number) => (
                            <li key={taskIndex} className="flex items-center space-x-2">
                              
                              <div className="flex items-center h-full">
                                <Checkbox checked={task.completed} onClick={(e) => e.stopPropagation()} />
                              </div>

                              <div>
                                <span className="block text-sm font-medium text-gray-800">{task.name}</span>
                                <span className="block text-xs text-gray-600">
                                  ({formatDate(task.dateStart)} - {formatDate(task.dateEnd)})
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {milestoneIndex < selectedRoadmap.milestones.length - 1 && (
              <div className="flex justify-center items-center">
                <div className="w-1 h-12 bg-blue-400"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
})
