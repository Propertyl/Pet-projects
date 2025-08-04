import { _2dCoords_, GlobalStatesStore, SelectionRect } from "@/types/valueTypes";
import { create, StoreApi, UseBoundStore } from "zustand";

const useGlobalStatesStore:UseBoundStore<StoreApi<GlobalStatesStore>> = create((set) => ({
  userActive:{clicked:false,manySelect:false},
  somethingIsDrag:false,
  isContextMenuSpawned:false,
  contextMenuPos:{x:0,y:0},
  activatedSelection:null as SelectionRect,

  changeUserActivity:(key) => set((state:GlobalStatesStore) => {
      return ({
        userActive:{
          ...state.userActive,
          [key]:state.userActive[key] || true
        }
      });
  }),

  setElementIsDrag:() => set((state:GlobalStatesStore) => ({
    somethingIsDrag:!state.somethingIsDrag
  })),

  setContextMenuSpawn:(value) => set(() => ({
    isContextMenuSpawned:value
  })),

  changeContextMenuPos:(pos:_2dCoords_) => set(() => ({
    contextMenuPos:pos
  })),

  activateSelection:(selectionRect:DOMRect) => set(() => ({
    activatedSelection:selectionRect
  })),

  deactivateSelection:() => set(() => ({
    activatedSelection:null
  })),
}));

export default useGlobalStatesStore;