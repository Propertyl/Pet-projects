import { WindowIconProps } from "@/types/elementProps";
import './Window-Icon.scss';
import { useNavigate } from "react-router-dom";
import useGlobalStatesStore from "@/stores/globalStates";
import { changeContextMenuPos, changeContextMenuSpawn, getActivatedSelection,setElementIsDrag } from "@/globals/global-selectors/user-selectors";
import { WindowIconActions } from "./functions/iconActions";
import { useEffect,useRef,useState } from "react";
import { _2dCoords_ } from "@/types/valueTypes";
import { addActiveIcon, changeCellSize, changeIconPosition, getCellSize, getClickedIcon, getIconsPosition, removeIconPosition, setDeletedIcons } from "@/globals/global-selectors/icons-selectors";
import useIconStatesStore from "@/stores/iconStates";

let originalPosition = 0;

const WindowIcon = ({icon,name,link,iconId,active}:WindowIconProps) => {
  const navigate = useNavigate();
  const setActiveIcon = useIconStatesStore(addActiveIcon);
  const swapIconDrag = useGlobalStatesStore(setElementIsDrag);
  const setCellSize = useIconStatesStore(changeCellSize);
  const addDeletedIcon = useIconStatesStore(setDeletedIcons);
  const setContextMenuSpawn = useGlobalStatesStore(changeContextMenuSpawn);
  const setContextMenuPos = useGlobalStatesStore(changeContextMenuPos);
  const setIconsPos = useIconStatesStore(changeIconPosition);
  const deleteIconPosition = useIconStatesStore(removeIconPosition);
  const iconsPos = useIconStatesStore(getIconsPosition);
  const activatedSelection = useGlobalStatesStore(getActivatedSelection);
  const cellSize = useIconStatesStore(getCellSize);
  const clickedIcon = useIconStatesStore(getClickedIcon);
  const windowIcon = useRef<WindowIconActions | null>(null);
  const [iconPosition, setIconPosition] = useState<_2dCoords_>({x:undefined,y:undefined});
  const [classReceived,setClassReceived] = useState<boolean>(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!iconsPos.has(name)) {
      setIconsPos(name,{x:iconId,y:1});
    }
  },[iconsPos]);

  useEffect(() => {
    if(!windowIcon.current) {
      windowIcon.current = new WindowIconActions(
        navigate,
        setActiveIcon,
        setIconPosition,
        swapIconDrag,
        name,
        link,
        cellSize,
        addDeletedIcon,
        setIconsPos,
        deleteIconPosition
      );

      setClassReceived(true);
    } 
  },[windowIcon]);

  useEffect(() => {
    if(classReceived) {
      windowIcon.current.changeIconsPosition(iconsPos);
    }
  },[classReceived]);

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

  useEffect(() => {
    if(classReceived && icon) {
      const {width} = iconRef.current.getBoundingClientRect();
      setCellSize(width);
      console.log('icon:',iconId,width);
      originalPosition = width * iconId;

      windowIcon.current.changeCellSize(width);
    }
  },[classReceived,icon]);

  useEffect(() => {
    if(clickedIcon === name) {
      windowIcon.current.iconDblClicked();
    }
  },[clickedIcon]);

  return (
    <>
      {classReceived && icon &&
       <div ref={iconRef} style={{top:iconPosition.y ?? `${cellSize}px`,left:iconPosition.x ?? `${originalPosition}px`}} draggable={true} tabIndex={0}
        onContextMenu={(event:React.MouseEvent) => {
          event.preventDefault();
          const x = event.clientX;
          const y = event.clientY;
          setContextMenuSpawn(true);
          setContextMenuPos({x,y});
          setActiveIcon(name);
        }}
        onDragStart = {
          windowIcon.current.iconDragStart
        } onDragEnd = {
          windowIcon.current.iconDragEnd
        } onClick = {
          windowIcon.current.iconClicked
        } onDoubleClick = {
          windowIcon.current.iconDblClicked
        } className = {`window-icon ${active ? 'window-icon-active' : ''}`}>
            <img src={icon} alt={`${name}-icon`} className="window-icon-image"/>
            <p className="window-icon-name">{name}</p>
        </div>
      }
    </>
  );
}
 
export default WindowIcon;