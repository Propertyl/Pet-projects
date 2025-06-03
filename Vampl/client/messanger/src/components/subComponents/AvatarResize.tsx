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
    if(file.current && canvasRef.current && avatarImage.current && overlayRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const overlay = overlayRef.current;
        const image = avatarImage.current;
        const rect = overlayRef.current!.getBoundingClientRect();
        const imageRect = avatarImage.current.getBoundingClientRect();
      if(ctx) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        console.log('ima:',avatarImage.current,rect,overlayPos.x,overlayPos.y);
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
        canvas.toBlob((blob) => {
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
               <button className="resizing-button flex-center cancel-button" onClick={() => setImage(null)}>
                  <svg className="random-icon button-icon" width="64px" height="64px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#000000" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
               </button>
               <h2 className="resizing-header flex-center">Drag to The Position</h2>
               <button className="resizing-button flex-center confirm-button dimmed-button" onClick={confirmImage}>
                <svg className="random-icon button-icon" fill="#000000" height="64px" width="64px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 492 492" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M484.128,104.478l-16.116-16.116c-5.064-5.068-11.816-7.856-19.024-7.856c-7.208,0-13.964,2.788-19.028,7.856 L203.508,314.81L62.024,173.322c-5.064-5.06-11.82-7.852-19.028-7.852c-7.204,0-13.956,2.792-19.024,7.852l-16.12,16.112 C2.784,194.51,0,201.27,0,208.47c0,7.204,2.784,13.96,7.852,19.028l159.744,159.736c0.212,0.3,0.436,0.58,0.696,0.836 l16.12,15.852c5.064,5.048,11.82,7.572,19.084,7.572h0.084c7.212,0,13.968-2.524,19.024-7.572l16.124-15.992 c0.26-0.256,0.48-0.468,0.612-0.684l244.784-244.76C494.624,132.01,494.624,114.966,484.128,104.478z"></path> </g> </g> </g></svg>
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
