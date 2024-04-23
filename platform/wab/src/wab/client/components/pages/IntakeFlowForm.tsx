import YurekaiLogo from "@/wab/commons/images/yurekai-builder-logo.png";
import { Tooltip } from "antd";
import * as React from "react";
import { ReactNode } from "react";
import { PageFooter } from "./PageFooter";

export function IntakeFlowForm(props: { children: ReactNode }) {
  return (
    <div className={"LoginForm__Container"}>
      <div className={"LoginForm__Content"}>
        <div className={"LoginForm__Logo"}>
          <Tooltip title="Yurekai">
            <img src={YurekaiLogo} style={{ width: 128, height: 64 }} />
            {/* <Icon icon={MarkFullColorIcon} style={{ width: 128, height: 64 }} /> */}
          </Tooltip>
        </div>
        {props.children}
        <PageFooter />
      </div>
    </div>
  );
}
