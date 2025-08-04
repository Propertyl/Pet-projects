import { GlobalStatesStore } from "@/types/valueTypes";

const getFromStore = <K extends keyof GlobalStatesStore>(field:K) => (state:GlobalStatesStore):GlobalStatesStore[K] => state[field];

export const getChangeUserActivity = getFromStore('changeUserActivity');
export const getUserState = getFromStore('userActive');
export const getDragAnswer = getFromStore('somethingIsDrag');
export const setElementIsDrag = getFromStore('setElementIsDrag');
export const getActivatedSelection = getFromStore('activatedSelection');
export const setActiveSelection = getFromStore('activateSelection');
export const deleteActiveSelection = getFromStore('deactivateSelection');
export const contextMenuSpawned = getFromStore('isContextMenuSpawned');
export const changeContextMenuSpawn = getFromStore('setContextMenuSpawn');
export const getContextMenuPos = getFromStore('contextMenuPos');
export const changeContextMenuPos = getFromStore('changeContextMenuPos');

