import React, {FunctionComponent, useEffect, useState} from 'react';
import useStore from "../../stores/store";
import {getDocIdFromPath} from "../../helpers/utils";

interface OwnProps {
  collectionPath: string
  docId: string
  hidePopover: () => void
}

type Props = OwnProps;

const RenameDocPopover: FunctionComponent<Props> = (props) => {
  const [toDocId, setToDocId] = useState(props.docId);
  const [renameDoc, currentCollection] = useStore(store => [store.renameDoc, store.currentCollection])
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSetToDocId = (newDocId: string) => {
    setToDocId(newDocId);
    if (newDocId === "") {
      setError("Document id must not be empty");
    } else if (newDocId === props.docId) {
      setError("Document id must be different from its current id");
    } else if (Object.keys(currentCollection).includes(newDocId)) {
      setError("Document id already exists in the collection");
    } else {
      setError(undefined)
    }
  }

  useEffect(() => handleSetToDocId(props.docId), [])

  return (
    <div className="bg-white py-4 flex flex-col gap-4">
      <div className="bg-gray-100 rounded px-2 py-1 flex space-x-2">
        <span>
          {props.collectionPath} /
        </span>
        <input
          type="text"
          value={toDocId}
          className="px-2 flex-1"
          onChange={(e) => handleSetToDocId(e.target.value)}
          autoFocus
          required
        />
      </div>
      <div className={`${error !== undefined ? "block" : "hidden"} bg-red-100 rounded px-2 py-1 text-sm`}>
        {error}
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
          className={`rounded px-2 py-1 text-white shadow hover:shadow-md hover:bg-emerald-600 ${error !== undefined ? "bg-emerald-200" : "bg-emerald-500"}`}
          disabled={error !== undefined}
          onClick={() => {
            if (!error && toDocId !== props.docId) {
              props.hidePopover();
              renameDoc(props.docId, toDocId);
            }
          }}
        >
          Rename
        </button>
      </div>
    </div>
  );
};

export default RenameDocPopover;
