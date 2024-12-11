import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  percentage: number;
}

export default function CircularProgressBar({percentage}: Props){
    return(
        
            <CircularProgressbar
                value={percentage}
                text={`${percentage} %`}
                styles={{
                    path: {
                        stroke: '#4bb3fd', 
                        strokeLinecap: 'round',
                        strokeWidth: 5,
                        transition: 'stroke-dashoffset 0.5s ease 0s', 
                    },
                    text: {
                        fontSize: '18px',
                        fontWeight:'bold',
                        fill: 'black', 
                    },
                }}
            />
      
    )
}