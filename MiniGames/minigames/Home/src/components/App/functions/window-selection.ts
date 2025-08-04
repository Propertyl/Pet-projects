import { setDispatch } from "@/types/cutTypes";
import { _2dCoords_, GlobalStatesStore, selectionPoints } from "@/types/valueTypes";

export class UserSelection {
  setSpawnSelection;
  setPoints;
  changeActivity;
  setActiveSelection;
  setClearActiveSelection;
  setContextMenuSpawn;
  setContextMenuPos;
  setClearActiveIcons;
  private contextMenuSpawned = false;
  private timer:NodeJS.Timeout = null;
  private start:selectionPoints['startPoint'] = {x:undefined,y:undefined};
  private end:selectionPoints['endPoint'] = {x:undefined,y:undefined};
  private userSelectSomething:boolean;

  constructor(
    spawnSelection:setDispatch<boolean>,setPoints:setDispatch<selectionPoints>,
    changeActivity:GlobalStatesStore['changeUserActivity'],
    setActivatedSelection:GlobalStatesStore['activateSelection'],
    setClearActiveSelection:GlobalStatesStore['deactivateSelection'],
    setContextMenuSpawn:setDispatch<boolean>,
    setContextMenuPos:setDispatch<_2dCoords_>,
    setClearActiveIcons:GlobalStatesStore['clearActiveIcons'],
  ) {
    this.setSpawnSelection = spawnSelection;
    this.setPoints = setPoints;
    this.changeActivity = changeActivity;
    this.setActiveSelection = setActivatedSelection;
    this.setClearActiveSelection = setClearActiveSelection;
    this.setContextMenuSpawn = setContextMenuSpawn;
    this.setContextMenuPos = setContextMenuPos;
    this.setClearActiveIcons = setClearActiveIcons;
  };

  startSelection = (event:MouseEvent) => {
    this.timer = setTimeout(() => {
      this.setSpawnSelection(true);
      this.start.x = event.clientX;
      this.start.y = event.clientY;

      this.setPoints(points => {
        const startPoint = {...points.startPoint};
        startPoint.x = event.clientX;
        startPoint.y = event.clientY;

        return {...points,startPoint};
      });

      if(!this.userSelectSomething) {
        this.changeActivity('manySelect');
        this.userSelectSomething = true;
      }

    },150);
  }

  moveSelection = (event:MouseEvent) => {
    this.end.x = event.clientX;
    this.end.y = event.clientY;

    this.setPoints(points => {
      const endPoint = {...points.endPoint};
      const startPoint = points.startPoint;

      endPoint.x = this.checkScreenBoundariesTouch(startPoint.x,event.clientX,window.innerWidth,endPoint.x);

      endPoint.y = this.checkScreenBoundariesTouch(startPoint.y,event.clientY,window.innerHeight,endPoint.y);

      return {...points,endPoint};
    });
  };

  endSelection = () => {
    if(Object.values(this.start).every(coord => coord !== undefined)) {
      this.setActiveSelection({
        top:this.start.y,
        left:this.start.x,
        width:this.calculateSize(this.start.x,this.end.x),
        height:this.calculateSize(this.start.y,this.end.y)
      });

      this.setContextMenuPos({x:this.end.x,y:this.end.y});
      this.start = {x:undefined,y:undefined};
      this.end = {x:undefined,y:undefined};
      this.setContextMenuSpawn(true);
      this.contextMenuSpawned = true;
    } else {
      this.checkForClearActiveIcons();
    }

    this.setSpawnSelection(false);
    this.setPoints({
        startPoint:{x:0,y:0},
        endPoint:{x:0,y:0}
    });

    clearTimeout(this.timer);
  }

  calculateSize = (start:number,end:number) => {
    return end - start;
  }

  checkForClearActiveIcons = () => {
    if(this.contextMenuSpawned) {
      this.contextMenuSpawned = false;
      return;
    }

    this.setContextMenuSpawn(false);
    this.setClearActiveIcons();
  }

  checkScreenBoundariesTouch = (
    startPos:number,
    nextValue:number,
    windowBoundary:number,
    currentValue:number
  ) => {
    const selectionBoundary = startPos + (nextValue - startPos);
    
    if(selectionBoundary < windowBoundary) {
      return nextValue;
    }

    return currentValue;
  }

}
 
