import React, { useState, } from "react";
import { colorType } from "../allType";

/**@description 遊戲樣式 Icon Button */
export default function GameIconButton(props: {
    color: colorType,
    clickEvent: Function,
    className?: string,
    id?: string,
    style?: React.CSSProperties


}) {

    if (props.color === colorType.yellow) {
        return <React.Fragment>
            <button
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + ' icon_btn yellow'}
                onClick={() => { if (props.clickEvent) props.clickEvent(); }}
                style={props.style}
            >
                <svg width="62" height="64" viewBox="0 0 62 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M59.5 32C59.5 48.0541 46.7026 61 31 61C15.2974 61 2.5 48.0541 2.5 32C2.5 15.9459 15.2974 3 31 3C46.7026 3 59.5 15.9459 59.5 32Z"
                        fill="#F5C646" stroke="#F7FEF9" fillOpacity="0.75" strokeWidth="5" />
                    <ellipse cx="36.9358" cy="34.7125" rx="11.7838" ry="14.2149"
                        transform="rotate(28.1447 36.9358 34.7125)" fill="#BC7D01" fillOpacity="0.5" />
                    <circle cx="22.5" cy="17" r="2.5" fill="#F4EFDD" fillOpacity="1" />
                    <ellipse cx="11" cy="28" rx="1" ry="1.5" fill="#F4EFDD" fillOpacity="1" />
                    <path
                        d="M42.5 28.9019C44.5 30.0566 44.5 32.9434 42.5 34.0981L27.5 42.7583C25.5 43.913 23 42.4697 23 40.1603L23 22.8397C23 20.5303 25.5 19.087 27.5 20.2417L42.5 28.9019Z"
                        fill="white" />
                </svg>
            </button>
        </React.Fragment>
    }

    else if (props.color === colorType.orange) {
        return <React.Fragment>
            <button
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + ' icon_btn orange'}
                onClick={() => { if (props.clickEvent) props.clickEvent(); }}
                style={props.style}
            >
                <svg width="62" height="63" viewBox="0 0 62 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M59.5 31.5C59.5 47.5541 46.7026 60.5 31 60.5C15.2974 60.5 2.5 47.5541 2.5 31.5C2.5 15.4459 15.2974 2.5 31 2.5C46.7026 2.5 59.5 15.4459 59.5 31.5Z"
                        fill="#FB571F" stroke="#F7FEF9" fillOpacity="0.75" strokeWidth="5" />
                    <ellipse className="shadowCircle" cx="36.9358" cy="34.2125" rx="11.7838" ry="14.2149"
                        transform="rotate(28.1447 36.9358 34.2125)" fill="#FB571F" fillOpacity="0.5" />
                    <circle cx="22.5" cy="16.5" r="2.5" fill="#D9D9D9" fillOpacity="0.5" />
                    <ellipse cx="11" cy="27.5" rx="1" ry="1.5" fill="#D9D9D9" fillOpacity="0.8" />
                    <path
                        d="M42.5 28.4019C44.5 29.5566 44.5 32.4434 42.5 33.5981L27.5 42.2583C25.5 43.413 23 41.9697 23 39.6603L23 22.3397C23 20.0303 25.5 18.587 27.5 19.7417L42.5 28.4019Z"
                        fill="white" />
                </svg>
            </button>
        </React.Fragment>
    }

    else if (props.color === colorType.green) {
        return <React.Fragment>
            <button
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + ' icon_btn green'}
                onClick={() => { if (props.clickEvent) props.clickEvent(); }}
                style={props.style}
            >
                <svg width="62" height="63" viewBox="0 0 62 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M59.5 31.5C59.5 47.5541 46.7026 60.5 31 60.5C15.2974 60.5 2.5 47.5541 2.5 31.5C2.5 15.4459 15.2974 2.5 31 2.5C46.7026 2.5 59.5 15.4459 59.5 31.5Z"
                        fill="#2A636C" fillOpacity="0.75" stroke="#F7FEF9" strokeWidth="5" />
                    <ellipse cx="36.9358" cy="34.2125" rx="11.7838" ry="14.2149"
                        transform="rotate(28.1447 36.9358 34.2125)" fill="#2A636C" />
                    <circle cx="22.5" cy="16.5" r="2.5" fill="#D9D9D9" fillOpacity="0.5" />
                    <ellipse cx="11" cy="27.5" rx="1" ry="1.5" fill="#D9D9D9" fillOpacity="0.8" />
                    <path
                        d="M42.5 28.4019C44.5 29.5566 44.5 32.4434 42.5 33.5981L27.5 42.2583C25.5 43.413 23 41.9697 23 39.6603L23 22.3397C23 20.0303 25.5 18.587 27.5 19.7417L42.5 28.4019Z"
                        fill="white" />
                </svg>
            </button>
        </React.Fragment>
    }
    else if (props.color === colorType.greenRelaod) {
        return <React.Fragment>
            <button
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + ' icon_btn green'}
                onClick={() => { if (props.clickEvent) props.clickEvent(); }}
                style={props.style}
            >
                <svg width="62" height="63" viewBox="0 0 62 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.5 31.5C59.5 47.5541 46.7026 60.5 31 60.5C15.2974 60.5 2.5 47.5541 2.5 31.5C2.5 15.4459 15.2974 2.5 31 2.5C46.7026 2.5 59.5 15.4459 59.5 31.5Z" fill="#2A636C" fillOpacity="0.75" stroke="#F7FEF9" strokeWidth="5" />
                    <ellipse cx="36.9358" cy="34.2125" rx="11.7838" ry="14.2149" transform="rotate(28.1447 36.9358 34.2125)" fill="#2A636C" />
                    <circle cx="22.5" cy="16.5" r="2.5" fill="#D9D9D9" fillOpacity="0.5" />
                    <ellipse cx="11" cy="27.5" rx="1" ry="1.5" fill="#D9D9D9" fillOpacity="0.8" />
                    <mask id="path-5-inside-1_268_132" fill="white">
                        <path fillRule="evenodd" clipRule="evenodd" d="M37.1827 36.5929C33.9001 39.5502 28.8417 39.2865 25.8844 36.0039C25.145 35.1832 23.8804 35.1173 23.0598 35.8566C22.2391 36.596 22.1732 37.8606 22.9125 38.6812C27.3485 43.6051 34.9362 44.0007 39.8601 39.5647C44.784 35.1287 45.1795 27.5411 40.7435 22.6172C39.4511 21.1825 37.0075 19.6053 34.0976 18.9969C31.0958 18.3693 27.5189 18.764 24.2335 21.4522C23.2897 22.2244 22.2707 23.7571 21.5732 25.2051C21.337 25.6954 21.1167 26.2184 20.936 26.7518L19.7011 25.1014C19.2048 24.4381 18.2647 24.3027 17.6014 24.799C16.9381 25.2953 16.8028 26.2354 17.2991 26.8987L21.1122 31.9947L21.9685 33.1391L23.1529 32.339L28.4269 28.7761C29.1134 28.3124 29.2939 27.3799 28.8302 26.6935C28.3664 26.007 27.434 25.8265 26.7476 26.2902L24.9147 27.5284C24.9935 27.3362 25.0812 27.1396 25.1768 26.941C25.7797 25.6896 26.4909 24.7734 26.7665 24.548C28.9811 22.736 31.279 22.4941 33.279 22.9123C35.3709 23.3496 37.0562 24.5003 37.7717 25.2945C40.729 28.5771 40.4653 33.6356 37.1827 36.5929Z" />
                    </mask>
                    <path d="M25.8844 36.0039L22.1696 39.3506L22.1696 39.3506L25.8844 36.0039ZM22.9125 38.6812L26.6273 35.3346L26.6273 35.3346L22.9125 38.6812ZM39.8601 39.5647L36.5134 35.8499L36.5134 35.8499L39.8601 39.5647ZM40.7435 22.6172L44.4583 19.2705L44.4583 19.2705L40.7435 22.6172ZM34.0976 18.9969L33.0744 23.8911L33.0744 23.8911L34.0976 18.9969ZM24.2335 21.4522L21.0673 17.5824L21.0673 17.5824L24.2335 21.4522ZM21.5732 25.2051L17.0686 23.0351L17.0686 23.0351L21.5732 25.2051ZM20.936 26.7518L16.9327 29.7473L22.6241 37.3536L25.6718 28.3558L20.936 26.7518ZM19.7011 25.1014L23.7044 22.1058L23.7044 22.1058L19.7011 25.1014ZM17.6014 24.799L14.6059 20.7957L14.6059 20.7957L17.6014 24.799ZM17.2991 26.8987L13.2957 29.8942L13.2957 29.8942L17.2991 26.8987ZM21.1122 31.9947L17.1089 34.9902L17.1089 34.9902L21.1122 31.9947ZM21.9685 33.1391L17.9652 36.1347L20.8196 39.9493L24.7675 37.2823L21.9685 33.1391ZM23.1529 32.339L25.9519 36.4822L25.9519 36.4822L23.1529 32.339ZM28.4269 28.7761L25.628 24.6329L25.628 24.6329L28.4269 28.7761ZM28.8302 26.6935L24.687 29.4924L24.687 29.4924L28.8302 26.6935ZM26.7476 26.2902L23.9486 22.147L23.9486 22.147L26.7476 26.2902ZM24.9147 27.5284L20.2881 25.6325L14.0237 40.9199L27.7137 31.6716L24.9147 27.5284ZM25.1768 26.941L29.6814 29.111L29.6814 29.111L25.1768 26.941ZM26.7665 24.548L29.9327 28.4177L29.9327 28.4177L26.7665 24.548ZM33.279 22.9123L34.3022 18.0181L34.3022 18.0181L33.279 22.9123ZM37.7717 25.2945L41.4865 21.9478L41.4865 21.9478L37.7717 25.2945ZM22.1696 39.3506C26.9752 44.6848 35.1952 45.1133 40.5294 40.3077L33.836 32.8781C32.6051 33.9871 30.7081 33.8882 29.5991 32.6572L22.1696 39.3506ZM26.4064 39.5714C25.1755 40.6804 23.2785 40.5815 22.1696 39.3506L29.5992 32.6572C27.0115 29.7849 22.5854 29.5542 19.7131 32.1418L26.4064 39.5714ZM26.6273 35.3346C27.7363 36.5655 27.6374 38.4625 26.4064 39.5714L19.7131 32.1418C16.8408 34.7295 16.6101 39.1556 19.1977 42.0279L26.6273 35.3346ZM36.5134 35.8499C33.6411 38.4376 29.215 38.2068 26.6273 35.3346L19.1977 42.0279C25.482 49.0034 36.2312 49.5638 43.2067 43.2795L36.5134 35.8499ZM37.0287 25.9638C39.6164 28.8361 39.3857 33.2623 36.5134 35.8499L43.2067 43.2795C50.1823 36.9952 50.7426 26.246 44.4583 19.2705L37.0287 25.9638ZM33.0744 23.8911C34.9618 24.2857 36.4575 25.3298 37.0287 25.9639L44.4583 19.2705C42.4446 17.0353 39.0532 14.9248 35.1208 14.1027L33.0744 23.8911ZM27.3997 25.3219C29.3444 23.7308 31.3216 23.5246 33.0744 23.8911L35.1208 14.1027C30.8701 13.214 25.6934 13.7973 21.0673 17.5824L27.3997 25.3219ZM26.0778 27.375C26.3204 26.8713 26.6179 26.358 26.9147 25.9318C27.2411 25.4627 27.4277 25.2991 27.3997 25.3219L21.0673 17.5824C19.289 19.0374 17.8853 21.3398 17.0686 23.0351L26.0778 27.375ZM25.6718 28.3558C25.7767 28.0461 25.915 27.713 26.0778 27.375L17.0686 23.0351C16.759 23.6777 16.4567 24.3908 16.2003 25.1478L25.6718 28.3558ZM15.6977 28.0969L16.9327 29.7473L24.9394 23.7562L23.7044 22.1058L15.6977 28.0969ZM20.597 28.8024C19.0493 29.9604 16.8558 29.6446 15.6977 28.0969L23.7044 22.1058C21.5537 19.2316 17.4802 18.645 14.6059 20.7957L20.597 28.8024ZM21.3024 23.9032C22.4605 25.4508 22.1447 27.6443 20.597 28.8024L14.6059 20.7957C11.7316 22.9464 11.145 27.0199 13.2957 29.8942L21.3024 23.9032ZM25.1156 28.9992L21.3024 23.9032L13.2957 29.8942L17.1089 34.9902L25.1156 28.9992ZM25.9719 30.1436L25.1156 28.9992L17.1089 34.9902L17.9652 36.1347L25.9719 30.1436ZM20.354 28.1958L19.1696 28.9959L24.7675 37.2823L25.9519 36.4822L20.354 28.1958ZM25.628 24.6329L20.354 28.1958L25.9519 36.4822L31.2259 32.9193L25.628 24.6329ZM24.687 29.4924C23.6049 27.8907 24.0262 25.715 25.628 24.6329L31.2259 32.9193C34.2005 30.9097 34.9829 26.8692 32.9734 23.8945L24.687 29.4924ZM29.5465 30.4334C27.9448 31.5154 25.7691 31.0942 24.687 29.4924L32.9734 23.8945C30.9638 20.9198 26.9233 20.1375 23.9486 22.147L29.5465 30.4334ZM27.7137 31.6716L29.5465 30.4334L23.9486 22.147L22.1158 23.3852L27.7137 31.6716ZM20.6723 24.7711C20.5356 25.0547 20.4068 25.3427 20.2881 25.6325L29.5414 29.4242C29.5801 29.3297 29.6268 29.2245 29.6814 29.111L20.6723 24.7711ZM23.6003 20.6782C22.893 21.2569 22.3191 22.031 21.9892 22.5054C21.5602 23.1224 21.0956 23.8923 20.6723 24.7711L29.6814 29.111C29.8609 28.7384 30.0534 28.4244 30.1996 28.2141C30.2345 28.164 30.2635 28.1243 30.2857 28.0951C30.3083 28.0653 30.3201 28.0511 30.3201 28.0511C30.3198 28.0515 30.3148 28.0574 30.3051 28.0683C30.2956 28.0789 30.2788 28.0975 30.2549 28.1225C30.221 28.1579 30.1092 28.2733 29.9327 28.4177L23.6003 20.6782ZM34.3022 18.0181C31.0453 17.3372 27.1501 17.7738 23.6003 20.6782L29.9327 28.4177C30.4454 27.9982 30.8506 27.8468 31.1454 27.784C31.4595 27.7171 31.8217 27.7157 32.2558 27.8064L34.3022 18.0181ZM41.4865 21.9478C40.0499 20.3532 37.4168 18.6692 34.3022 18.0181L32.2558 27.8064C32.7187 27.9032 33.1741 28.0896 33.5594 28.3099C33.7472 28.4174 33.8938 28.5189 33.9937 28.5966C34.1028 28.6814 34.1141 28.7047 34.0569 28.6412L41.4865 21.9478ZM40.5294 40.3077C45.8636 35.502 46.2921 27.2821 41.4865 21.9478L34.0569 28.6412C35.1659 29.8722 35.067 31.7691 33.836 32.8781L40.5294 40.3077Z" fill="#F7FEF9" mask="url(#path-5-inside-1_268_132)" />
                </svg>

            </button>
        </React.Fragment>
    }
    else if (props.color === colorType.greenBack) {
        return <React.Fragment>
            <button
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + ' icon_btn green'}
                onClick={() => { if (props.clickEvent) props.clickEvent(); }}
                style={props.style}
            >
                <svg width="65" height="63" viewBox="0 0 65 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.5 31.5C59.5 47.5541 46.7026 60.5 31 60.5C15.2974 60.5 2.5 47.5541 2.5 31.5C2.5 15.4459 15.2974 2.5 31 2.5C46.7026 2.5 59.5 15.4459 59.5 31.5Z" fill="#2A636C" fillOpacity="0.75" stroke="#F7FEF9" strokeWidth="5" />
                    <ellipse cx="36.9358" cy="34.2125" rx="11.7838" ry="14.2149" transform="rotate(28.1447 36.9358 34.2125)" fill="#2A636C" />
                    <circle cx="22.5" cy="16.5" r="2.5" fill="#D9D9D9" fillOpacity="0.5" />
                    <ellipse cx="11" cy="27.5" rx="1" ry="1.5" fill="#D9D9D9" fillOpacity="0.8" />
                    <path d="M24.2743 21.2867L30.2743 25.2242C30.4152 25.3166 30.5 25.4737 30.5 25.6422V50.1224C30.5 50.471 30.1524 50.7126 29.8257 50.5911L23.8257 48.3598C23.6299 48.287 23.5 48.1001 23.5 47.8912V21.7047C23.5 21.307 23.9418 21.0685 24.2743 21.2867Z" fill="#F7FEF9" stroke="#F7FEF9" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M39 42.0606V46C39 47.1046 38.1046 48 37 48H25C23.8954 48 23 47.1046 23 46V22C23 20.8954 23.8954 20 25 20H37C38.1046 20 39 20.8954 39 22V26.7879" stroke="#F7FEF9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M34.6285 33.6499C34.3523 33.648 34.1269 33.8703 34.125 34.1465C34.1231 34.4226 34.3454 34.648 34.6215 34.6499L34.6285 33.6499ZM43.4759 34.5648C43.6725 34.3709 43.6747 34.0543 43.4808 33.8577L40.3209 30.6538C40.127 30.4571 39.8104 30.4549 39.6138 30.6489C39.4172 30.8428 39.415 31.1593 39.6089 31.3559L42.4177 34.2039L39.5698 37.0127C39.3732 37.2066 39.371 37.5231 39.5649 37.7198C39.7588 37.9164 40.0753 37.9186 40.272 37.7246L43.4759 34.5648ZM34.6215 34.6499L43.1213 34.7088L43.1283 33.7088L34.6285 33.6499L34.6215 34.6499Z" fill="#F7FEF9" />
                </svg>

            </button>
        </React.Fragment>
    }
    else {
        console.log('color tpye error! type:', props.color);
        return <button className="bg-danger">ERROR</button>
    }
}