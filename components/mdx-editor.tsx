import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic"; // for SSR rendering in Editor component
import { debounce } from "lodash"; 
import {
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  BlockTypeSelect,
  headingsPlugin,
  quotePlugin,
  InsertThematicBreak,
  thematicBreakPlugin
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { useTheme } from "next-themes";

const MDXEditorComponent = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  { ssr: false }
);

interface EditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onContentChange }) => {
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [editorContent, setEditorContent] = useState(initialContent);

  useEffect(() => {
    setEditorContent(initialContent);
  }, [initialContent]);

  const debouncedContentUpdate = debounce((value: string) => {
    setEditorContent(value);
    onContentChange(value);
  }, 500); // Debounce delay in milliseconds

  const { theme } = useTheme();

  return (
    <MDXEditorComponent
      className={theme === "dark" ? "dark-theme dark-editor" : ""} 
      markdown={editorContent}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
               {' '}
            
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <BlockTypeSelect />
              <InsertThematicBreak/>
            </>
          )
        }),
      
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        headingsPlugin(), 
        quotePlugin(), 
        thematicBreakPlugin()
      ]}
      onChange={debouncedContentUpdate} 
    />
  );
};

export default Editor;