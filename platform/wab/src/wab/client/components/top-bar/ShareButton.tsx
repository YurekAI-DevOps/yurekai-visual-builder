// This is a skeleton starter React component generated by Plasmic.
// This file is owned by you, feel free to edit as you see fit.
import { useAppCtx } from "@/wab/client/contexts/AppContexts";
import { plasmicIFrameMouseDownEvent } from "@/wab/client/definitions/events";
import {
  DefaultShareButtonProps,
  PlasmicShareButton,
} from "@/wab/client/plasmic/plasmic_kit_top_bar/PlasmicShareButton";
import { ensure, spawn } from "@/wab/common";
import { observer } from "mobx-react-lite";
import * as React from "react";

interface ShareButtonProps extends DefaultShareButtonProps {}

const ShareButton = observer((props: ShareButtonProps) => {
  const appCtx = useAppCtx();
  const topFrameApi = ensure(appCtx.topFrameApi, "missing topFrameApi");
  React.useEffect(() => {
    const handler = () => {
      spawn(topFrameApi.setShowShareModal(false));
    };
    document.addEventListener(plasmicIFrameMouseDownEvent, handler);
    return () => {
      document.removeEventListener(plasmicIFrameMouseDownEvent, handler);
    };
  });
  return (
    <>
      <PlasmicShareButton
        {...props}
        onClick={() => topFrameApi.setShowShareModal(true)}
        tooltip="Share project"
      />
    </>
  );
});

export default ShareButton;
