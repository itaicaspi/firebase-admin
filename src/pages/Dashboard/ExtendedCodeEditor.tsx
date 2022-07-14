import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import CodeEditor, {SelectionText} from "@uiw/react-textarea-code-editor";
import {useImagePreview} from "./ImagePreview";
import AceEditor from "react-ace";
import {Range} from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import {isJson} from "../../helpers/utils";

interface OwnProps {
  currentPath: string
  originalContent: string
  editedContent: string
  setCurrentEditedContent: (content: string) => void
  onSave: () => void
}

type Props = OwnProps;

const ExtendedCodeEditor: FunctionComponent<Props> = (props) => {
  const {editedContent, setCurrentEditedContent, originalContent, onSave, currentPath} = props
  const editorRef = useRef<any>(null);
  const [markers, setMarkers] = useState<Array<any>>([]);
  const [setCurrentImagePreview] = useImagePreview(store => [store.setCurrentImagePreview])

  const handleSelect = (selection: any) => {
    const position = selection.getRange();
    const editor = editorRef.current.editor.session;
    const value = editor.getLine(position.start.row)
    const start = value.substring(0, position.start.column).lastIndexOf("\"") + 1
    const end = position.end.column + value.substring(position.end.column).indexOf("\"")
    const selectedValue = value.substring(start, end)
    if (selectedValue.startsWith("http")) {
      setCurrentImagePreview(selectedValue);
    } else {
      setCurrentImagePreview(undefined)
    }
  }

  const handleUndo = () => {
    const editor = editorRef.current.editor;
    editor.undo();
  }
  const handleRedo = () => {
    const editor = editorRef.current.editor;
    editor.redo();
  }

  const setupSaveCommand = () => {
    const editor = editorRef.current.editor;
    editor.commands.addCommand({
      name: 'save',
      bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
      exec: (editor: any) => {
        onSave();
      }
    })
  }

  // https://codepen.io/oatssss/pen/oYxJQV
  // http://jsfiddle.net/tzmartin/hwzjjah2/
  const markLinks = () => {
    const editor = editorRef.current.editor;
    let lines = editor.getValue().split("\n");
    markers.forEach((marker) => editor.getSession().removeMarker(marker))
    let newMarkers: Array<any> = [];
    lines.forEach((line: string, i: number) => {
      const start = line.indexOf("https://")
      const end = start + line.substring(start).indexOf("\"")
      const link = line.substring(start, end)
      if (link.replaceAll(" ", "") !== "") {
        const marker = editor.getSession().addMarker(new Range(i, start, i, end), "border-b border-white absolute", "text", false)
        newMarkers.push(marker)
      }
    })
    setMarkers(newMarkers);
  }

  useEffect(setupSaveCommand, [currentPath, editedContent]);
  useEffect(markLinks, [editedContent]);


  return (
    <div className="flex flex-col relative flex-1">
      {
        editedContent !== originalContent && (
          <div className="absolute top-4 right-6 bg-white rounded z-10 px-4 py-2 flex items-center space-x-2">
            {
              editorRef.current?.editor.session.getUndoManager().canUndo() && (
                <div className="p-1 cursor-pointer" onClick={handleUndo}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 hover:text-blue-500" viewBox="0 0 512 512">
                    <path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.84 0-95.17-15.58-134.2-44.86c-14.12-10.59-16.97-30.66-6.375-44.81c10.59-14.12 30.62-16.94 44.81-6.375c27.84 20.91 61 31.94 95.88 31.94C344.3 415.8 416 344.1 416 256s-71.69-159.8-159.8-159.8c-37.46 0-73.09 13.49-101.3 36.64l45.12 45.14c17.01 17.02 4.955 46.1-19.1 46.1H35.17C24.58 224.1 16 215.5 16 204.9V59.04c0-24.04 29.07-36.08 46.07-19.07l47.6 47.63C149.9 52.71 201.5 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z" fill="currentColor"/>
                  </svg>
                </div>
              )
            }
            {
              editorRef.current?.editor.session.getUndoManager().canRedo() && (
                <div className="p-1 cursor-pointer" onClick={handleRedo}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 hover:text-blue-500" viewBox="0 0 512 512">
                    <path d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.32-27.06-27.2c0-6.634 2.461-13.4 7.96-18.9l45.12-45.14c-28.22-23.14-63.85-36.64-101.3-36.64c-88.09 0-159.8 71.69-159.8 159.8S167.8 415.9 255.9 415.9c73.14 0 89.44-38.31 115.1-38.31c18.48 0 31.97 15.04 31.97 31.96c0 35.04-81.59 70.41-147 70.41c-123.4 0-223.9-100.5-223.9-223.9S132.6 32.44 256 32.44c54.6 0 106.2 20.39 146.4 55.26l47.6-47.63C455.5 34.57 462.3 32.11 468.9 32.11z" fill="currentColor"/>
                  </svg>
                </div>
              )
            }
            <div
              className="text-sm px-4 py-1 border rounded-full cursor-pointer hover:bg-gray-100"
              onClick={() => setCurrentEditedContent(originalContent)}
            >
              reset
            </div>

            {
              editedContent !== null && isJson(editedContent) && editedContent !== originalContent && (
                <button
                  className="bg-green-600 text-white rounded-full z-10 px-4 py-1 hover:bg-green-500 text-sm items-center"
                  onClick={onSave}
                >
                  save changes
                </button>
              )
            }
            {
              editedContent !== null && !isJson(editedContent) && editedContent !== originalContent && (
                <div className="bg-red-600 text-white rounded-full z-10 px-4 py-1 text-sm items-center">
                  errors in json
                </div>
              )
            }
          </div>
        )
      }

      <AceEditor
        className="w-full h-full pb-10 rounded-lg pr-10"
        mode="json"
        theme="monokai"
        value={editedContent}
        onSelectionChange={handleSelect}
        onChange={(newValue) => {
          setCurrentEditedContent(newValue)
        }}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        width={"100%"}
        height={"100%"}
        ref={editorRef}
      />
    </div>
  )
};

export default ExtendedCodeEditor;
