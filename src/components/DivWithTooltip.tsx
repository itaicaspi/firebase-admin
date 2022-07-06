import React, {FunctionComponent, PropsWithChildren, useRef} from 'react';
import {useTooltip} from "./Tooltip";

interface OwnProps {
  tooltip: string
}

type Props = OwnProps;

const DivWithTooltip: FunctionComponent<PropsWithChildren<any>> = (props) => {
  const [showTooltip, hideTooltip] = useTooltip((store) => [store.showTooltip, store.hideTooltip])
  const ref = useRef<any>(null);
  return (
    <div
      ref={ref}
      onMouseLeave={hideTooltip}
      onMouseEnter={(e) => {
        showTooltip!(
          e.currentTarget,
          props.tooltip,
          "center",
          "top"
        )
      }}
    >
      {props.children}
    </div>
  );
};

export default DivWithTooltip;
