import { _2dCoords_ } from "./valueTypes";

interface WindowIconProps {
  icon:string,
  name:string,
  link:string,
  iconId:number,
  active:boolean
}

interface ContextMenuProps {
  pos:_2dCoords_;
  activeIcons:string[];
}

export {WindowIconProps,ContextMenuProps};