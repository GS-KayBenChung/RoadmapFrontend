interface Props {
    title: string;
}

export default function ScreenTitleName({title}: Props){
    return(
        <h1 className="text-2xl font-bold mb-8">{title}</h1>
    )
}