import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import API_URL from './config/apiConfig';

 interface Roadmap {
    id: number;
    title: string;
  }

function App() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

 
  useEffect(() => {
    axios.get(API_URL.roadmap) //axios.get('http://localhost:5000/api/roadmaps')
      .then(response => {
       setRoadmaps(response.data)
      })
  }, [])

  return (
    <>
      <h1>Test Roadmap</h1>
      <ul>
        {roadmaps.map( (roadmap : any) => (
          <li key={roadmap.id}>
            {roadmap.title}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
