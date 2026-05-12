import { memo } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { createStyles } from "antd-style";

const useAppTableStyles = createStyles(({ css, token, prefixCls }) => {
  const p = `.${prefixCls}`;
  return {
    root: css`
      ${p}-table {
        ${p}-table-container {
          ${p}-table-body,
          ${p}-table-content {
            scrollbar-width: thin;
            scrollbar-color: ${token.colorFillSecondary} transparent;
          }
        }
      }
    `,
  };
});

export type AppTableProps<RecordType extends object = Record<string, unknown>> =
  TableProps<RecordType>;

function AppTableImpl<RecordType extends object = Record<string, unknown>>(
  props: AppTableProps<RecordType>,
) {
  const { styles, cx } = useAppTableStyles();
  const { className, ...rest } = props;
  return <Table<RecordType> className={cx(styles.root, className)} {...rest} />;
}

/** memo + 保留泛型，避免「仅改查询条件」时无意义重渲染 */
export const AppTable = memo(AppTableImpl) as typeof AppTableImpl;
