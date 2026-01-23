import { TableHeader } from "@tiptap/extension-table-header";

export const CustomTableHeader = TableHeader.extend({
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
