export default function CalendarIcon(props: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      className={"" + (props.className ?? "")}
      onClick={props.onClick}
      width="100%"
      height="100%"
      viewBox="0 0 510 504"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M101.999 65C101.999 45.7553 121.443 16.1231 164.321 13.9125C167.723 13.7371 171.118 14.3614 174.33 15.497L489.499 126.929C501.486 131.167 509.499 142.5 509.499 155.213V421.558C509.499 442.95 461.755 480.204 441.999 472L141.989 313.886C130.544 309.133 123.199 297.833 123.503 285.445L101.999 65Z"
        fill="#F76C6C"
      />
      <path
        d="M98.4864 65.3304C98.9861 44.9406 119.248 30.9824 138.478 37.7812L458.5 150.929C470.486 155.167 478.499 166.5 478.499 179.213V445.558C478.499 466.95 456.75 481.468 436.994 473.264L110.989 337.886C99.5443 333.133 92.1996 321.833 92.5032 309.445L98.4864 65.3304Z"
        fill="#F8E9A1"
      />
      <path
        d="M478.999 236L97.9994 100L93.4447 309.514C93.1762 321.868 100.51 333.123 111.92 337.867L437.481 473.237C457.239 481.452 478.999 466.934 478.999 445.536V236Z"
        fill="#A8D0E6"
        fill-opacity="0.8"
      />
      <path
        d="M97.9996 100.001L478.999 235.001L403.274 470.194C398.165 486.062 381.098 494.722 365.275 489.475L36.4874 380.447C20.756 375.23 12.2352 358.245 17.4589 342.516L97.9996 100.001Z"
        fill="#A8D0E6"
      />

      <rect
        className="calander_rect_line1"
        x="192.385"
        y="180"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 192.385 180)"
        fill="#F8E9A1"
      />
      <rect
        className="calander_rect_line1"
        x="281.812"
        y="212.077"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 281.812 212.077)"
        fill="#F8E9A1"
      />
      <rect
        x="371.319"
        y="238.341"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 371.319 238.341)"
        fill="#F8E9A1"
      />
      <rect
        id="calander_rect_01"
        x="110.385"
        y="144"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.13 102.385 144)"
        fill="#24305E"
      />

      {/* 第二行 */}
      <rect
        x="75.3848"
        y="221"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 75.3848 221)"
        fill="#F8E9A1"
      />
      <rect
        id="calander_rect_02"
        x="166.385"
        y="252"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 166.385 252)"
        fill="#374785"
      />
      <rect
        className="calander_rect_line2"
        x="255.812"
        y="284.077"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 255.812 284.077)"
        fill="#F8E9A1"
      />
      <rect
        x="344.319"
        y="315.341"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 344.319 315.341)"
        fill="#F8E9A1"
      />

      <rect
        id="calander_rect_03"
        x="49.3848"
        y="293"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 49.3848 293)"
        fill="#F76C6C"
      />
      <rect
        x="139.139"
        y="324.132"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 139.139 324.132)"
        fill="#F8E9A1"
      />
      <rect
        x="228.565"
        y="356.209"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 228.565 356.209)"
        fill="#F8E9A1"
      />
      <rect
        x="318.319"
        y="387.341"
        width="75"
        height="50"
        rx="15"
        transform="rotate(19.1296 318.319 387.341)"
        fill="#F8E9A1"
      />
    </svg>
  );
}
