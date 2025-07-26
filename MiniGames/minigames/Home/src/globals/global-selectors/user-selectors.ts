import { GlobalStatesStore } from "@/types/valueTypes";

const getFromStore = <K extends keyof GlobalStatesStore>(field:K) => (state:GlobalStatesStore):GlobalStatesStore[K] => state[field];

const getChangeUserActivity = getFromStore('changeUserActivity');
const getUserState = getFromStore('userActive');
const getActiveIcons = getFromStore('activeIcons');
const addActiveIcon = getFromStore('addActiveIcon');
const getDragAnswer = getFromStore('somethingIsDrag');
const setElementIsDrag = getFromStore('setElementIsDrag');
const getActivatedSelection = getFromStore('activatedSelection');
const setActiveSelection = getFromStore('activateSelection');
const deleteActiveSelection = getFromStore('deactivateSelection');
const clearActiveIcons = getFromStore('clearActiveIcons');

export {
  getChangeUserActivity,getUserState,getActiveIcons,addActiveIcon,
  getDragAnswer,setElementIsDrag,getActivatedSelection,setActiveSelection,deleteActiveSelection,
  clearActiveIcons
};