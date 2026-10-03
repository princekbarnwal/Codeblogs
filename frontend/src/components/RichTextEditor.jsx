import {
  useEditor,
  EditorContent,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Plugin } from "@tiptap/pm/state";

function RichTextEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],

    content: content || "",

    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  /*
   * Listen to Tiptap editor state changes.
   * This makes the toolbar update immediately when
   * formatting is turned on/off.
   */
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          bold: false,
          italic: false,
          underline: false,
          heading2: false,
          heading3: false,
          bulletList: false,
          orderedList: false,
          link: false,
          blockquote: false,
        };
      }

      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        heading2: editor.isActive("heading", { level: 2 }),
        heading3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        link: editor.isActive("link"),
        blockquote: editor.isActive("blockquote"),
      };
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");

    if (!url) {
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="rich-editor">

      {/* Writing Area */}
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* Toolbar */}
      <div className="editor-toolbar">

        {/* Bold */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={editorState.bold ? "active" : ""}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={editorState.italic ? "active" : ""}
          title="Italic"
        >
          <em>I</em>
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={editorState.underline ? "active" : ""}
          title="Underline"
        >
          <u>U</u>
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run();
          }}
          className={editorState.heading2 ? "active" : ""}
          title="Heading 2"
        >
          H2
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run();
          }}
          className={editorState.heading3 ? "active" : ""}
          title="Heading 3"
        >
          H3
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run();
          }}
          className={editorState.bulletList ? "active" : ""}
          title="Bullet List"
        >
          • List
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run();
          }}
          className={editorState.orderedList ? "active" : ""}
          title="Numbered List"
        >
          1. List
        </button>

        {/* Link */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            addLink();
          }}
          className={editorState.link ? "active" : ""}
          title="Add Link"
        >
          Link
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run();
          }}
          className={editorState.blockquote ? "active" : ""}
          title="Blockquote"
        >
          Quote
        </button>

        {/* Undo */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .undo()
              .run();
          }}
          title="Undo"
        >
          ↶
        </button>

        {/* Redo */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();

            editor
              .chain()
              .focus()
              .redo()
              .run();
          }}
          title="Redo"
        >
          ↷
        </button>

      </div>
    </div>
  );
}

export default RichTextEditor;