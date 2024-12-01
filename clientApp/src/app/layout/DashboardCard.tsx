interface Props {
    title: string;
    value?: string | number;
    progress?: React.ReactNode;
}

export default function DashboardCard({title, value, progress}: Props){
    return(
        <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center justify-center aspect-square">
            <p className="text-lg font-bold">{title}</p>
            <p className="text-4xl font-bold pt-8">{value}</p>
            {progress}
        </div>
    )
}
