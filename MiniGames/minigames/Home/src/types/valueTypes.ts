type EmptyFunc = () => void;
type IconFunc<T = string> = (icon:T) => void;
type HandlersFunc<T = unknown> = (arg:T) => void;

type _2dCoords_ = {
  x:number;
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

interface IconsStatesStore {
  setCellSize:IconFunc<number>;
  setIconPosition:(icon:string,pos:_2dCoords_) => void;
  deleteIconPosition:(icon:string) => void;
  addActiveIcon:IconFunc;
  removeActiveIcon:IconFunc;
  clearActiveIcons:EmptyFunc;
  addDeletedIcons:IconFunc<string[]>;
  addClickedIcon:IconFunc;
  clearClickedIcon:EmptyFunc;
  clearDeletedIcons:EmptyFunc;
  cellSize:number;
  clickedIcon:string;
  deletedIcons:string[];
  activeIcons:string[];
  iconsPosition:Map<string,_2dCoords_>
}

interface GlobalStatesStore {
  changeUserActivity:<K extends keyof GlobalStatesStore['userActive']>(key:K) => void;
  setElementIsDrag:EmptyFunc;
  setContextMenuSpawn:HandlersFunc<boolean>;
  changeContextMenuPos:HandlersFunc<_2dCoords_>;
  activateSelection:(selectionRect:SelectionRect) => void;
  deactivateSelection:EmptyFunc;
  userActive:{clicked:boolean;manySelect:boolean};
  somethingIsDrag:boolean;
  isContextMenuSpawned:boolean;
  contextMenuPos:_2dCoords_
  activatedSelection:SelectionRect | null;
}

export {
  selectionPoints,_2dCoords_,
  GlobalStatesStore,SelectionRect,
  IconsStatesStore
};