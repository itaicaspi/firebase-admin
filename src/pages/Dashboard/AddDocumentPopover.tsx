import React, {FunctionComponent, useState} from 'react';
import AceEditor from "react-ace";
import {isJson} from "../../helpers/utils";
import useStore from "../../stores/store";

interface OwnProps {
  collectionPath: string
  hidePopover: () => void
}

type Props = OwnProps;

const AddDocumentPopover: FunctionComponent<Props> = (props) => {
  const [addDoc, currentCollection] = useStore(store => [store.addDoc, store.currentCollection])
  const [documentId, setDocumentId] = useState("");
  const [editedContent, setEditedContent] = useState("{\n\t\n}");
  const errorsInDocId = Object.keys(currentCollection).includes(documentId);
  const errorsInDoc = editedContent !== null && !isJson(editedContent);

  return (
    <div className="bg-white py-4 flex flex-col gap-4">
      <div className=" flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <input
            className="w-full py-1 pl-2 pr-2 outline-none border border-gray-300 rounded focus:border-gray-500 text-sm"
            placeholder="Enter document id or leave empty to auto-generate..."
            type="text"
            onChange={(e) => setDocumentId(e.target.value)}
            autoFocus
          />
          {
            errorsInDocId && (
              <p className="text-xs text-red-500">
                This document id already exists in this collection
              </p>
            )
          }
        </div>

        <div>
          <h4 className="text-sm text-gray-700 pb-1">Document content</h4>
          <div className="relative">
            {
              errorsInDoc && (
                <div className="absolute right-4 top-4 bg-red-600 text-white rounded-full z-10 px-4 py-1 text-sm items-center">
                  errors in json
                </div>
              )
            }
            <AceEditor
              className="w-full h-full pb-10 rounded-lg pr-10"
              mode="json"
              theme="monokai"
              value={editedContent}
              onChange={(newValue) => {
                setEditedContent(newValue)
              }}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              width={"100%"}
              // ref={editorRef}
            />
          </div>
        </div>


      </div>
      <div className="flex flex-row justify-end gap-4">
        {/*Cancel button*/}
        <button
          onClick={props.hidePopover}
          className="rounded px-2 py-1 bg-gray-100 hover:bg-gray-200 shadow hover:shadow-md"
        >
          Cancel
        </button>
        {/*Remove button*/}
        <button
          className={`rounded px-2 py-1 bg-emerald-400 text-white shadow hover:shadow-md hover:bg-emerald-500 
          ${(errorsInDoc || errorsInDocId) && "bg-emerald-200"}`}
          onClick={() => {
            props.hidePopover();
            addDoc(props.collectionPath, documentId !== "" ? documentId : null, editedContent)
          }}
          disabled={errorsInDoc || errorsInDocId}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddDocumentPopover;
