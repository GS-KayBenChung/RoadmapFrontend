interface Props {
    content?: string;
}

export default function LoadingButtonComponent({ content = 'Loading...' }: Props) {
    return (
        <div className="flex items-center justify-center gap-2">
            <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
            {content && <span className="text-white text-sm">{content}</span>}
        </div>
    );
}
