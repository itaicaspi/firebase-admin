import React, { FunctionComponent } from 'react';
import RemoveMultipleDocsPopover from "./RemoveMultipleDocsPopover";
import {usePopover} from "../../components/Popover";
import AddDocumentPopover from "./AddDocumentPopover";

interface OwnProps {
  currentCollectionPath: string
  relevantDocs: Array<any>
  selectedDocs: Array<any>
  setSelectedDocs: (selectedDocs: Array<any>) => void
}

type Props = OwnProps;

const CollectionActions: FunctionComponent<Props> = (props) => {

  const [showPopover, hidePopover] = usePopover(popover => [popover.showPopover, popover.hidePopover])
  const {relevantDocs, selectedDocs, setSelectedDocs, currentCollectionPath} = props

  const handleRemoveDocs = (docIds: Array<string>) => {
    showPopover(
      <RemoveMultipleDocsPopover
        collectionPath={currentCollectionPath}
        docIds={docIds}
        hidePopover={hidePopover}
      />,
      `Are you sure you want to remove these ${docIds.length} document?`
    )
  }

  const handleAddDoc = () => {
    showPopover(
      <AddDocumentPopover
        collectionPath={currentCollectionPath}
        hidePopover={hidePopover}
      />,
      `New document`
    )
  }

  return (
    <div className="flex space-x-2">
      {/*Select all*/}
      {
        relevantDocs.length > 1 && relevantDocs.length !== selectedDocs.length && (
          <button
            className="px-2 py-1 border border-blue-400 hover:bg-blue-100 cursor-pointer rounded text-xs flex items-center space-x-1 shadow"
            onClick={() => setSelectedDocs(relevantDocs)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>
              select all
            </span>
          </button>
        )
      }

      {/*Unselect all*/}
      {
        selectedDocs.length > 0 && (
          <button
            className="px-2 py-1 border border-blue-400 hover:bg-blue-100 cursor-pointer rounded text-xs flex items-center space-x-1 shadow"
            onClick={() => setSelectedDocs([])}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>
              unselect all
            </span>
          </button>
        )
      }

      {/*Remove all*/}
      {
        selectedDocs.length > 0 && (
          <button
            className="px-2 py-1 border border-red-400 hover:bg-red-100 cursor-pointer rounded text-xs flex items-center space-x-2 shadow"
            onClick={() => handleRemoveDocs(selectedDocs)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>
              remove selected docs
            </span>
          </button>
        )
      }

      {/*New doc*/}
      <button
        className="px-2 py-1 border border-blue-400 hover:bg-blue-100 cursor-pointer rounded text-xs flex items-center space-x-1 shadow"
        onClick={() => handleAddDoc()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>
          new document
        </span>
      </button>
    </div>
  );
};

export default CollectionActions;
