import React, { FunctionComponent } from 'react';
import useStore from "../../stores/store";

interface OwnProps {
  docPath: string
  hidePopover: () => void
}

type Props = OwnProps;

const RemoveDocPopover: FunctionComponent<Props> = (props) => {
  const [removeDoc] = useStore(store => [store.removeDoc])
  return (
    <div className="bg-white py-4 flex flex-col gap-4">
      <div className="bg-gray-100 rounded px-2 py-1">
        {props.docPath}
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
            removeDoc(props.docPath);
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default RemoveDocPopover;
