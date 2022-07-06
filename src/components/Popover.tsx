import React, {FunctionComponent, PropsWithChildren} from 'react';
import Transition from "./Transition";
import create, {GetState, SetState, State} from "zustand";

interface OwnProps {
  centerVertically?: boolean
  className?: string
}

type Props = OwnProps;

export interface PopoverInterface extends State {
  isVisible: boolean,
  children: any,
  showPopover: (children: any, title?: string) => void,
  hidePopover: () => void,
  title?: string
}

export const usePopover = create((
  set: SetState<PopoverInterface>,
  get: GetState<PopoverInterface>
) => ({
  isVisible: false,
  children: null,
  showPopover: (children: any, title?: string) => set({isVisible: true, children, title}),
  hidePopover: () => set({isVisible: false, children: null}),
  title: undefined
}));

const Popover: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const {isVisible, children, hidePopover, title} = usePopover()
  return (
    <Transition
      uniqueKey="popover-background"
      isVisible={isVisible}
      className="fixed inset-0 z-[60] bg-opacity-50 bg-black flex items-start pt-10 justify-center pointer-events-auto"
      onMouseDown={hidePopover}
    >
      <Transition
        uniqueKey="popover"
        type="slide-down"
        isVisible={isVisible}
        className={`bg-white rounded-lg h-[80vh] w-[90vw] sm:h-auto sm:w-[40vw] sm:max-w-[90vw] 
        flex flex-col space-y-3 ${props.centerVertically && "my-auto"} ${props.className}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex justify-between">
            <h1>
              {title}
            </h1>
            <div className="hover:text-primary cursor-pointer" onClick={hidePopover}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          {children}
        </div>
      </Transition>
    </Transition>
  );
};

export default Popover;
