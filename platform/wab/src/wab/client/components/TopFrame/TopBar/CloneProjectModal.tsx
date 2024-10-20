/** @format */

import { parseProjectLocation, U } from "@/wab/client/cli-routes";
import { promptMoveToWorkspace } from "@/wab/client/components/dashboard/dashboard-actions";
import { useAppCtx } from "@/wab/client/contexts/AppContexts";
import { assert, spawn } from "@/wab/common";
import { ApiProject, MainBranchId } from "@/wab/shared/ApiSchema";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

interface CloneProjectModalProps {
  project: ApiProject;
  showCloneProjectModal: boolean;
  setShowCloneProjectModal: (val: boolean) => Promise<void>;
}

export const CloneProjectModal = observer(function ProjectNameModal({
  project,
  showCloneProjectModal,
  setShowCloneProjectModal,
}: CloneProjectModalProps) {
  const appCtx = useAppCtx();

  useEffect(() => {
    spawn(
      (async () => {
        if (showCloneProjectModal) {
          const response = await promptMoveToWorkspace(
            appCtx,
            null,
            false,
            "Duplicate",
            project.name
          );
          if (!response) {
            await setShowCloneProjectModal(false);
            return;
          }
          assert(response.result === "workspace", "");
          const parsedLocation = parseProjectLocation(appCtx.history.location);

          const { projectId: newProjectId } = await appCtx.app.withSpinner(
            appCtx.api.cloneProject(project.id, {
              workspaceId: response.workspace.id,
              name: response.name,
              ...(parsedLocation?.branchName &&
              parsedLocation.branchName !== MainBranchId
                ? { branchName: parsedLocation.branchName }
                : {}),
            })
          );
          window.open(U.project({ projectId: newProjectId }), "_blank");
        }
      })()
    );
  }, [showCloneProjectModal]);

  return null;
});

export default CloneProjectModal;
