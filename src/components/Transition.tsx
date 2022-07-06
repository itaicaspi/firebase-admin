import React, {FunctionComponent, PropsWithChildren, RefObject} from 'react';
import {AnimatePresence, motion} from "framer-motion";

interface OwnProps {
  uniqueKey: string
  isVisible?: boolean
  className?: string
  style?: any
  type?: "zoom-in" | "zoom-out" | "fade" | "slide-right" | "slide-left" | "slide-up" | "slide-down"
  duration?: number // in seconds
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
  onClick?: (e: React.MouseEvent) => void
  onDragStart?: (e: TouchEvent) => void
  onDrag?: (e: TouchEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
  reverseExit?: boolean
  delay?: number
  drag?: boolean | "x" | "y"
  dragConstraints?: false | Partial<any> | RefObject<Element>
  layoutId?: string
}

type Props = OwnProps;

const Transition: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  let scaleStart = 1;
  if (props.type === "zoom-in") {
    scaleStart = 0.9;
  } else if (props.type === "zoom-out") {
    scaleStart = 1.2;
  }

  let translateXStart = 0;
  if (props.type === "slide-right") {
    translateXStart = -100;
  } else if (props.type === "slide-left") {
    translateXStart = 100;
  }

  let translateYStart = 0;
  if (props.type === "slide-up") {
    translateYStart = 20;
  } else if (props.type === "slide-down") {
    translateYStart = -20;
  }

  const dir = (props.reverseExit ? -1 : 1);
  return (
    <AnimatePresence exitBeforeEnter>
      {props.isVisible && (
        <motion.div
          key={props.uniqueKey}
          initial={{ opacity: 0, scale: scaleStart, translateX: translateXStart, translateY: translateYStart }}
          animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
          exit={{ opacity: 0, scale: scaleStart, translateX: dir*translateXStart, translateY: dir*translateYStart }}
          transition={{ ease: "easeInOut", duration: props.duration ?? 0.3, delay: props.delay }}
          className={props.className}
          style={props.style}
          onMouseEnter={props.onMouseEnter}
          onMouseUp={props.onMouseUp}
          onMouseDown={props.onMouseDown}
          onMouseLeave={props.onMouseLeave}
          onDragStart={props.onDragStart}
          onDrag={props.onDrag}
          onTouchStart={props.onTouchStart}
          onTouchMove={props.onTouchMove}
          onTouchEnd={props.onTouchEnd}
          onClick={props.onClick}
          layoutId={props.layoutId}
          draggable={props.onDrag !== undefined}
          drag={props.drag}
          dragConstraints={props.dragConstraints}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Transition;
