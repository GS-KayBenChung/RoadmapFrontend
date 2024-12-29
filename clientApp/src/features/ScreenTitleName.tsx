interface Props {
    title: string;
}

export default function ScreenTitleName({title}: Props){
    return(
        <div className="flex justify-center w-full my-8">
            <h1 className="text-4xl font-bold">{title}</h1>
        </div>
    )
}