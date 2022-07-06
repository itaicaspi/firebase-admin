import React, {FunctionComponent, useState} from 'react';
import useStore from "../../stores/store";
import {getDocIdFromPath} from "../../helpers/utils";

interface OwnProps {
  collectionPath: string
  docId: string
  hidePopover: () => void
}

type Props = OwnProps;

const CloneDocPopover: FunctionComponent<Props> = (props) => {
  const [toDocId, setToDocId] = useState("");
  const [cloneDoc, currentCollection] = useStore(store => [store.cloneDoc, store.currentCollection])
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSetToDocId = (newDocId: string) => {
    setToDocId(newDocId);
    if (newDocId === "") {
      setError("Document id must not be empty");
    } else if (Object.keys(currentCollection).includes(newDocId)) {
      setError("Document id already exists in the collection");
    } else {
      setError(undefined)
    }
  }
  return (
    <div className="bg-white py-4 flex flex-col gap-4">
      <div className="bg-gray-100 rounded px-2 py-1 flex space-x-2">
        <span>
          {props.collectionPath} /
        </span>
        <input
          type="text"
          value={toDocId}
          className="px-2"
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
          className="rounded px-2 py-1 bg-emerald-400 text-white shadow hover:shadow-md hover:bg-emerald-500"
          onClick={() => {
            if (!error) {
              props.hidePopover();
              cloneDoc(props.docId, toDocId);
            }
          }}
        >
          Clone
        </button>
      </div>
    </div>
  );
};

export default CloneDocPopover;
