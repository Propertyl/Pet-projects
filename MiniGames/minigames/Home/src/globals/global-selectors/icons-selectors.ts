import { IconsStatesStore } from "@/types/valueTypes";

const getFromStore = <K extends keyof IconsStatesStore>(field:K) => (state:IconsStatesStore):IconsStatesStore[K] => state[field];

export const getActiveIcons = getFromStore('activeIcons');
export const addActiveIcon = getFromStore('addActiveIcon');
export const removeActiveIcon = getFromStore('removeActiveIcon');
export const clearActiveIcons = getFromStore('clearActiveIcons');
export const getDeletedIcons = getFromStore('deletedIcons');
export const getClickedIcon = getFromStore('clickedIcon');
export const setDeletedIcons = getFromStore('addDeletedIcons');
export const setClickedIcon = getFromStore('addClickedIcon');
export const clearClickedIcon = getFromStore('clearClickedIcon');
export const clearDeletedIcons = getFromStore('clearDeletedIcons');
export const getCellSize = getFromStore('cellSize');
export const changeCellSize = getFromStore('setCellSize');
export const getIconsPosition = getFromStore('iconsPosition');
export const changeIconPosition = getFromStore('setIconPosition');
export const removeIconPosition = getFromStore('deleteIconPosition');