import { GlobalStatesStore, SelectionRect } from "@/types/valueTypes";
import { create, StoreApi, UseBoundStore } from "zustand";

const useGlobalStatesStore:UseBoundStore<StoreApi<GlobalStatesStore>> = create((set) => ({
  userActive:{clicked:false,manySelect:false},
  activeIcons:[] as string[],
  somethingIsDrag:false,
  activatedSelection:null as SelectionRect,

  changeUserActivity:(key:keyof GlobalStatesStore['userActive']) => set((state:GlobalStatesStore) => {
      return ({
        userActive:{
          ...state.userActive,
          [key]:state.userActive[key] || true
        }
      });
  }),

  addActiveIcon:(icon:string) => set((state:GlobalStatesStore) => {
    const newActiveIcons = [...state.activeIcons];
    
    if(!newActiveIcons.includes(icon)) {
      newActiveIcons.push(icon);
    }

    return ({
      activeIcons:newActiveIcons
    });
  }),

  removeActiveIcon:(icon:string) => set((state:GlobalStatesStore) => {
    const newActiveIcons = [...state.activeIcons];
    const iconIndex = newActiveIcons.findIndex(currentIcon => currentIcon === icon);
    
    if(iconIndex >= 0) { 
      newActiveIcons.splice(iconIndex,1);
    }
    
    return ({
      activeIcons:newActiveIcons
    });
  }),

  clearActiveIcons:() => set(() => ({
    activeIcons:[]
  })),

  setElementIsDrag:() => set((state:GlobalStatesStore) => ({
    somethingIsDrag:!state.somethingIsDrag
  })),

  activateSelection:(selectionRect:DOMRect) => set(() => ({
    activatedSelection:selectionRect
  })),

  deactivateSelection:() => set(() => ({
    activatedSelection:null
  })),
}));

export default useGlobalStatesStore;