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
import ConfirmModal from '../../app/layout/ConfirmationModel';
import { toast, ToastContainer } from 'react-toastify';
import { runInAction } from 'mobx';
import apiClient from '../../app/api/apiClient';

interface Task{
  taskId: string;
  name: string;
  isCompleted: boolean;
  dateStart: string;
  dateEnd: string;
};

interface Section{
  sectionId: string;
  name: string;
  tasks: Task[];
  isCompleted: boolean;
};

const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

export default observer( function RoadmapDetails() {
  const {roadmapStore} = useStore();
  const {selectedRoadmap, loadRoadmap, loadingInitial} = roadmapStore;
  const {id} = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); 
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState<string | null>(null); 
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<boolean[]>([]); 

  useEffect(() => {      
    if(id) {
      loadRoadmap(id);
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

  const handleDelete = (id: string) => {
    setRoadmapToDelete(id);
    setShowModal(true); 
  };

  const confirmDelete = async () => {
    if (roadmapToDelete) {
      await roadmapStore.deleteRoadmap(roadmapToDelete, selectedRoadmap.title , navigate);
    }
    setShowModal(false); 
  };

  const cancelDelete = () => {
    setShowModal(false); 
  };
  
  const calculateMilestoneDuration = (milestone: any) => {
    if (milestone.sections?.length) {

      const firstSection = milestone.sections[0];
      const firstTask = firstSection.tasks?.[0];
      
      const lastSection = milestone.sections[milestone.sections.length - 1];
      const lastTask = lastSection.tasks?.[lastSection.tasks.length - 1];
  
      if (firstTask && lastTask) {

        const firstTaskDate = new Date(firstTask.dateStart);
        const lastTaskDate = new Date(lastTask.dateEnd);
  

        const durationInDays = Math.ceil((lastTaskDate.getTime() - firstTaskDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return `${durationInDays} ${durationInDays === 1 ? 'day' : 'days'}`;
      }
    }
  
    return 'Duration not available';
  };

  const calculateDurationDate = (): string => {
    let firstTaskDate: Date | null = null;
    let lastTaskDate: Date | null = null;
  
    const totalDuration = selectedRoadmap.milestones?.reduce((acc, milestone) => {
      const allTasks = milestone.sections.flatMap((section: Section) => section.tasks || []);
      if (allTasks.length) {
        const sortedTasks = allTasks.sort((a: { dateStart: string }, b: { dateStart: string }) =>
          new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
        );
  
        const currentFirstTaskDate = new Date(sortedTasks[0].dateStart);
        const currentLastTaskDate = new Date(sortedTasks[sortedTasks.length - 1].dateEnd);
  
        if (!firstTaskDate || currentFirstTaskDate < firstTaskDate) {
          firstTaskDate = currentFirstTaskDate;
        }
        if (!lastTaskDate || currentLastTaskDate > lastTaskDate) {
          lastTaskDate = currentLastTaskDate;
        }
  
        const durationInDays = Math.ceil(
          (lastTaskDate.getTime() - firstTaskDate.getTime()) / (1000 * 60 * 60 * 24)
        );
  
        return durationInDays;
      }
      return acc;
    }, 0);
  
    const formatDate = (date: Date | null): string => {
      if (!date) return '';
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };
  
    const formattedFirstTaskDate = formatDate(firstTaskDate);
    const formattedLastTaskDate = formatDate(lastTaskDate);
  
    return `${formattedFirstTaskDate} To ${formattedLastTaskDate} ( ${totalDuration} ${totalDuration === 1 ? 'day' : 'days'} )`;
  };

  const handlePublishConfirmation = () => {
    if (validateRoadmapBeforePublish()) {
      setShowPublishConfirm(true);
    }
  };
  
  const confirmPublish = async () => {
    const logData = {
      userId: "8f89fd27-b2e7-4849-8ded-1d208c8b06d9",  
      activityAction: `Published roadmap: ${selectedRoadmap.title}`,  
    };
    try {
      await roadmapStore.publishRoadmap(id!);
      await apiClient.Roadmaps.createLog(logData);
      setShowPublishConfirm(false);
      navigate(`/roadmap/${id}`);
    } catch (error) {
      toast.error('Failed to publish the roadmap.');
    }
  };

  const validateRoadmapBeforePublish = () => {
    const hasTasks = selectedRoadmap.milestones.some((milestone: any) =>
      milestone.sections.some((section: any) => section.tasks.length > 0)
    );
    if (!hasTasks) {
      toast.error('You cannot publish a roadmap without any tasks.');
      return false;
    }
    return true;
  };

  const calculateMilestoneProgress = (milestone: any) => {
    const totalTasks = milestone.sections.reduce(
      (count: number, section: any) => count + section.tasks.length,
      0
    );
    const completedTasks = milestone.sections.reduce(
      (count: number, section: any) =>
        count + section.tasks.filter((task: Task) => task.isCompleted).length,
      0
    );
  
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  const calculateRoadmapProgress = (roadmap: any) => {
    const allTasks = roadmap.milestones.flatMap((milestone: any) =>
      milestone.sections.flatMap((section: any) => section.tasks)
    );
  
    const completedTasks = allTasks.filter((task: any) => task.isCompleted).length;
    const totalTasks = allTasks.length;
  
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  const updateProgress = (type: 'roadmap' | 'milestone', id: string) => {
    runInAction(() => {
      if (type === 'roadmap') {
        const roadmap = selectedRoadmap;
        const progress = calculateRoadmapProgress(roadmap);
        roadmap.overallProgress = progress;
        recordChange({ id: roadmap.roadmapId, type: 'roadmap', progress: progress });
        roadmap.isCompleted = progress === 100;
        recordChange({ id: roadmap.roadmapId, type: 'roadmap', isCompleted: roadmap.isCompleted });
      } else if (type === 'milestone') {
        const milestone = selectedRoadmap.milestones.find(
          (milestone: any) => milestone.milestoneId === id
        );
        if (milestone) {
          const progress = calculateMilestoneProgress(milestone);
          milestone.milestoneProgress = progress;
          recordChange({ id: milestone.milestoneId, type: 'milestone', progress: progress });
          milestone.isCompleted = progress === 100;
          recordChange({ id: milestone.milestoneId, type: 'milestone', isCompleted: milestone.isCompleted });
        }
      }
    });
  };
  
  const handleCheckboxChange = (type: 'roadmap' | 'milestone' | 'section' | 'task', isCompleted: boolean, id?: string) => {
    runInAction(() => {
      if (type === 'roadmap') {
        selectedRoadmap.isCompleted = isCompleted;
        selectedRoadmap.milestones.forEach((milestone) => {
          milestone.isCompleted = isCompleted;
          recordChange({ id: milestone.milestoneId, type: 'milestone', isCompleted });
          milestone.sections.forEach((section: any) => {
            section.isCompleted = isCompleted;
            recordChange({ id: section.sectionId, type: 'section', isCompleted });
            section.tasks.forEach((task: any) => {
              task.isCompleted = isCompleted;
              recordChange({ id: task.taskId, type: 'task', isCompleted });
            });
          });
          updateProgress('milestone', milestone.milestoneId);
        });
        updateProgress('roadmap', selectedRoadmap.roadmapId);
      } else if (type === 'milestone') {
        const milestone = selectedRoadmap.milestones.find((m) => m.milestoneId === id);
        if (milestone) {
          milestone.isCompleted = isCompleted;
          recordChange({ id: milestone.milestoneId, type: 'milestone', isCompleted });
          milestone.sections.forEach((section: any) => {
            section.isCompleted = isCompleted;
            recordChange({ id: section.sectionId, type: 'section', isCompleted });
            section.tasks.forEach((task: any) => {
              task.isCompleted = isCompleted;
              recordChange({ id: task.taskId, type: 'task', isCompleted });
            });
          });
          updateProgress('milestone', milestone.milestoneId);
        }
        updateProgress('roadmap', selectedRoadmap.roadmapId);
      } else if (type === 'section') {
        const section = selectedRoadmap.milestones.flatMap(m => m.sections).find(s => s.sectionId === id);
        if (section) {
          section.isCompleted = isCompleted;
          recordChange({ id: section.sectionId, type: 'section', isCompleted });
          section.tasks.forEach((task: any) => {
            task.isCompleted = isCompleted;
            recordChange({ id: task.taskId, type: 'task', isCompleted });
          });
          const milestone = selectedRoadmap.milestones.find(m => m.sections.includes(section));
          if (milestone) {
            updateProgress('milestone', milestone.milestoneId);
          }
        }
        updateProgress('roadmap', selectedRoadmap.roadmapId);
      } else if (type === 'task') {
        const task = selectedRoadmap.milestones.flatMap(m => m.sections).flatMap(s => s.tasks).find(t => t.taskId === id);
        if (task) {
          task.isCompleted = isCompleted;
          recordChange({ id: task.taskId, type: 'task', isCompleted });
          const section = selectedRoadmap.milestones.flatMap(m => m.sections).find(s => s.tasks.includes(task));
          if (section) {
            section.isCompleted = section.tasks.every((t: any) => t.isCompleted);
            recordChange({ id: section.sectionId, type: 'section', isCompleted: section.isCompleted });
            const milestone = selectedRoadmap.milestones.find(m => m.sections.includes(section));
            if (milestone) {
              updateProgress('milestone', milestone.milestoneId);
            }
          }
        }
        updateProgress('roadmap', selectedRoadmap.roadmapId);
      }
    });
  };
  
  const recordChange = async (payload: any) => {
    try {
      await apiClient.Roadmaps.updateCompletion(payload.type,  payload)
    } catch (error) {
      console.error('Error updating completion status:', error);
      toast.error('Error updating completion status');
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
      <ConfirmModal
        actionType="publish"
        isOpen={showPublishConfirm}
        onConfirm={confirmPublish}
        onCancel={() => setShowPublishConfirm(false)}
      />
      <ConfirmModal
        actionType="delete"
        isOpen={showModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <NavBar />
      <ScreenTitleName title={selectedRoadmap.title || 'Roadmap Details'} />
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="w-24 h-24 mb-2">
          <CircularProgressBar percentage={selectedRoadmap.overallProgress} />
        </div>
        <div className="text-gray-600 text-sm mt-8">
          Date: {calculateDurationDate()}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold leading-none flex-shrink-0">{selectedRoadmap.title}</h1>
            {!selectedRoadmap.isDraft && (
              <Checkbox
              checked={selectedRoadmap.isCompleted || false}
              onChange={(e) =>

                handleCheckboxChange('roadmap', e.target.checked, selectedRoadmap.roadmapId)
                
              }
            />
            
            )}
          </div>
          <div className="flex space-x-4">
            {selectedRoadmap.isDraft && (
              <button
                className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 text-sm"
                onClick={handlePublishConfirmation}
              >
                PUBLISH
              </button>
            )}
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-sm"
              onClick={() => navigate(`/roadmapEdit/${selectedRoadmap.roadmapId}`)}
            >
              EDIT
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 text-sm"
              onClick={() => handleDelete(selectedRoadmap.roadmapId)}
            >
              DELETE
            </button>
          </div>
        </div>
        <div>{selectedRoadmap.description}</div>
      </div>

      <div className="max-w-screen-lg mx-auto p-4 mb-12">
        {selectedRoadmap.milestones?.map((milestone, milestoneIndex) => (
          <div key={milestone.milestoneId}>
            <div className="p-4 rounded-lg border-2 border-gray-300">
              <div
                onClick={() => toggleMilestone(milestoneIndex)}
                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100"
              >
                <div className="relative w-16 h-16">
                  <CircularProgressBar percentage={milestone.milestoneProgress || 0} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold">{milestone.name}</h2>
                      {expandedMilestone === milestoneIndex ? (
                        !selectedRoadmap.isDraft ? (
                          <Checkbox
                            checked={milestone.isCompleted || false}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>

                              handleCheckboxChange('milestone',  e.target.checked, milestone.milestoneId)

                            }
                          />
                        ) : null
                      ) : null}
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
                      key={section.sectionId}
                      onClick={() => toggleSection(milestoneIndex, sectionIndex)}
                      className={`p-4 border rounded-lg bg-gray-100 ${
                        expandedSections[sectionIndex] ? '' : 'h-14'
                      } ${
                        expandedSections[sectionIndex] ? 'overflow-visible' : 'overflow-hidden'
                      }`}
                    >
                      <div className="flex items-center space-x-3 w-full cursor-pointer hover:bg-gray-100">
                        <h3  className={`font-semibold break-words w-full md:max-w-[calc(100%-2rem)] ${!selectedRoadmap.isDraft ? 'pl-3' : ''}`}>
                          {section.name}
                        </h3>
                        {expandedSections[sectionIndex] && !selectedRoadmap.isDraft && (
                          
                          <Checkbox
                            checked={section.isCompleted}
                            onChange={(e) =>

                              handleCheckboxChange('section',  e.target.checked, section.sectionId)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />

                        )}
                      </div>
                      {expandedSections[sectionIndex] && expandedMilestone === milestoneIndex && (
                        <ul>
                          {section.tasks?.map((task: Task) => (
                            <li key={task.taskId} className="flex items-center space-x-2">
                              {!selectedRoadmap.isDraft && (
                                <Checkbox
                                  checked={task.isCompleted}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleCheckboxChange('task',  e.target.checked, task.taskId)
                                  }
                                />
                              )}
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
});