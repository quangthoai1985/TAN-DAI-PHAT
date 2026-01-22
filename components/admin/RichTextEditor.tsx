"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import * as TableRowPkg from "@tiptap/extension-table-row";
// @ts-ignore
const TableRow = TableRowPkg.default || TableRowPkg.TableRow || TableRowPkg;
import TextAlign from "@tiptap/extension-text-align";
import { CustomTable, BorderWidth } from "./extensions/CustomTable";
import { CustomTableCell, VerticalAlign } from "./extensions/CustomTableCell";
import { CustomTableHeader } from "./extensions/CustomTableHeader";
import { useCallback, useRef, useEffect, useState } from "react";
import { uploadProductImage } from "@/lib/storage";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    productId?: string;
    placeholder?: string;
}

const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-colors ${isActive
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-600 hover:bg-gray-100"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
        {children}
    </button>
);

export default function RichTextEditor({
    content,
    onChange,
    productId,
    placeholder = "Nhập nội dung mô tả chi tiết sản phẩm...",
}: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            CustomTable.configure({
                resizable: true,
            }),
            TableRow,
            CustomTableHeader,
            CustomTableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content || "",
        immediatelyRender: false, // Fix SSR hydration issue in Next.js
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external content changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Verify content sync
            editor.commands.setContent(content || "");
        }
    }, [content, editor]);

    useEffect(() => {
        console.log("RichTextEditor initialized");
    }, []);

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return;

        // Create temporary preview with base64
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                editor.chain().focus().setImage({ src: reader.result }).run();
            }
        };
        reader.readAsDataURL(file);

        // If we have a productId, upload to storage and replace
        if (productId) {
            try {
                const result = await uploadProductImage(productId, file);
                if (result.success && result.url) {
                    // Image is already inserted as base64, it will be replaced when saved
                    console.log("Image uploaded:", result.url);
                }
            } catch (error) {
                console.error("Failed to upload image:", error);
            }
        }
    }, [editor, productId]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        e.target.value = "";
    };

    const addImageByUrl = () => {
        const url = prompt("Nhập URL hình ảnh:");
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    if (!editor) {
        return (
            <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                {/* Text formatting */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Đậm (Ctrl+B)"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                    </svg>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Nghiêng (Ctrl+I)"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4v3h2.21l-3.42 10H6v3h8v-3h-2.21l3.42-10H18V4z" />
                    </svg>
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Text Alignment */}
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Căn trái"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z" />
                    </svg>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Căn giữa"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v2H3V3zm3 4h12v2H6V7zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z" />
                    </svg>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Căn phải"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z" />
                    </svg>
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Headings */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Tiêu đề 2"
                >
                    <span className="text-sm font-bold">H2</span>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Tiêu đề 3"
                >
                    <span className="text-sm font-bold">H3</span>
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Lists */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Danh sách"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
                    </svg>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Danh sách có số"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
                    </svg>
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Quote */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Trích dẫn"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Image */}
                <MenuButton
                    onClick={() => fileInputRef.current?.click()}
                    title="Tải ảnh lên"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </MenuButton>
                <MenuButton
                    onClick={addImageByUrl}
                    title="Thêm ảnh từ URL"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Table */}
                <MenuButton
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    title="Thêm bảng 3x3"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M14 3v18M3 3h18v18H3V3z" />
                    </svg>
                </MenuButton>
                {editor.isActive('table') && (
                    <>
                        <MenuButton
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            title="Thêm cột bên phải"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            title="Thêm hàng bên dưới"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M12 20V4" />
                            </svg>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                            title="Xóa cột"
                        >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().deleteRow().run()}
                            title="Xóa hàng"
                        >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            title="Xóa bảng"
                        >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </MenuButton>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Vertical Alignment */}
                        <MenuButton
                            onClick={() => editor.chain().focus().setCellVerticalAlign('top').run()}
                            title="Canh trên"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14M12 7v14" />
                            </svg>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setCellVerticalAlign('middle').run()}
                            title="Canh giữa"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
                            </svg>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setCellVerticalAlign('bottom').run()}
                            title="Canh dưới"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21h14M12 3v14" />
                            </svg>
                        </MenuButton>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        {/* Border Width */}
                        <MenuButton
                            onClick={() => editor.chain().focus().setTableBorderWidth('none').run()}
                            title="Không viền"
                        >
                            <span className="text-xs font-medium">0</span>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTableBorderWidth('thin').run()}
                            title="Viền mảnh"
                        >
                            <span className="text-xs font-medium border-b border-gray-600">1</span>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTableBorderWidth('medium').run()}
                            title="Viền vừa"
                        >
                            <span className="text-xs font-medium border-b-2 border-gray-600">2</span>
                        </MenuButton>
                        <MenuButton
                            onClick={() => editor.chain().focus().setTableBorderWidth('thick').run()}
                            title="Viền dày"
                        >
                            <span className="text-xs font-medium border-b-[3px] border-gray-600">3</span>
                        </MenuButton>
                    </>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                />
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="min-h-[200px] [&_.ProseMirror]:min-h-[200px]"
            />

            {/* Placeholder styling */}
            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #9ca3af;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .ProseMirror:focus {
                    outline: none;
                }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1rem 0;
                }
                .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ul, .ProseMirror ol {
                    padding-left: 1.5rem;
                    margin: 0.75rem 0;
                }
                .ProseMirror li {
                    margin: 0.25rem 0;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid #d1d5db;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: #6b7280;
                }
                /* Table styles */
                .ProseMirror table {
                    border-collapse: collapse;
                    margin: 1rem 0;
                    overflow: hidden;
                    width: 100%;
                    table-layout: fixed;
                    --table-border-width: 1px;
                }
                .ProseMirror th,
                .ProseMirror td {
                    min-width: 1em;
                    border: var(--table-border-width) solid #d1d5db;
                    padding: 0.5rem 0.75rem;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: 600;
                    background-color: #f9fafb;
                    text-align: left;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(99, 102, 241, 0.2);
                    pointer-events: none;
                }
                .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    background-color: #6366f1;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
