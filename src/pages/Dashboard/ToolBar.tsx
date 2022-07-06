import React, { FunctionComponent } from 'react';
import SearchBox from "./SearchBox";
import AutoUpdatingTimeAgo from "../../components/AutoUpdatingTimeAgo";
import RefreshButton from "./RefreshButton";

interface OwnProps {
  currentPath: string
  currentCollection: any
  setSearchBox: (value: string) => void
  searchBox: string
  handleSetPath: (newPath: string, force?: boolean) => void
  lastUpdate?: Date
  relevantDocs: Array<any>
  selectedDocs: Array<any>
  setSelectedDocs: (selectedDocs: Array<any>) => void
}

type Props = OwnProps;

const ToolBar: FunctionComponent<Props> = (props) => {
  const {relevantDocs, handleSetPath} = props

  return (
    <div className="flex justify-between mt-4 space-x-4">
      {/*Search*/}
      <div className="flex-1 flex">
        <SearchBox onChanged={props.setSearchBox} value={props.searchBox}/>
      </div>

      <div className="flex space-x-2 items-center">
        <div className="text-xs py-1.5">
          Number of documents: <b>{relevantDocs.length}</b>
        </div>
        <span>|</span>
        <AutoUpdatingTimeAgo time={props.lastUpdate}/>
        <RefreshButton onClick={() => handleSetPath(props.currentPath, true)}/>
      </div>
    </div>
  );
};

export default ToolBar;
