import { useState } from 'react';
import NavBar from '../../app/layout/NavBar';
import CircularProgressBar from '../CircularProgressBar';
import ScreenTitleName from '../ScreenTitleName';
import { Checkbox } from '@mui/material';

type Task = {
  name: string;
  completed: boolean;
};

type Section = {
  name: string;
  tasks: Task[];
};

type Milestone = {
  name: string;
  description: string;
  completionRate: number;
  duration: string;
  sections: Section[];
};

const RoadmapContentPage: React.FC = () => {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<boolean[]>([]);  // Use an array for section expansion states
  const [milestones] = useState<Milestone[]>([ 
    {
      name: "Milestone 1",
      description: "Milestone Description ... when an unknown printer took a galley of type and scrambled it to make a type specimen book. bebsrtbrtttttttttttttttttttttttttttttttttttttttttttt",
      completionRate: 10,
      duration: "1 Month",
      sections: [
        {
          name: "Section 1",
          tasks: [
            { name: "Getting Started", completed: true },
            { name: "Basics", completed: true },
            { name: "Operators", completed: false },
          ],
        },
        {
          name: "Section 2",
          tasks: [
            { name: "Getting Started", completed: true },
            { name: "Basics", completed: false },
            { name: "Operators", completed: false },
          ],
        },
        {
          name: "Section 3",
          tasks: [
            { name: "Getting Started", completed: false },
            { name: "Basics", completed: false },
            { name: "Operators", completed: false },
          ],
        },
      ],
    },
    {
      name: "Milestone 2",
      description: "This is a description for Milestone 2.",
      completionRate: 10,
      duration: "1 Month",
      sections: [
        {
          name: "Section 1",
          tasks: [
            { name: "Task A", completed: true },
            { name: "Task B", completed: false },
          ],
        },
      ],
    },
    {
      name: "Milestone 3",
      description: "This is a description for Milestone 3.",
      completionRate: 10,
      duration: "1 Month",
      sections: [
        {
          name: "Section 1",
          tasks: [
            { name: "Task A", completed: true },
            { name: "Task B", completed: false },
          ],
        },
      ],
    },
    {
      name: "Milestone 4",
      description: "This is a description for Milestone 4.",
      completionRate: 10,
      duration: "1 Month",
      sections: [
        {
          name: "Section 1",
          tasks: [
            { name: "Task A", completed: true },
            { name: "Task B", completed: false },
          ],
        },
      ],
    }, 
  ]);

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

  return (
    <>
      <NavBar />
      <ScreenTitleName title="Roadmap Details" />
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="w-24 h-24 mb-2"> <CircularProgressBar percentage={50} /> </div>
        <div className="text-gray-600 text-sm mt-8"> Durations: 3 Months (02 January 2024 - 02 March 2024) </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold leading-none flex-shrink-0">ROADMAPNAME</h1>
            <Checkbox />
          </div>
          <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 text-sm"> DELETE ROADMAP </button>
        </div>
        <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</div>
      </div>

      <div className="max-w-screen-lg mx-auto p-4 mb-12">
        {milestones.map((milestone, milestoneIndex) => (
          <div key={milestoneIndex}>
            <div className="p-4 rounded-lg border-2 border-gray-300">
              <div
                onClick={() => toggleMilestone(milestoneIndex)}
                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100"
              >
                <div className="relative w-16 h-16"> <CircularProgressBar percentage={50} /> </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold">{milestone.name}</h2>
                      {expandedMilestone === milestoneIndex && (
                        <Checkbox onClick={(e) => e.stopPropagation()} />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">Duration: {milestone.duration}</span>
                  </div>
                  {expandedMilestone === milestoneIndex && (
                    <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
                  )}
                </div>
              </div>

              {expandedMilestone === milestoneIndex && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {milestone.sections.map((section, sectionIndex) => (
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
                        {expandedSections[sectionIndex] &&
                          <Checkbox onClick={(e) => e.stopPropagation()} />
                        }
                      </div>
                      {expandedSections[sectionIndex] && expandedMilestone === milestoneIndex && (
                        <ul>
                          {section.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2">
                              <Checkbox />
                              <span className="text-sm">{task.name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {milestoneIndex < milestones.length - 1 && (
              <div className="flex justify-center items-center">
                <div className="w-1 h-12 bg-blue-400"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default RoadmapContentPage;
