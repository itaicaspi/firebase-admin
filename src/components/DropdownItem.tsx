import React, {FunctionComponent, useRef, useState} from 'react';
import Dropdown from "./Dropdown";

interface OwnProps {
  basePath?: string
  item: string
  isSelected: boolean
  allSelectedItems: Array<string>
  onClick: (item: string) => void
  isMultilevel: boolean
  childItems?: Array<string>
}

type Props = OwnProps;

const DropdownItem: FunctionComponent<Props> = (props) => {
  const ref = useRef<any>(null);
  const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);
  const {item: topLevelItem, basePath, allSelectedItems, isSelected, onClick, isMultilevel, childItems} = props
  const hasDropdown = isMultilevel && childItems && childItems.length > 0;
  return (
    <div
      key={topLevelItem}
      ref={ref}
      className={`${!hasDropdown && "pl-2"} pr-2 py-1 hover:bg-gray-400 cursor-pointer rounded-sm text-xs relative group
                ${isSelected && "bg-gray-100 text-black"} flex items-center`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasDropdown) {
          onClick(topLevelItem);
        }
      }}
      onMouseEnter={() => setShowChildrenDropdown(true)}
      onMouseLeave={() => setShowChildrenDropdown(false)}
    >
      {
        hasDropdown && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      }
      <span>
        {topLevelItem}
      </span>
      {
        hasDropdown && (
          <Dropdown
            isVisible={showChildrenDropdown}
            parentRef={ref.current}
            items={childItems}
            selectedItems={allSelectedItems}
            setSelectedItems={() => {}}
            onClickItem={(item) => {
              onClick(`${topLevelItem}/${item}`);
            }}
            isMultilevel={isMultilevel}
            horizontalAlign="right-full"
            verticalAlign="bottom-full"
            isGlobal={false}
            basePath={basePath}
          />
        )
      }
    </div>
  );
};

export default DropdownItem;
