import React, { FunctionComponent } from 'react';
import {unique} from "../helpers/utils";
import DropdownItem from "./DropdownItem";

interface OwnProps {
  basePath?: string
  items: Array<string>
  selectedItems: Array<string>
  toggleSelectedItem: (item: string) => void
  onClickItem: (item: string) => void
  isMultilevel: boolean
}

type Props = OwnProps;

const DropdownItemList: FunctionComponent<Props> = (props) => {
  const {basePath, items, selectedItems, toggleSelectedItem, onClickItem, isMultilevel} = props;

  const topLevelItems = isMultilevel ? unique(items?.map((item: string) => item.split("/")[0])) : items

  return (
    <div className="flex flex-col overflow-y-auto p-1 space-y-1 overflow-x-hidden max-h-80 max-w-80">
      {
        topLevelItems?.map((topLevelItem: string, index) => {
          const childItems = items
            .filter((item) => item.toString().startsWith(topLevelItem + "/"))
            .map((item) => item.split("/").slice(1).join("/"))
          const newBasePath = basePath ? `${basePath}/${topLevelItem}` : topLevelItem;
          return (
            <DropdownItem
              key={newBasePath}
              item={topLevelItem}
              allSelectedItems={selectedItems}
              isSelected={selectedItems?.includes(newBasePath)}
              onClick={(item) => {
                toggleSelectedItem(item);
                onClickItem(item);
              }}
              basePath={newBasePath}
              isMultilevel={isMultilevel}
              childItems={childItems}
            />
          )
        })
      }
    </div>
  );
};

export default DropdownItemList;
