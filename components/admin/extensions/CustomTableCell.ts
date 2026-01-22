import { TableCell } from "@tiptap/extension-table-cell";

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
                parseHTML: (element) => element.style.verticalAlign || "top",
                renderHTML: (attributes) => {
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
                    ({ chain }) => {
                        return chain()
                            .updateAttributes("tableCell", { verticalAlign: align })
                            .updateAttributes("tableHeader", { verticalAlign: align })
                            .run();
                    },
        };
    },
});
