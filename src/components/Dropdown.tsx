import React, { FunctionComponent } from 'react';
import create, {GetState, SetState, State} from "zustand";
import {unique} from "../helpers/utils";
import DropdownItemList from "./DropdownItemList";


export interface GlobalDropdownInterface extends State {
}

export interface DropdownInterface extends State {
  isGlobal?: boolean
  isVisible?: boolean,
  items: Array<string>,
  selectedItems: Array<string>
  setSelectedItems: (selectedItems: Array<string>) => void,
  onClickItem: (item: string) => void
  showDropdown?: (parentRef: any, items: Array<string>, onClickItem: (item: string) => void, horizontalAlign?: "left" | "right" | "right-full" | "left-full",
                 verticalAlign?: "top" | "bottom" | "bottom-full" | "right-full", selectedItems?: Array<string>, header?: any,
                  isMultilevel?: boolean, allowMultipleSelections?: boolean) => void,
  hideDropdown?: () => void,
  title?: string
  position?: any,
  horizontalAlign?: "left" | "right" | "right-full" | "left-full",
  verticalAlign?: "top" | "bottom" | "bottom-full" | "right-full",
  parentRef: any
  header?: any
  allowMultipleSelections?: boolean
  isMultilevel: boolean
  basePath?: string
}

type Props = DropdownInterface;

export const useDropdown = create((
  set: SetState<DropdownInterface>,
  get: GetState<DropdownInterface>
) => ({
  isGlobal: true,
  isVisible: false,
  items: [],
  selectedItems: [],
  setSelectedItems: (selectedItems: Array<string>) => set({selectedItems}),
  onClickItem: (item: string) => {},
  showDropdown: (parentRef: any, items: Array<string>, onClickItem: (item: string) => void, horizontalAlign?: "left" | "right" | "right-full" | "left-full",
                 verticalAlign?: "top" | "bottom" | "bottom-full" | "right-full", selectedItems?: Array<string>, header?: any,
                 isMultilevel?: boolean, allowMultipleSelections?: boolean) => {
    set({
      isVisible: true,
      items,
      position: parentRef.getBoundingClientRect(),
      onClickItem,
      horizontalAlign: horizontalAlign ?? "left",
      verticalAlign: verticalAlign ?? "bottom",
      selectedItems: selectedItems ?? [],
      parentRef,
      header,
      isMultilevel: isMultilevel ?? false,
      allowMultipleSelections: allowMultipleSelections ?? true
    })
  },
  hideDropdown: () => set({isVisible: false, items: undefined}),
  position: {},
  horizontalAlign: undefined,
  verticalAlign: undefined,
  parentRef: undefined,
  header: undefined,
  isMultilevel: false,
  allowMultipleSelections: true
}));

export const GlobalDropdown: FunctionComponent<GlobalDropdownInterface> = (props) => {
  let globalProps = useDropdown()
  return (
    <Dropdown {...globalProps} isGlobal/>
  )
}

/***
 * A dropdown that has two modes - global and local.
 * The global mode allows defining the dropdown at the top level of the app, and then calling it from
 * any component using useDropdown. This is then a singleton dropdown that can be only presented in a single
 * place in the page at a time.
 * The local mode allows defining the dropdown as a regular component anywhere you want. This allows having multiple
 * dropdowns appear at the same time, which is useful when you want a dropdown hierarchy with some items opening a
 * sub-dropdown.
 * In any case the dropdown placement is done through the absolute position received from the ref that is passed to
 * the dropdown. This alleviates cases where z-index can cause the dropdown to be clipped when it overflows the parent.
 * The dropdown is just places using a fixed position with a high z-index.
 */
const Dropdown: FunctionComponent<Props> = React.forwardRef((props, ref) => {
  let {isVisible, items, selectedItems, setSelectedItems, hideDropdown, showDropdown, basePath, allowMultipleSelections,
    position, onClickItem, horizontalAlign, verticalAlign, header, isMultilevel, isGlobal, parentRef} = props

  // for local dropdowns, since we don't use the showDropdown function, we need to get the bounding box of the
  // parent manually from here
  if (!position) {
    if (parentRef) {
      position = parentRef.getBoundingClientRect();
    } else {
      return <div/>
    }
  }

  let style: {[key: string]: number} = {};
  if (verticalAlign === "bottom") {
    style.top = position.bottom ?? 0;
  } else if (verticalAlign === "top") {
    style.bottom = window.innerHeight - (position.top ?? 0);
  } else if (verticalAlign === "bottom-full") {
    style.top = position.top ?? 0;
  }
  if (horizontalAlign === "left") {
    style.left = position.left ?? 0;
  } else if (horizontalAlign === "right") {
    style.right = window.innerWidth - (position.right ?? 0) - 15;
  } else if (horizontalAlign === "right-full") {
    style.right = window.innerWidth - (position.left ?? 0) - 15;
  }

  // set the drop minimum width to be the width of the parent
  style.minWidth = position.width;

  const toggleSelectedItem = (item: string) => {
    if (allowMultipleSelections) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      if (selectedItems.includes(item)) {
        setSelectedItems([])
      } else {
        setSelectedItems([item])
      }
      if (hideDropdown) {
        hideDropdown!()
      }
    }
  }

  return (
    <div
      onMouseEnter={() => isGlobal && showDropdown!(parentRef, items, onClickItem, horizontalAlign, verticalAlign,
        selectedItems, header, isMultilevel, allowMultipleSelections)}
      onMouseLeave={hideDropdown}
      className={`${isVisible ? "block" : "hidden"} border border-gray-400 bg-gray-600 rounded text-white fixed z-50 flex flex-col`} style={style}>
      {
        header && (
          <div className="flex flex-col w-full bg-white border border-gray-600 rounded-t">
            {header}
          </div>
        )
      }

      <DropdownItemList
        basePath={basePath}
        items={items}
        selectedItems={selectedItems}
        toggleSelectedItem={toggleSelectedItem}
        onClickItem={onClickItem}
        isMultilevel={isMultilevel}
      />

    </div>
  );
});

export default Dropdown;
