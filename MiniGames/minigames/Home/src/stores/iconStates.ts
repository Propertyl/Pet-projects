import { _2dCoords_, IconsStatesStore } from "@/types/valueTypes";
import { create, StoreApi, UseBoundStore } from "zustand";

const useIconStatesStore:UseBoundStore<StoreApi<IconsStatesStore>> = create((set) => ({
  cellSize:0,
  clickedIcon:'',
  deletedIcons:[] as string[],
  activeIcons:[] as string[],
  iconsPosition:new Map() as Map<string,_2dCoords_>,

  setCellSize:(newSize) => set(() => ({
    cellSize:newSize
  })),

  addActiveIcon:(icon) => set((state:IconsStatesStore) => {
    const newActiveIcons = [...state.activeIcons];

    if(!newActiveIcons.includes(icon)) {
      newActiveIcons.push(icon);
    }

    return ({
      activeIcons:newActiveIcons
    });
  }),

  removeActiveIcon:(icon) => set((state:IconsStatesStore) => {
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

  addDeletedIcons:(icons) => set((state:IconsStatesStore) => {
    console.log('delete next icons:',icons);
    return ({
      deletedIcons:[...state.deletedIcons,...icons]
    })
  }),
  
  addClickedIcon:(icon) => set(() => {
    console.log('icon:',icon);
    return ({
      clickedIcon:icon
    })
  }),

  clearClickedIcon:() => set(() => ({
    clickedIcon:''
  })),

  clearDeletedIcons:() => set(() => ({
    deletedIcons:[]
  })),
  
  setIconPosition:(icon,pos) => set((state:IconsStatesStore) => {
    let newPositions = new Map(state.iconsPosition);
    newPositions.set(icon,pos);

    return ({
      iconsPosition:newPositions
    })
  }),
  
  deleteIconPosition:(icon) => set((state:IconsStatesStore) => {
    const newPositions = new Map(state.iconsPosition);
    newPositions.delete(icon);

    return ({
      iconsPosition:newPositions
    })
  })

}));


export default useIconStatesStore;