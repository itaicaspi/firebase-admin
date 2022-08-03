import React, {FunctionComponent, useState} from 'react';
import useStore from "../../stores/store";
import {getCollectionIdFromPath, getDocIdFromPath, isCollectionPath} from "../../helpers/utils";

interface OwnProps {
  collectionPath: string
  docId: string
  hidePopover: () => void
}

type Props = OwnProps;

const CloneDocPopover: FunctionComponent<Props> = (props) => {
  const [toDocId, setToDocId] = useState(props.docId);
  const [toCollectionPath, setToCollectionPath] = useState(props.collectionPath);
  const [cloneDoc, currentCollection] = useStore(store => [store.cloneDoc, store.currentCollection])
  const [docError, setDocError] = useState<string | undefined>(undefined);
  const [collectionError, setCollectionError] = useState<string | undefined>(undefined);

  const handleSetToCollectionPath = (newCollectionPath: string) => {
    setToCollectionPath(newCollectionPath);
    if (newCollectionPath === "") {
      setCollectionError("Collection path must not be empty");
    } else if (!isCollectionPath(newCollectionPath)) {
      setCollectionError("The collection path is invalid");
    } else {
      setCollectionError(undefined)
    }
  }

  const handleSetToDocId = (newDocId: string) => {
    setToDocId(newDocId);
    if (newDocId === "") {
      setDocError("Document id must not be empty");
    } else if (props.collectionPath === toCollectionPath && Object.keys(currentCollection).includes(newDocId)) {
      setDocError("Document id already exists in the collection");
    } else {
      setDocError(undefined)
    }
  }
  return (
    <div className="bg-white py-4 flex flex-col gap-4">
      <div className="bg-gray-100 rounded px-1 py-1 flex space-x-2">
        <input
          type="text"
          value={toCollectionPath}
          className="px-2 rounded"
          onChange={(e) => handleSetToCollectionPath(e.target.value)}
          required
        />
        <span>
          /
        </span>
        <input
          type="text"
          value={toDocId}
          className="px-2 rounded flex-1"
          onChange={(e) => handleSetToDocId(e.target.value)}
          autoFocus
          required
        />
      </div>
      <div className={`${docError !== undefined || collectionError !== undefined ? "block" : "hidden"} bg-red-100 rounded px-2 py-1 text-sm`}>
        {docError ?? collectionError}
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
            if (!(docError ?? collectionError)) {
              props.hidePopover();
              cloneDoc(`${props.collectionPath}/${props.docId}`, `${toCollectionPath}/${toDocId}`);
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
