import React, {FunctionComponent, PropsWithChildren} from 'react';
import create, {GetState, SetState, State} from "zustand";

export interface TooltipInterface extends State {
  isVisible?: boolean,
  className?: string
  showTooltip?: (parentRef: any, title: string, horizontalAlign?: "left" | "right" | "right-full" | "left-full" | "center",
                 verticalAlign?: "top" | "bottom" | "bottom-full" | "right-full") => void,
  hideTooltip?: () => void,
  title?: string
  position?: any,
  horizontalAlign?: "left" | "right" | "right-full" | "left-full" | "center",
  verticalAlign?: "top" | "bottom" | "bottom-full" | "right-full",
}

type Props = TooltipInterface;

export const useTooltip = create((
  set: SetState<TooltipInterface>,
  get: GetState<TooltipInterface>
) => ({
  isVisible: false,
  stickHorizontallyTo: undefined,
  stickVerticallyTo: undefined,
  className: undefined,
  showTooltip: (parentRef: any, title: string, horizontalAlign?: "left" | "right" | "right-full" | "left-full" | "center",
                 verticalAlign?: "top" | "bottom" | "bottom-full" | "right-full") => set({
    isVisible: true,
    position: parentRef.getBoundingClientRect(),
    horizontalAlign: horizontalAlign ?? "left",
    verticalAlign: verticalAlign ?? "bottom",
    title
  }),
  hideTooltip: () => set({isVisible: false}),
  title: "",
  position: undefined,
  horizontalAlign: undefined,
  verticalAlign: undefined
}));

const Tooltip: FunctionComponent<PropsWithChildren<any>> = (props) => {
  const {isVisible, title, horizontalAlign, verticalAlign, className, position} = useTooltip()

  let style: {[key: string]: number} = {};
  if (verticalAlign === "bottom") {
    style.top = position.bottom ?? 0;
  } else if (verticalAlign === "top") {
    style.bottom = window.innerHeight - (position.top ?? 0) + 6;
  } else if (verticalAlign === "bottom-full") {
    style.top = position.top ?? 0;
  }
  if (horizontalAlign === "left") {
    style.left = position.left ?? 0;
  } else if (horizontalAlign === "right") {
    style.right = window.innerWidth - (position.right ?? 0) - 15;
  } else if (horizontalAlign === "right-full") {
    style.right = window.innerWidth - (position.left ?? 0) - 15;
  } else if (horizontalAlign === "center") {
    style.left = (position.left ?? 0) + (position.width ?? 0) / 2;
  }

  return (
    <div className={`${isVisible ? "block" : "hidden"} fixed -translate-x-1/2
           bg-gray-600 text-white px-2 py-1 text-xs rounded z-50 ${className}`}
         style={style}>
      {title}
    </div>
  );
};

export default Tooltip;
