import React from "react";
import { AnimatedShowUpComponent } from "../../components/AnimatedShowUpComponent";
import BackIcon from "../../svg/img_back";
import { useNavigate } from "react-router-dom";
import SingAnimation from "../../animates/signAnimate/signAnimatePage";

export default function PrivacyPage() {
    const navigate = useNavigate()

    return <React.Fragment>
        <div className=" w-100 h-100 bg_light p-3 min-vh-100">
            <div className="me-auto ms-auto d-flex flex-column gap-3 w-75">
                <AnimatedShowUpComponent
                    className="privacy_title"
                    children={"Copyright and Privacy Statemet"}
                    rootMargin="-10px"
                />
                <AnimatedShowUpComponent
                    className="privacy_content"
                    children={<React.Fragment>All ideas, designs, and source code in this project were independently developed and written by me, Odette Liu (hereinafter referred to as "the Author"). The ownership and copyright of all original content belong solely to the Author. Unless explicitly authorized, any reproduction, distribution, modification, or commercial use is strictly prohibited and may result in legal action.
                        <br /><br />
                        This project may include third-party libraries, packages, or open-source tools, all of which are used solely for non-commercial purposes. If you are a rights holder and believe that your intellectual property has been used without proper authorization, please contact me immediately at parkeunyeon18@gmail.com. I will fully cooperate in removing or replacing the affected components.
                        <br /><br />
                        I welcome the use of this open-source code for non-commercial purposes such as academic research, personal study, or educational projects. However, proper credit must be given by citing the original source and author’s name. Unauthorized commercial use, reproduction, or plagiarism is strictly forbidden and will be pursued to the fullest extent of the law.
                        <br /><br />
                        This project does not collect, store, or transmit any personal data from users. No background tracking, analytics, or data profiling features are included. Should future versions introduce features that involve user interaction or data processing, a clear and transparent notice will be provided beforehand, and any data handling will comply with applicable data protection laws, including the Personal Data Protection Act and similar regulations.
                        <br /><br />
                        The Author reserves the right to update or amend this statement at any time. The latest version will always be publicly available on this page. Users are encouraged to review this statement periodically to stay informed about the applicable terms. If you have any questions or concerns regarding this statement, please feel free to reach out via email.
                    </React.Fragment>}
                />
            </div>
            <div className="iconBtn position-absolute end-0 top-0" style={{ width: "45px" }} onClick={() => {
                navigate("/")
            }}>
                <BackIcon className=" w-100" />
            </div>
            <div className=" position-fixed bottom-0" style={{ right: "10px" }}>
                <SingAnimation />
            </div>
        </div>
    </React.Fragment>
}