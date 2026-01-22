import * as TableHeaderPkg from "@tiptap/extension-table-header";
// @ts-ignore
const CustomTableHeaderBase = TableHeaderPkg.default || TableHeaderPkg.TableHeader || TableHeaderPkg;

export const CustomTableHeader = CustomTableHeaderBase.extend({
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
});
