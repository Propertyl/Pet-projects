type _2dCoords_ = {
  x:number,
  y:number
}

interface selectionPoints {
  startPoint:_2dCoords_;
  endPoint:_2dCoords_;
}

interface SelectionRect {
  top:number;
  left:number;
  width:number;
  height:number;
}

interface GlobalStatesStore {
  changeUserActivity:<K extends keyof GlobalStatesStore['userActive']>(key:K) => void;
  addActiveIcon:(icon:string) => void;
  clearActiveIcons:() => void;
  setElementIsDrag:() => void;
  activateSelection:(selectionRect:SelectionRect) => void;
  deactivateSelection:() => void;
  userActive:{clicked:boolean;manySelect:boolean};
  activeIcons:string[];
  somethingIsDrag:boolean;
  activatedSelection:SelectionRect | null;
}

export {selectionPoints,_2dCoords_,GlobalStatesStore,SelectionRect};