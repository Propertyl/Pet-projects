import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import serv from "../functions/interceptors";
import { ElementRef } from "../types/global";

const AvatarResizer = ({imageControl,file,swapAnimation}:{imageControl:[string | null,Dispatch<SetStateAction<string | null>>],file:ElementRef<Blob>,swapAnimation:Dispatch<SetStateAction<boolean>>}) => {
  const [image,setImage] = imageControl;
  const [overlayPos,setOverlayPos] = useState<{x:number,y:number}>({x:0,y:0});
  const [overlaySize,setOverlaySize] = useState<number>(200);
  const overlayRef:ElementRef<HTMLDivElement> = useRef(null);
  const imageContainer:ElementRef<HTMLDivElement> = useRef(null);
  const canvasRef:ElementRef<HTMLCanvasElement> = useRef(null);
  const avatarImage:ElementRef<HTMLImageElement> = useRef(null);
  const shift:RefObject<{X:number,Y:number}> = useRef({X:0,Y:0});

  const confirmImage = () => {
    if(file.current && canvasRef.current && avatarImage.current) {
      const editor = canvasRef.current;
      const ctx = editor.getContext('2d');
      const rect = overlayRef.current!.getBoundingClientRect();
      if(ctx) {
        console.log('pizda:',ctx,);
        ctx.drawImage(avatarImage.current,rect.left,rect.top,rect.width,rect.width, 0, 0,rect.width,rect.width);
        canvasRef.current.toBlob((blob) => {
          if(!blob) return;

          const formData = new FormData();
          formData.append('file',blob,'avatar.png');

          serv.put('/getData/user-avatar',
            formData
          );
        },
        'image/png',
        1.0
        );

        swapAnimation(true);
        file.current = null;
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
               <button onClick={() => setImage(null)}>
                  X
               </button>
               <p>Drag to The Position</p>
               <button onClick={confirmImage}>Confirm</button>
            </div>
              <div ref={imageContainer} className="avatar-image-container">
                  <div ref={overlayRef} style={{top:`${overlayPos.y}px`,left:`${overlayPos.x}px`,width:overlaySize,height:overlaySize}} className="avatar-image-overlay">
                    <img ref={avatarImage} style={{top:`-${overlayPos.y}px`,left:`-${overlayPos.x}px`}} draggable={false} className="avatar-image image-rounded" src={image ?? ''} alt="" />
                  </div>
                  <div className="avatar-image-overlay-long">
                    <img className="avatar-image" src={image ?? ''} alt="" />
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default AvatarResizer;
