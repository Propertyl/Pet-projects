import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { ElementRef } from "../types/global";
import { useUpdateAvatarDataMutation } from "../../store/api/dataApi";

const AvatarResizer = ({imageControl,file,swapAnimation}:{imageControl:[string | null,Dispatch<SetStateAction<string | null>>],file:ElementRef<Blob>,swapAnimation:Dispatch<SetStateAction<boolean>>
}) => {
  const [image,setImage] = imageControl;
  const [overlayPos,setOverlayPos] = useState<{x:number,y:number}>({x:0,y:0});
  const [overlaySize,setOverlaySize] = useState<number>(200);
  const overlayRef:ElementRef<HTMLDivElement> = useRef(null);
  const imageContainer:ElementRef<HTMLDivElement> = useRef(null);
  const canvasRef:ElementRef<HTMLCanvasElement> = useRef(null);
  const avatarImage:ElementRef<HTMLImageElement> = useRef(null);
  const shift:RefObject<{X:number,Y:number}> = useRef({X:0,Y:0});
  const [updateUserAvatar] = useUpdateAvatarDataMutation();

  const confirmImage = () => {
    if(file.current && canvasRef.current && avatarImage.current && overlayRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const overlay = overlayRef.current;
      const image = avatarImage.current;
      const rect = overlayRef.current!.getBoundingClientRect();

      if(ctx) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const overlayRect = overlay.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();

        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;

        const scaleX = naturalWidth / imageRect.width;
        const scaleY = naturalHeight / imageRect.height;

        const cropX = (overlayRect.left - imageRect.left) * scaleX;
        const cropY = (overlayRect.top - imageRect.top) * scaleY;
        const cropWidth = overlayRect.width * scaleX;
        const cropHeight = overlayRect.height * scaleY;

        canvas.width = overlayRect.width;
        canvas.height = overlayRect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
        canvas.toBlob(async (blob) => {
          if(!blob) return;

          const formData = new FormData();
          formData.append('file',blob,'avatar.png');

          await updateUserAvatar(formData).unwrap();
        },
        'image/png',
        1.0
        );

        swapAnimation(true);
      }
    }
  }


  const resizeOverlay = (event:WheelEvent) => {
    if(imageContainer.current) {
      event.preventDefault();
      const containerRect = imageContainer.current.getBoundingClientRect();
      if(event.deltaY > 0) {
        setOverlaySize(size => Math.min(containerRect.width / 2,size + 4));
      } 

      if(event.deltaY < 0) {
        setOverlaySize(size => Math.max(200,size - 4));
      }
    }
  }

  const dragMove = (event:MouseEvent) => {
    if(imageContainer.current) {
      const overlayRect =  overlayRef.current!.getBoundingClientRect();
      const containerRect = imageContainer.current.getBoundingClientRect();
      const cursorShift = shift.current;
      setOverlayPos(pos => {
        const newPos = {...pos};

        const newX = Math.max(0,event.pageX - cursorShift.X - containerRect.left);
        const newY = Math.max(0,event.pageY - cursorShift.Y - containerRect.top);
        newPos.x = Math.min(newX,containerRect.width - overlayRect.width);
        newPos.y = Math.min(newY,containerRect.height - overlayRect.height);

        return newPos;
      });

    }
  }

  function getCoords(elem:HTMLDivElement) {  
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  useEffect(() => {
    if(overlayRef.current) {
      const dragStart = (event:MouseEvent) => {
        if(overlayRef.current && imageContainer.current) {
          const overlayCoords = getCoords(overlayRef.current);

          shift.current = {
              X:event.pageX - overlayCoords.left,
              Y:event.pageY - overlayCoords.top
          };

          document.addEventListener('mousemove',dragMove);
          document.addEventListener('mouseup',dragEnd);
        }
      }

      const dragEnd = () => {
        document.removeEventListener('mousemove',dragMove);
        document.removeEventListener('mouseup',dragEnd);
      }

       overlayRef.current.addEventListener('wheel',resizeOverlay);
       overlayRef.current.addEventListener('mousedown',dragStart);

       return () => {
        if(overlayRef.current) {
          overlayRef.current.removeEventListener('wheel',resizeOverlay);
          overlayRef.current.removeEventListener('mousedown',dragStart);
        }
       }
    }
  },[overlayRef])

  return (
    <>
     <canvas ref={canvasRef}></canvas>
      <div className="bg-dimmer flex-center resizing-dimmer">
          <div className="avatar-resizing-window">
            <div className="resizing-window-header">
               <button className="resizing-button flex-center cancel-button" onClick={() => setImage(null)}>
                  <svg className="random-icon button-icon" width="64px" height="64px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#000000" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
               </button>
               <h2 className="resizing-header flex-center">Drag to The Position</h2>
               <button className="resizing-button flex-center confirm-button dimmed-button" onClick={confirmImage}>
                  <svg className="random-icon button-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                  <path d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z"></path>
                </svg>
               </button>
            </div>
              <div ref={imageContainer} className="avatar-image-container">
                  <div ref={overlayRef} style={{top:`${overlayPos.y}px`,left:`${overlayPos.x}px`,width:overlaySize,height:overlaySize}} className="avatar-image-overlay">
                    <img style={{top:`-${overlayPos.y}px`,left:`-${overlayPos.x}px`}} draggable={false} className="avatar-image image-rounded" src={image ?? ''} alt="" />
                  </div>
                  <div className="avatar-image-overlay-long">
                    <img ref={avatarImage}  className="avatar-image" src={image ?? ''} alt="" />
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default AvatarResizer;
