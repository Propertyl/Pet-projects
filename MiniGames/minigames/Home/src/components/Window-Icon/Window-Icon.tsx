import { WindowIconProps } from "@/types/elementProps";
import './Window-Icon.scss';
import { useNavigate } from "react-router-dom";
import useGlobalStatesStore from "@/stores/globalStates";
import { addActiveIcon, getActivatedSelection,setElementIsDrag } from "@/globals/global-selectors/user-selectors";
import { WindowIconActions } from "./functions/iconActions";
import { useEffect, useLayoutEffect,useRef, useState } from "react";
import { _2dCoords_ } from "@/types/valueTypes";

const WindowIcon = ({icon,name,link,iconId,active}:WindowIconProps) => {
  const navigate = useNavigate();
  const setActiveIcon = useGlobalStatesStore(addActiveIcon);
  const swapIconDrag = useGlobalStatesStore(setElementIsDrag);
  const activatedSelection = useGlobalStatesStore(getActivatedSelection);
  const windowIcon = useRef<WindowIconActions | null>(null);
  const [iconPosition, setIconPosition] = useState<_2dCoords_>({x:undefined,y:undefined});
  const [classReceived,setClassReceived] = useState<boolean>(false);
  const iconGap = `${7 * iconId}rem`;
  const iconRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if(!windowIcon.current) {
      windowIcon.current = new WindowIconActions(
        navigate,
        setActiveIcon,
        setIconPosition,
        swapIconDrag,
        name,
        link
      );

      setClassReceived(true);
    } 
  },[windowIcon]);

  useEffect(() => {
    if(activatedSelection && iconRef.current && !active) {
      const currentIcon = iconRef.current;
      const {width:iconWidth,height:iconHeight} = currentIcon.getBoundingClientRect();
      const {x = 0,y = 0} = iconPosition;
      const {top,left,width,height} = activatedSelection;
      const fullSizeX = iconWidth + x;
      const fullSizeY = iconHeight + y;
      const endBoundaryX = left + width;
      const endBoundaryY = top + height;

      if((fullSizeX >= left && x <= endBoundaryX) && (fullSizeY >= top && y <= endBoundaryY)) {
        setActiveIcon(name);
        iconRef.current.focus();
      }
    }

  },[activatedSelection]);

  return (
    <>
      { classReceived &&
       <div ref={iconRef} style={{top:iconPosition.y ?? '3rem',left:iconPosition.x ?? iconGap}} draggable={true} tabIndex={0}
        onDragStart={
          windowIcon.current.iconDragStart
        } onDragEnd={
          windowIcon.current.iconDragEnd
        } onClick={
          windowIcon.current.iconClicked
        } onDoubleClick={
          windowIcon.current.iconDblClicked
        } className={`window-icon ${active ? 'window-icon-active' : ''}`}>
            <img src={icon} alt={`${name}-icon`} className="window-icon-image"/>
            <p className="window-icon-name">{name}</p>
        </div>
      }
    </>
  );
}
 
export default WindowIcon;