import React, { useContext } from "react";
import {
  Component,
  CustomCode,
  Expr,
  isKnownObjectPath,
  ObjectPath,
} from "@/wab/classes";
import { DATA_QUERY_PLURAL_CAP } from "@/wab/shared/Labels";
import { renameQueryAndFixExprs } from "@/wab/shared/refactoring";
import { addEmptyQuery } from "@/wab/shared/TplMgr";
import { useStudioCtx } from "@/wab/client/studio-ctx/StudioCtx";
import { ContextMenuContext } from "@/wab/client/components/ContextMenuIndicator/ContextMenuIndicator";
import { ValueSetState } from "@/wab/client/components/sidebar/sidebar-helpers";
import { EnumPropEditor } from "@/wab/client/components/sidebar-tabs/ComponentProps/EnumPropEditor";
import { DataPickerTypesSchema } from "@/wab/client/components/sidebar-tabs/DataBinding/DataPicker";
import { useDataSourceOpExprBottomModals } from "./DataSourceOpPicker";

export function DataSourceOpDataPicker({
  value,
  component,
  env,
  schema,
  valueSetState,
  readOnly,
  onChange,
  allowedOps,
  "data-plasmic-prop": dataPlasmicProp,
}: {
  value: boolean | number | string | null | undefined | {} | any[] | Expr;
  env: { [key: string]: any } | undefined;
  schema?: DataPickerTypesSchema;
  component?: Component;
  valueSetState?: ValueSetState;
  readOnly?: boolean;
  onChange: (
    value: boolean | number | string | null | undefined | {} | any[] | Expr
  ) => void;
  allowedOps?: string[];
  "data-plasmic-prop"?: string;
}) {
  const studioCtx = useStudioCtx();
  const ctx = useContext(ContextMenuContext);
  const dataSourceModals = useDataSourceOpExprBottomModals();
  return (
    <EnumPropEditor
      value={isKnownObjectPath(value) ? value.path[1] : undefined}
      onChange={async (picked) => {
        await studioCtx.change(({ success }) => {
          function onChangeToQuery(queryName: string | number | boolean) {
            onChange(
              queryName
                ? new ObjectPath({
                    fallback: new CustomCode({
                      code: "undefined",
                      fallback: undefined,
                    }),
                    path: ["$queries", `${queryName}`],
                  })
                : undefined
            );
          }

          if (picked === "[[new query]]") {
            if (component) {
              const query = addEmptyQuery(component);
              dataSourceModals.open(query.uuid, {
                parent: query,
                value: query.op ?? undefined,
                onSave: async (newOp, opExprName) => {
                  await studioCtx.change(({ success: success2 }) => {
                    query.op = newOp;
                    if (opExprName && component && opExprName !== query.name) {
                      renameQueryAndFixExprs(component, query, opExprName);
                    }
                    return success2();
                  });
                  dataSourceModals.close(query.uuid);
                },
                onCancel: () => dataSourceModals.close(query.uuid),
                env,
                schema,
                readOpsOnly: true,
                allowedOps,
                exprCtx: {
                  projectFlags: studioCtx.projectFlags(),
                  component: component ?? null,
                  inStudio: true,
                },
              });
              onChangeToQuery(query.name);
            }
          } else if (picked === "[[dynamic value]]") {
            ctx.useDynamicValue();
          } else {
            onChangeToQuery(picked);
          }
          return success();
        });
      }}
      defaultValueHint={"Pick data query"}
      options={[
        Object.keys(env?.$queries ?? {}).length > 0 && {
          label: DATA_QUERY_PLURAL_CAP,
          values: Object.keys(env?.$queries ?? {}).map((k) => ({
            value: k,
            label: k,
          })),
        },
        {
          label: "",
          values: [
            {
              value: "[[new query]]",
              label: "Add new query....",
            },
            {
              value: "[[dynamic value]]",
              label: "Use dynamic value...",
            },
          ],
        },
      ]}
      className={"form-control text-right"}
      valueSetState={valueSetState}
      readOnly={readOnly}
      data-plasmic-prop={dataPlasmicProp}
    />
  );
}
