import React, { FunctionComponent } from 'react';
import useStore from "../../stores/store";

interface OwnProps {
  prop: string
}

type Props = OwnProps;

const ExtraInfoSelectorHeader: FunctionComponent<Props> = (props) => {
  const [sortByProp, setSortByProp] = useStore((store) => [store.sortByProp, store.setSortByProp])
  const {prop} = props
  return (
    <div className="flex justify-center">
      {/*Sort descending*/}
      <div
        onClick={() => sortByProp?.prop === prop && sortByProp?.direction === "desc" ? setSortByProp(undefined) : setSortByProp({
          prop,
          direction: "desc"
        })}
        className={`px-2 py-1 text-xs text-gray-600 flex items-center justify-center cursor-pointer select-none w-full rounded-tl
                    ${sortByProp?.prop === prop && sortByProp?.direction === "desc" ? "bg-emerald-200 hover:bg-emerald-100" : "hover:bg-gray-100"}`}
      >
        <span>
          sort by
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      </div>

      {/*Sort ascending*/}
      <div
        onClick={() => sortByProp?.prop === prop && sortByProp?.direction === "asc" ? setSortByProp(undefined) : setSortByProp({
          prop,
          direction: "asc"
        })}
        className={`px-2 py-1 text-xs text-gray-600 flex items-center justify-center cursor-pointer select-none w-full rounded-tr
                    ${sortByProp?.prop === prop && sortByProp?.direction === "asc" ? "bg-emerald-200 hover:bg-emerald-100" : "hover:bg-gray-100"}`}
      >
        <span>
          sort by
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      </div>
    </div>

  );
};

export default ExtraInfoSelectorHeader;
