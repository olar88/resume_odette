import React from "react";
import SingAnimation from "../../animates/signAnimate/signAnimatePage";
import EllipticalCircle from "../../animates/circleAnimate/circleAnimatePage";
import { colorEnum } from "../../components/allEnum";
import IntroducePage from "./introducePage";
import GuidePage from "./guidePage";

function MainPage() {
  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center">
        <EllipticalCircle
          diameter={0}
          ellipseWidth={280}
          ellipseHeight={280}
          ellipseCount={20}
          strokeColor={colorEnum.primary}
          strokeWidth={1}
          backgroundColor={colorEnum.primary_dark}
        />
        <SingAnimation />
      </div>
      <IntroducePage/>
      <GuidePage/>
    </React.Fragment>
  );
}

export default MainPage;
