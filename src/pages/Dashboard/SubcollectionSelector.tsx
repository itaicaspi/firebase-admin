import React, { FunctionComponent } from 'react';
import Spinner from "../../components/Spinner";
import {getCollectionIdFromPath} from "../../helpers/utils";
import AddDocumentPopover from "./AddDocumentPopover";
import {usePopover} from "../../components/Popover";
import AddSubCollectionPopover from "./AddSubCollectionPopover";

interface OwnProps {
  currentSubCollections?: Array<any>
  handleSetPath: (newPath: string, force?: boolean, newExtraInfoProps?: {[key: string]: Array<string>}) => void
  currentPath: string
}

type Props = OwnProps;

const SubcollectionSelector: FunctionComponent<Props> = (props) => {
  const [showPopover, hidePopover] = usePopover(popover => [popover.showPopover, popover.hidePopover])
  const {currentSubCollections, handleSetPath, currentPath} = props

  const handleAddSubCollection = () => {
    showPopover(
      <AddSubCollectionPopover
        documentPath={currentPath}
        hidePopover={hidePopover}
      />,
      `New subcollection`
    )
  }
  return (
    <div className="flex gap-2 mt-4 flex-wrap items-center">
      <div className="font-medium mr-2">
        Subcollections
      </div>
      <div className="flex-1 flex gap-2 flex-wrap items-center">
        {
          currentSubCollections === undefined ? <Spinner className="text-gray-300"/> : currentSubCollections.sort().map((collectionId: string) => (
            <button
              key={collectionId}
              className="text-xs px-2 py-1 hover:bg-gray-100 bg-gray-50 rounded shadow"
              onClick={() => {
                const extraInfoProps = localStorage.getItem(collectionId);
                handleSetPath(`${currentPath}/${collectionId}`, false, extraInfoProps ? JSON.parse(extraInfoProps) : null)
              }}
            >
              {collectionId}
            </button>
          ))
        }
        {
          currentSubCollections !== undefined && currentSubCollections!.length === 0 && (
            <div className="text-gray-400 text-sm">
              None
            </div>
          )
        }
      </div>

      {/*New subcollection*/}
      <button
        className="px-2 py-1 border border-blue-400 hover:bg-blue-100 cursor-pointer rounded text-xs flex items-center space-x-1 shadow"
        onClick={() => handleAddSubCollection()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>
          new subcollection
        </span>
      </button>
    </div>
  );
};

export default SubcollectionSelector;
