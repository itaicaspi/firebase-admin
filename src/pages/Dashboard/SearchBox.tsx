import React, { FunctionComponent } from 'react';

interface OwnProps {
  onChanged: (newValue: string) => void
  value?: string
}

type Props = OwnProps;

const SearchBox: FunctionComponent<Props> = (props) => {
  const {onChanged} = props;
  return (
    <div className="flex items-center relative group text-sm w-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 absolute left-2 top-1.5 bottom-0 z-10 group-focus-within:text-gray-500"
           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Type to search current docs"
        className="w-full py-1 pl-8 pr-2 outline-none border border-gray-300 rounded focus:border-gray-500"
        onChange={(e) => onChanged(e.target.value)}
        value={props.value}
      />
      {
        props.value && props.value !== "" && (
          <svg
            onClick={() => props.onChanged("")}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500 hover:text-blue-500 absolute right-2 h-full z-10 cursor-pointer"
               fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }

    </div>
  );
};

export default SearchBox;
