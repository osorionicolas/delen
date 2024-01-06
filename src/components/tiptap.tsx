"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { useEffect } from "react"
import { useText } from "@/hooks/useText"

const Tiptap = () => {
    const { text, setText } = useText()

    const handleChange = (value) => setText(value)

    const handleBlur = (value) => {
        if (text) {
            fetch("/api/text", {
                method: "POST",
                body: JSON.stringify({ text: value }),
            })
        }
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                autolink: true,
                HTMLAttributes: {
                    class: "cursor-pointer text-link hover:underline",
                },
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "bg-[#202124] max-w-screen-xl h-[57vh] text-lg w-[1280px] border-solid border-2 border-[#99C8FF] rounded-md p-3",
            },
        },
        onUpdate: ({ editor }) => {
            handleChange(editor.getHTML())
        },
        onBlur: ({ editor }) => {
            handleBlur(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor?.isEmpty) {
            editor.commands.insertContent(text)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])

    return <EditorContent editor={editor} />
}

export default Tiptap
