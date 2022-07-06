import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useDropdown} from "../../components/Dropdown";
import RemoveDocPopover from "./RemoveDocPopover";
import CloneDocPopover from "./CloneDocPopover";
import {usePopover} from "../../components/Popover";
import RenameDocPopover from "./RenameDocPopover";
import {getDeepObjectPropByPath, getLeafIdFromPath, normalizeTimestamps} from "../../helpers/utils";
import useStore, {SortBy} from "../../stores/store";
import DivWithTooltip from "../../components/DivWithTooltip";
import {toast} from "react-hot-toast";

interface OwnProps {
  currentPath: string
  currentCollection: any
  handleSetPath: (newPath: string, force?: boolean) => void
  currentCollectionPath: string
  updatesAvailable: {[key: string]: boolean}
  extraInfoProps: { [key: string]: Array<string> }
  setExtraInfoPropsFilter: (prop: string, value: string) => void
  lastUpdate?: Date
  relevantDocs: Array<any>
  selectedDocs: Array<any>
  setSelectedDocs: (selectedDocs: Array<any>) => void
  searchBox: string
  setSearchBox: (value: string) => void
}

type Props = OwnProps;

const CollectionDocSelector: FunctionComponent<Props> = (props) => {
  const [showDropdown, hideDropdown] = useDropdown(store => [store.showDropdown, store.hideDropdown]);
  const [showPopover, hidePopover] = usePopover(popover => [popover.showPopover, popover.hidePopover])
  const [sortByProp] = useStore((store) => [store.sortByProp])
  const {relevantDocs, currentCollection, handleSetPath, currentCollectionPath, currentPath,
    updatesAvailable, extraInfoProps, setExtraInfoPropsFilter, selectedDocs, setSelectedDocs,
    searchBox, setSearchBox} = props

  useEffect(() => {
    setSelectedDocs(selectedDocs.filter((docId) => Object.keys(currentCollection).includes(docId)))
  }, [currentCollection]);


  const handleSelectDoc = (e: any, docId: string) => {
    if (e) {
      e.stopPropagation();
    }
    if (selectedDocs.includes(docId)) {
      let newSelectedDocs = [...selectedDocs];
      newSelectedDocs.splice(selectedDocs.indexOf(docId), 1)
      setSelectedDocs(newSelectedDocs)
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  }

  const handleArrowKeyPress = (e: any) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const currentDocId = getLeafIdFromPath(currentPath);
      let newDocIndex: number = relevantDocs.indexOf(currentDocId) ?? 0;
      if (e.key === "ArrowDown") {
        newDocIndex = Math.min(newDocIndex + 1, relevantDocs.length - 1);
      } else if (e.key === "ArrowUp") {
        newDocIndex = Math.max(newDocIndex - 1, 0);
      }
      const docId = relevantDocs[newDocIndex];
      handleSetPath(`${currentCollectionPath}/${docId}`)
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === "Backspace") {
      setSearchBox(searchBox.slice(0, Math.max(0, searchBox.length - 1)))
    } else if (e.key === " ") {
      const currentDocId = getLeafIdFromPath(currentPath);
      handleSelectDoc(e, currentDocId!);
      e.stopPropagation();
      e.preventDefault();
    }
  }

  const handleKeyPress = (e: any) => {
    if (/^[a-z0-9]$/i.test(e.key)) {
      setSearchBox(searchBox + e.key)
    }
  }

  const handleRemoveDoc = (docId: string) => {
    showPopover(
      <RemoveDocPopover
        docPath={`${currentCollectionPath}/${docId}`}
        hidePopover={hidePopover}
      />,
      "Are you sure you want to remove this document?"
    )
  }

  const handleCloneDoc = (docId: string) => {
    showPopover(
      <CloneDocPopover
        collectionPath={currentCollectionPath}
        docId={docId}
        hidePopover={hidePopover}
      />,
      "Where do you want to clone the document to?"
    )
  }

  const handleRenameDoc = (docId: string) => {
    showPopover(
      <RenameDocPopover
        collectionPath={currentCollectionPath}
        docId={docId}
        hidePopover={hidePopover}
      />,
      "Set a new name for your document"
    )
  }

  const copyPropValueToClipboard = (propValue: string) => {
    navigator.clipboard.writeText(propValue)
    toast.success(`Copied ${propValue}`)
  }

  return (
    <div
      className="flex flex-col mt-4 max-h-[300px] overflow-y-scroll items-stretch rounded-lg py-1 pl-1 outline-none"
      onKeyDown={handleArrowKeyPress}
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      {
        relevantDocs
          .map((docId, index) => {
          const doc = currentCollection[docId];
          return (
            <div
              key={docId}
              id={docId}
              className={`text-sm px-2 py-1 flex-1
                  ${getLeafIdFromPath(currentPath) === docId ? "border-blue-500 rounded" : "cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-50"} 
                  flex  justify-center shadow relative transition-all border outline-none`}
              onClick={() => handleSetPath(`${currentCollectionPath}/${docId}`)}
            >
              {/*New updates marker*/}
              <div className="flex items-center space-x-3 pr-2">
                {
                  relevantDocs.length > 1 && (
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      id={docId}
                      name={docId}
                      value={docId}
                      checked={selectedDocs.includes(docId)}
                      onChange={(e) => handleSelectDoc(e, docId)}
                    />
                  )
                }
                <div className={`bg-red-400 rounded-full w-2 h-2 ${updatesAvailable[docId] ? "opacity-100" : "opacity-0"}`}/>
              </div>

              <div className={`flex flex-1 space-x-4 justify-start items-center max-w-[80vw]`}>
                {/*Doc name*/}
                <div className="text-left text-ellipsis flex-1 min-w-[350px] whitespace-nowrap w-72 font-semibold group-tooltip relative">
                  <div>
                    {docId}
                  </div>
                  {/*<Tooltip stickHorizontallyTo="left">*/}
                  {/*  {docId}*/}
                  {/*</Tooltip>*/}
                </div>

                {/*Doc properties*/}
                <div className="flex gap-4 items-center overflow-x-hidden">
                  {
                    doc && Object.keys(extraInfoProps)
                      .filter((prop) => {
                        const propValue = getDeepObjectPropByPath(doc, prop);
                        return propValue !== undefined && propValue !== "" && propValue !== null
                      })
                      .map((prop) => (
                        <div
                          className="relative group-tooltip flex"
                          key={prop}
                        >
                          {/*<div className="hidden sm:block pr-2 text-gray-500">*/}
                          {/*  {prop}*/}
                          {/*</div>*/}
                          <DivWithTooltip tooltip={prop}>
                            <div
                              className={`px-1 text-ellipsis max-w-[350px] whitespace-nowrap overflow-hidden cursor-pointer
                         text-blue-500 hover:text-blue-700 border-transparent rounded bg-white`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // setExtraInfoPropsFilter(prop, getDeepObjectPropByPath(doc, prop))
                                copyPropValueToClipboard(getDeepObjectPropByPath(doc, prop))
                              }}
                            >
                              {normalizeTimestamps(getDeepObjectPropByPath(doc, prop))}
                            </div>
                          </DivWithTooltip>
                        </div>
                      ))
                  }

                </div>
              </div>


              {/*Doc action menu*/}
              <div
                className="cursor-pointer text-gray-500 hover:text-gray-400 px-2 group-dropdown relative"
                onClick={(e) => e.stopPropagation()}
                onMouseLeave={hideDropdown}
                onMouseEnter={(e) => {
                  showDropdown!(e.currentTarget, ["Rename", "Clone", "Remove"], (action) => {
                    const actions: {[key: string]: () => void} = {
                      "Rename": () => handleRenameDoc(docId),
                      "Clone": () => handleCloneDoc(docId),
                      "Remove": () => handleRemoveDoc(docId),
                    }
                    actions[action]!();
                  }, "right", "bottom" )
                }}
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 z-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CollectionDocSelector;
