import React, { FunctionComponent } from 'react';
import useStore from "../../stores/store";
import {getDocIdFromPath} from "../../helpers/utils";

interface OwnProps {
  collectionPath: string
  docIds: Array<string>
  hidePopover: () => void
}

type Props = OwnProps;

const RemoveMultipleDocPopover: FunctionComponent<Props> = (props) => {
  const [removeMultipleDocs] = useStore(store => [store.removeMultipleDocs])
  return (
    <div className="bg-white py-4 flex flex-col gap-4">
      <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto">
        {
          props.docIds.map((docId) => (
            <div key={docId} className="bg-gray-100 rounded px-2 py-1 text-sm">
              {docId}
            </div>
          ))
        }
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
          className="rounded px-2 py-1 bg-red-400 text-white shadow hover:shadow-md hover:bg-red-500"
          onClick={() => {
            props.hidePopover();
            removeMultipleDocs(props.collectionPath, props.docIds);
          }}
        >
          Remove all docs
        </button>
      </div>
    </div>
  );
};

export default RemoveMultipleDocPopover;
