import * as TableCellPkg from "@tiptap/extension-table-cell";
// @ts-ignore
const TableCell = TableCellPkg.default || TableCellPkg.TableCell || TableCellPkg;

export type VerticalAlign = "top" | "middle" | "bottom";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        customTableCell: {
            setCellVerticalAlign: (align: VerticalAlign) => ReturnType;
        };
    }
}

export const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            verticalAlign: {
                default: "top",
                parseHTML: (element: any) => element.style.verticalAlign || "top",
                renderHTML: (attributes: any) => {
                    if (!attributes.verticalAlign || attributes.verticalAlign === "top") {
                        return {};
                    }
                    return {
                        style: `vertical-align: ${attributes.verticalAlign}`,
                    };
                },
            },
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setCellVerticalAlign:
                (align: VerticalAlign) =>
                    ({ chain }: any) => {
                        return chain()
                            .updateAttributes("tableCell", { verticalAlign: align })
                            .updateAttributes("tableHeader", { verticalAlign: align })
                            .run();
                    },
        };
    },
});
