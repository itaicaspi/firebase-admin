import React, {FunctionComponent, useEffect, useState} from 'react';
import ReactTimeAgo from "react-time-ago";

interface OwnProps {
  time?: Date
}

type Props = OwnProps;

const AutoUpdatingTimeAgo: FunctionComponent<Props> = (props) => {
  const [state, setState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((state) => (state + 1) % 2);
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!props.time) {
    return <div/>
  }
  return (
    <div className="text-xs flex items-center">
      <ReactTimeAgo date={props.time} locale="en-US"/>
    </div>
  );
};

export default AutoUpdatingTimeAgo;
