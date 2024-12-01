// import { useEffect, useState } from 'react'
// import axios from 'axios';
// import API_URL from '../../config/apiConfig';
// import { Roadmap } from '../models/roadmap';
import NavBar from './NavBar';
import RoadmapDashboard from '../../features/dashboard/RoadmapDashboard';

function App() {
  //const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  // useEffect(() => {
  //   axios.get<Roadmap[]>(API_URL.roadmap) //axios.get('http://localhost:5000/api/roadmaps')
  //     .then(response => {
  //      setRoadmaps(response.data)
  //     })
  // }, [])

  return (
    <>
      <NavBar/>
      <RoadmapDashboard/>
    
      {/* <h1 className="text-5xl font-bold underline">Test Roadmap</h1>
      <ul>
        {roadmaps.map(roadmap => (
          <li key={roadmap.roadmapId}>
            {roadmap.title}
          </li>
        ))}
      </ul> */}
    </>
  )
}

export default App
