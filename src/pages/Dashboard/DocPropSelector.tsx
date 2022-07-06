import React, { FunctionComponent } from 'react';
import {useDropdown} from "../../components/Dropdown";

interface OwnProps {
  currentDoc: any,
  docFilter?: string,
  handleSetDocFilter: (prop: string) => void
}

type Props = OwnProps;

const DocPropSelector: FunctionComponent<Props> = (props) => {
  const [showDropdown, hideDropdown] = useDropdown((store) => [store.showDropdown, store.hideDropdown])
  const {currentDoc, docFilter, handleSetDocFilter} = props

  return (
    <div className="flex gap-2 mt-4 flex-wrap flex-1">
      <button
        className={`px-2 py-1 border border-blue-400 hover:bg-blue-100 cursor-pointer rounded text-xs flex items-center space-x-1 shadow`}
        onMouseLeave={hideDropdown}
        onMouseEnter={(e) => {
          showDropdown!(
            e.currentTarget,
            Object.keys(currentDoc).sort(),
            handleSetDocFilter,
            "left",
            "bottom",
            docFilter ? [docFilter] : [],
            undefined,
            false,
            false
          )
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>
          Filter doc
        </span>
      </button>

      {
         docFilter && (
           <button
             key={docFilter}
             className={`text-xs px-3 py-1 rounded border-emerald-500 shadow-md border rounded-full`}
             onClick={() => handleSetDocFilter(docFilter)}
           >
             {docFilter}
           </button>
         )
      }
      {/*{Object.keys(currentDoc).sort().map(prop => (*/}
      {/*  <button*/}
      {/*    key={prop}*/}
      {/*    className={`text-xs px-2 py-1 rounded ${docFilter === prop ? "border-emerald-500 shadow-md" : "hover:bg-gray-100 bg-gray-50 border-transparent shadow"} border`}*/}
      {/*    onClick={() => handleSetDocFilter(prop)}*/}
      {/*  >*/}
      {/*    {prop}*/}
      {/*  </button>*/}
      {/*))}*/}
    </div>
  );
};

export default DocPropSelector;
