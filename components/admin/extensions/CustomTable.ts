import * as TablePkg from "@tiptap/extension-table";
// @ts-ignore
const Table = TablePkg.default || TablePkg.Table || TablePkg;

export type BorderWidth = "none" | "thin" | "medium" | "thick";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        customTable: {
            setTableBorderWidth: (width: BorderWidth) => ReturnType;
        };
    }
}

const borderWidthMap: Record<BorderWidth, string> = {
    none: "0",
    thin: "1px",
    medium: "2px",
    thick: "3px",
};

export const CustomTable = Table.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            borderWidth: {
                default: "thin",
                parseHTML: (element: any) => {
                    const border = element.style.borderWidth || element.getAttribute("data-border-width");
                    if (border === "0" || border === "0px") return "none";
                    if (border === "2px") return "medium";
                    if (border === "3px") return "thick";
                    return "thin";
                },
                renderHTML: (attributes: any) => {
                    const width = borderWidthMap[attributes.borderWidth as BorderWidth] || "1px";
                    return {
                        "data-border-width": attributes.borderWidth,
                        style: `--table-border-width: ${width}`,
                    };
                },
            },
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setTableBorderWidth:
                (width: BorderWidth) =>
                    ({ chain }: any) => {
                        return chain().updateAttributes("table", { borderWidth: width }).run();
                    },
        };
    },
});
