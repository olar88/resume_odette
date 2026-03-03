export default function DeleteIcon(props: {
    className?: string;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
    style?: React.CSSProperties,
    fill?: string
}) {
    return <svg
        className={props.className}
        onClick={props.onClick}
        style={props.style}
        width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12V17" stroke={props.fill ?? "#000000"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14 12V17" stroke={props.fill ?? "#000000"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4 7H20" stroke={props.fill ?? "#000000"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke={props.fill ?? "#000000"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke={props.fill ?? "#000000"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
}