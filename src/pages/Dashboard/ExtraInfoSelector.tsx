import React, { FunctionComponent } from 'react';
import {useDropdown} from "../../components/Dropdown";
import useStore from "../../stores/store";
import ExtraInfoSelectorHeader from "./ExtraInfoSelectorHeader";

interface OwnProps {
  allStringProps: { [key: string]: Array<string> }
  extraInfoProps: { [key: string]: Array<string> }
  toggleExtraInfoProp: (prop: string) => void
  setExtraInfoPropsFilter: (prop: string, value: string) => void
}

type Props = OwnProps;

const ExtraInfoSelector: FunctionComponent<Props> = (props) => {
  const {allStringProps, extraInfoProps, toggleExtraInfoProp, setExtraInfoPropsFilter} = props
  const [sortByProp] = useStore((store) => [store.sortByProp])
  const [showDropdown, hideDropdown] = useDropdown(store => [store.showDropdown, store.hideDropdown]);

  return (
    <div className="flex gap-2 flex-wrap max-h-20 sm:max-h-auto overflow-y-scroll sm:overflow-y-visible">
      {
        Object.keys(extraInfoProps).map((prop) => (
          <div key={prop} className="relative group">
            <button
              key={prop}
              className={`border-emerald-500 shadow border rounded-full px-3 py-1 text-xs items-center
                        whitespace-nowrap flex hover:border-emerald-200 space-x-1`}
              onClick={() => toggleExtraInfoProp(prop)}
              onMouseLeave={hideDropdown}
              onMouseEnter={(e) => {
                showDropdown!(
                  e.currentTarget,
                  allStringProps[prop]?.sort() ?? [],
                  (value) => {
                    setExtraInfoPropsFilter(prop, value);
                  },
                  "right",
                  "bottom",
                  extraInfoProps[prop],
                  <ExtraInfoSelectorHeader prop={prop}/>
                )
              }}
            >
              <span>
                {prop}
              </span>

              {/*Selected filters for this prop*/}
              {
                extraInfoProps[prop]?.length > 0 && (
                  <span className="ml-1">
                    = {extraInfoProps[prop].join(",")}
                  </span>
                )
              }

              {/*Sort by prop arrows*/}
              {
                sortByProp?.prop === prop && sortByProp?.direction === "desc" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                )
              }
              {
                sortByProp?.prop === prop && sortByProp?.direction === "asc" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                )
              }
            </button>
          </div>
        ))
      }

      <button
        className={`px-2 py-1 border border-blue-400 hover:bg-blue-100 cursor-pointer rounded text-xs flex items-center space-x-1 shadow`}
        onMouseLeave={hideDropdown}
        onMouseEnter={(e) => {
          showDropdown!(
            e.currentTarget,
            Object.keys(allStringProps).sort(),
            toggleExtraInfoProp,
            "right",
            "bottom",
            Object.keys(extraInfoProps),
            undefined,
            true
          )
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>Filter collection</span>
      </button>
    </div>
  );
};

export default ExtraInfoSelector;
