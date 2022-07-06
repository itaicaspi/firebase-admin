import React, { FunctionComponent } from 'react';
import create, {GetState, SetState, State} from "zustand";

interface OwnProps {}

type Props = OwnProps;

export interface ImagePreviewInterface extends State {
  currentImagePreview?: string
  setCurrentImagePreview: (currentImagePreview?: string) => void
}

export const useImagePreview = create((
  set: SetState<ImagePreviewInterface>,
  get: GetState<ImagePreviewInterface>
) => ({
  currentImagePreview: undefined,
  setCurrentImagePreview: (currentImagePreview?: string) => set({currentImagePreview})
}))

const ImagePreview: FunctionComponent<Props> = (props) => {
  const {currentImagePreview, setCurrentImagePreview} = useImagePreview();

  if (currentImagePreview) {
    return (
      <div className="fixed z-50 right-4 bottom-4 w-40 h-40 shadow-xl rounded overflow-hidden bg-gray-300
                hover:w-[50vw] hover:h-[50vw] transition-all">
        <img
          src={currentImagePreview} alt=""
          className="h-full w-full object-cover"
          onError={() => setCurrentImagePreview(undefined)}
        />
      </div>
    );
  } else {
    return <div/>
  }
};

export default ImagePreview;
