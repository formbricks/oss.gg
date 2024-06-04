"use client";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

import "../../styles/editor.css";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  editor.setOptions({
    editorProps: {
      attributes: {
        class:
          "border-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  return (
    <>
      <div className="flex gap-x-0.5 border-b border-gray-200 p-2 align-middle">
        <button
          className={`${editor.isActive("bold") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          type="button"
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-hs-editor-bold="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
            <path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path>
          </svg>
        </button>
        <button
          className={`${editor.isActive("italic") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          type="button"
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-hs-editor-italic="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="19" x2="10" y1="4" y2="4"></line>
            <line x1="14" x2="5" y1="20" y2="20"></line>
            <line x1="15" x2="9" y1="4" y2="20"></line>
          </svg>
        </button>
        <button
          className={`${editor.isActive("strike") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type="button"
          data-hs-editor-strike="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4"></path>
            <path d="M14 12a4 4 0 0 1 0 8H6"></path>
            <line x1="4" x2="20" y1="12" y2="12"></line>
          </svg>
        </button>
        <button
          className={`${editor.isActive("code") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          onClick={() => editor.chain().focus().toggleCode().run()}
          type="button"
          data-hs-editor-ol="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="10" x2="21" y1="6" y2="6"></line>
            <line x1="10" x2="21" y1="12" y2="12"></line>
            <line x1="10" x2="21" y1="18" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
        <button
          className={`${editor.isActive("blockquote") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type="button"
          data-hs-editor-ul="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="8" x2="21" y1="6" y2="6"></line>
            <line x1="8" x2="21" y1="12" y2="12"></line>
            <line x1="8" x2="21" y1="18" y2="18"></line>
            <line x1="3" x2="3.01" y1="6" y2="6"></line>
            <line x1="3" x2="3.01" y1="12" y2="12"></line>
            <line x1="3" x2="3.01" y1="18" y2="18"></line>
          </svg>
        </button>
        <button
          className={`${editor.isActive("bulletList") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
          data-hs-editor-blockquote="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M17 6H3"></path>
            <path d="M21 12H8"></path>
            <path d="M21 18H8"></path>
            <path d="M3 12v6"></path>
          </svg>
        </button>
        <button
          className={`${editor.isActive("orderedList") ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
          data-hs-editor-code="">
          <svg
            className="size-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="m18 16 4-4-4-4"></path>
            <path d="m6 8-4 4 4 4"></path>
            <path d="m14.5 4-5 16"></path>
          </svg>
        </button>
        <button
          className={`${editor.isActive("heading", { level: 1 }) ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          type="button"
          data-hs-editor-underline="">
          H1
        </button>
        <button
          className={`${editor.isActive("heading", { level: 2 }) ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
          data-hs-editor-underline="">
          H2
        </button>
        <button
          className={`${editor.isActive("heading", { level: 3 }) ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          type="button"
          data-hs-editor-underline="">
          H3
        </button>
        <button
          className={`${editor.isActive("heading", { level: 4 }) ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 4 }).run()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          type="button"
          data-hs-editor-underline="">
          H4
        </button>
        <button
          className={`${editor.isActive("heading", { level: 5 }) ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 5 }).run()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          type="button"
          data-hs-editor-underline="">
          H5
        </button>
        <button
          className={`${editor.isActive("heading", { level: 6 }) ? "bg-gray-600 text-white hover:bg-gray-700" : "hover:bg-gray-100"} inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent text-sm font-semibold text-gray-800  disabled:pointer-events-none disabled:opacity-50`}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 6 }).run()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          type="button"
          data-hs-editor-underline="">
          H6
        </button>
      </div>
    </>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

export default ({ content, fn }) => {
  return <EditorProvider slotBefore={<MenuBar />} extensions={extensions} onUpdate={({editor}) => fn(editor.getHTML()) } content={content}></EditorProvider>;
};
