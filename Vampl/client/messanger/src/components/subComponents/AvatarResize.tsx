import { Dispatch, RefObject, SetStateAction } from "react";
import serv from "../functions/interceptors";

const AvatarResizer = ({image,file,swapAnimation}:{image:RefObject<string | null>,file:RefObject<Blob | null>,swapAnimation:Dispatch<SetStateAction<boolean>>}) => {
  const confirmImage = () => {
    if(file.current) {
      const formData = new FormData();
      formData.append('file',file.current);

      serv.put('/getData/user-avatar',
        formData
      );

      swapAnimation(true);
      file.current = null;
    }
  }
  return (
    <div>
      <div>
        <div></div>
        <img src={image.current ?? ''} alt=""/>
      </div>
      <div>
        <img src={image.current ?? ''} alt="" />
      </div>
      <button onClick={confirmImage}>
          Confirm
      </button>
    </div>
  )
}

export default AvatarResizer;
