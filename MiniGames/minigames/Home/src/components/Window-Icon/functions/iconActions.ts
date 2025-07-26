import { setDispatch } from "@/types/cutTypes";
import { _2dCoords_, GlobalStatesStore } from "@/types/valueTypes";
import { NavigateFunction } from "react-router-dom";

export class WindowIconActions {
  navigate;
  setActiveIcon;
  setIconPosition;
  swapIconDrag;
  iconName;
  iconLink;

  constructor(
    navigate:NavigateFunction,setActiveIcon:GlobalStatesStore['addActiveIcon'],
    setIconPosition:setDispatch<_2dCoords_>,
    swapIconDrag:() => void,
    name:string,
    link:string
  ) { 
    this.navigate = navigate;
    this.setActiveIcon = setActiveIcon;
    this.setIconPosition = setIconPosition;
    this.iconName = name;
    this.iconLink = link;
    this.swapIconDrag = swapIconDrag;
   };

  iconClicked = (event:React.MouseEvent) => {
    const target = event.target as HTMLDivElement;
    this.setActiveIcon(this.iconName);
    target.focus();
  };

  iconDblClicked = () => {
    window.open(this.iconLink,'_blank');
  };


  iconDragStart = () => {
    this.swapIconDrag();
  }

  iconDragEnd = (event:React.DragEvent) => {
    const icon = event.target as HTMLDivElement;
    const iconRect = icon.getBoundingClientRect();
    const cellSize = iconRect.width + iconRect.height;
    const x = event.clientX - iconRect.width / 2;
    const y = event.clientY - iconRect.height / 2;

    const snappedX = Math.round(x / cellSize) * cellSize;
    const snappedY = Math.round(y / cellSize) * cellSize;

    this.setIconPosition({x:snappedX,y:snappedY});
    this.swapIconDrag();
  }

};