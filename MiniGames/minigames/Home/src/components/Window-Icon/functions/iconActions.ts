import { setDispatch } from "@/types/cutTypes";
import { _2dCoords_,IconsStatesStore } from "@/types/valueTypes";
import { NavigateFunction } from "react-router-dom";


export class WindowIconsActions {
  constructor() {
    
  }
}

export class WindowIconActions {
  navigate;
  setActiveIcon;
  setIconPosition;
  setIconsPos;
  setDeletedIcon;
  deleteIconPosition;
  swapIconDrag;
  iconName;
  iconLink;
  cellSize;
  private lastCellY:number;
  private lastCellX:number;
  iconsPosition:IconsStatesStore['iconsPosition'];

  constructor(
    navigate:NavigateFunction,setActiveIcon:IconsStatesStore['addActiveIcon'],
    setIconPosition:setDispatch<_2dCoords_>,
    swapIconDrag:() => void,
    name:string,
    link:string,
    cellSize:number,
    addDeletedIcon:IconsStatesStore['addDeletedIcons'],
    setIconsPos:IconsStatesStore['setIconPosition'],
    deleteIconPosition:IconsStatesStore['deleteIconPosition'],
  ) { 
    this.navigate = navigate;
    this.setActiveIcon = setActiveIcon;
    this.setIconPosition = setIconPosition;
    this.iconName = name;
    this.iconLink = link;
    this.swapIconDrag = swapIconDrag;
    this.cellSize = cellSize;
    this.setDeletedIcon = addDeletedIcon;
    this.setIconsPos = setIconsPos;
    this.deleteIconPosition = deleteIconPosition;
   };

  iconClicked = (event:React.MouseEvent) => {
    const target = event.target as HTMLDivElement;
    this.setActiveIcon(this.iconName);
    console.log('active icon:',this.iconName);
    target.focus();
  };

  iconDblClicked = () => {
    if(this.iconLink.length) {
      window.open(this.iconLink,'_blank');
    }
  }

  iconDragStart = (event:React.DragEvent) => {
    event.dataTransfer.setData('text/plain',this.iconName);
    this.swapIconDrag();
  }

  iconDragEnd = (event:React.DragEvent) => {
    const x = event.clientX - this.cellSize / 2;
    const y = event.clientY - this.cellSize / 2;

    let cellX = Math.round(x / this.cellSize);
    let cellY = Math.abs(Math.round(y / this.cellSize));
    const canPos = this.iconsPosition.get('Trash can');
    const {x:prevCellX,y:prevCellY} = this.iconsPosition.get(this.iconName);

    if(canPos && (canPos.x === cellX && canPos.y === cellY) && this.iconName !== 'Trash can') {
      this.iconDrop(this.iconName);
      this.swapIconDrag();
      return;
    }

    const checkCells = (checkedNames:string[] = []) => {
      for(let [name,{x,y}] of this.iconsPosition) {
        if(name === this.iconName) continue;
        
        if((cellX === x && cellY === y)) {
          const direction = (x + y) - (prevCellX + prevCellY);
          const {newCellX,newCellY} = this.iconsDragPositionVector(
            {cellX,cellY},
            {maxX:this.lastCellX,maxY:this.lastCellY},
            direction
          );

          if(cellX === newCellX && cellY === newCellY) {
            return;
          }

          cellX = newCellX;
          cellY = newCellY;
    
          return checkCells([...checkedNames,name]);
        }
      }

      const snappedX = cellX * this.cellSize;
      const snappedY = cellY * this.cellSize;

      this.iconsPosition.set(this.iconName,{x:cellX,y:cellY});
      this.setIconsPos(this.iconName,{x:cellX,y:cellY});
      this.setIconPosition({x:snappedX,y:snappedY});
    }

    checkCells();
    this.swapIconDrag();
  }

  iconOverCan(canPos:_2dCoords_,iconPos:_2dCoords_,iconName:string) {
    if(canPos.x === iconPos.x && canPos.y === iconPos.y) {
      this.iconDrop(iconName);
    }
  }

  iconDrop = (name:string) => {
    console.log('dropped:',name);
    this.iconsPosition.delete(name);
    this.deleteIconPosition(name);
    this.setDeletedIcon([name]);
  }

  iconsDragPositionVector(
    {cellX,cellY}:Record<string,number>,
    {maxX,maxY}:Record<string,number>,
    direction:number
  ) {
    let newCellX = cellX;
    let newCellY = cellY;

    const changeVector = () => {

      const changeValue = (value:number) => direction > 0 ? value + 1 : value - 1;

      if(newCellX > 0 && newCellX < maxX) {
        newCellX = changeValue(newCellX);
      } else if(newCellY > 0 && newCellY < maxY) {
        newCellY = changeValue(newCellY);
      }
    }

    changeVector();
    
    return {newCellX,newCellY};
  }

  changeCellSize = (value:number) => {
    this.cellSize = value;
    this.lastCellX = Math.round(window.innerWidth / value) - 1;
    this.lastCellY = Math.abs(Math.round(window.innerHeight / value)) - 1;
  }

  changeIconsPosition = (positions:IconsStatesStore['iconsPosition']) => {
    this.iconsPosition = positions;
  }

};