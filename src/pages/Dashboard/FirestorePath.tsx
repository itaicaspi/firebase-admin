import React, {FunctionComponent, useRef, useState} from 'react';
import {toast} from "react-hot-toast";
import useStore from "../../stores/store";
import {getCollectionIdFromPath} from "../../helpers/utils";
import Dropdown, {useDropdown} from "../../components/Dropdown";

interface OwnProps {
  currentPath: string
  onSetPath: (newPath: string, force?: boolean, newExtraInfoProps?: {[key: string]: Array<string>}) => void
}

type Props = OwnProps;

const FirestorePath: FunctionComponent<Props> = (props) => {
  const {currentPath, onSetPath} = props
  const [showDropdown, hideDropdown] = useDropdown(store => [store.showDropdown, store.hideDropdown]);
  const pathInputRef = useRef<any>(null);
  const pathRef = useRef<any>(null);
  const [showPathInput, setShowPathInput] = useState(false);
  const [currentParentCollections] = useStore(store => [store.currentParentCollections])
  const [editedPath, setEditedPath] = useState("");
  const pathComponents = currentPath.split("/");
  const [favorites, setFavorites] = useState<Array<string>>(JSON.parse(localStorage.getItem("favorites") ?? "[]"));

  const copyPathToClipboard = () => {
    navigator.clipboard.writeText(currentPath)
    toast.success("Copied path")
  }

  const handleToggleInFavorites = () => {
    let currentFavorites: Array<string> = JSON.parse(localStorage.getItem("favorites") ?? "[]");
    if (currentFavorites.includes(currentPath)) {
      currentFavorites.splice(currentFavorites.indexOf(currentPath), 1)
    } else {
      currentFavorites = [...currentFavorites, currentPath]
    }
    setFavorites(currentFavorites);
    localStorage.setItem("favorites", JSON.stringify(currentFavorites))
  }

  const handleShowPathInput = () => {
    if (!showPathInput) {
      setEditedPath("/" + currentPath)
      setTimeout(() => {
        pathInputRef.current?.focus();
      })
      setShowPathInput(true)
    }
  }

  const handleSubmitEditedPath = (e: any) => {
    e.preventDefault();
    let newPath = editedPath;
    if (newPath.startsWith("/")) {
      newPath = newPath.slice(1) // remove the leading /
    }
    if (newPath.endsWith("/")) {
      newPath = newPath.slice(0, newPath.length - 1) // remove trailing /
    }
    onSetPath(newPath)
    setShowPathInput(false)
  }

  return (
    <div className="flex gap-2 items-center">
      {/*Star button*/}
      <div onClick={handleToggleInFavorites}>
        {
          favorites.includes(currentPath) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400 cursor-pointer"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 hover:text-yellow-400 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )
        }

      </div>

      {/*Copy Button*/}
      <div onClick={copyPathToClipboard}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-blue-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      </div>

      {/*Path Input*/}
      <form onSubmit={handleSubmitEditedPath} className={showPathInput ? "block" : "hidden"}>
        <input
          type="text"
          value={editedPath}
          onChange={(e) => setEditedPath(e.target.value)}
          autoFocus={showPathInput}
          style={{minWidth: pathRef.current?.clientWidth}}
          className={` px-2 py-1 outline-none bg-gray-50 border border-gray-300 rounded focus:border-gray-500 text-sm text-gray-500`}
          onBlur={() => setTimeout(() => setShowPathInput(false), 100)}
          ref={pathInputRef}
        />
        <button type="submit" className="hidden">submit</button>
      </form>

      {/*Path Components*/}
      <div
        onClick={handleShowPathInput}
        ref={pathRef}
        className={`${showPathInput ? "opacity-0 pointer-events-none absolute" : "block"} group
        cursor-pointer flex items-center bg-gray-50 px-2 py-1 rounded text-sm text-gray-500 border border-transparent`}
      >
        {pathComponents.map((component, index) => {
          return (
            <React.Fragment key={index}>
              <span className="mx-0.5">/</span>
              <span
                className="hover:underline cursor-pointer group-dropdown relative flex"
                onMouseLeave={hideDropdown}
                onMouseEnter={(e) => {
                  currentParentCollections.length > 0 && index % 2 === 0 && showDropdown!(e.currentTarget, currentParentCollections[Math.floor(index / 2)], (collectionId) => {
                    let newPathComponents = pathComponents.slice(0, index)
                    newPathComponents.push(collectionId)
                    const newPath = newPathComponents.join("/")
                    const extraInfoProps = localStorage.getItem(getCollectionIdFromPath(newPath))
                    onSetPath(newPath, false, extraInfoProps ? JSON.parse(extraInfoProps) : null)
                  })
                }}
              >
                {/*Path component*/}
                <span
                  className="text-ellipsis max-w-[350px] whitespace-nowrap overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation()
                    const newPath = pathComponents.slice(0, index + 1).join("/")
                    const extraInfoProps = localStorage.getItem(getCollectionIdFromPath(newPath))
                    onSetPath(newPath, false, extraInfoProps ? JSON.parse(extraInfoProps) : null)
                  }}
                >
                  {component}
                </span>
              </span>
            </React.Fragment>
          )
        })}
        {/*Edit Button*/}
        <div onClick={handleShowPathInput} className="hidden group-hover:block pl-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:text-blue-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FirestorePath;
