import BgEyes from '@/components/Bg-Eyes/Bg-Eyes';
import './Home.scss';
import WindowGrid from '@/components/Window-grid/Window-grid';
import { useEffect, useRef, useState } from 'react';
import useGlobalStatesStore from '@/stores/globalStates';
import { changeContextMenuSpawn, deleteActiveSelection,  getChangeUserActivity, getDragAnswer,contextMenuSpawned,setActiveSelection, getContextMenuPos, changeContextMenuPos } from '@/globals/global-selectors/user-selectors';
import { _2dCoords_, selectionPoints } from '@/types/valueTypes';
import { UserSelection } from '@/components/App/functions/window-selection';
import playClickSound from '@/components/App/functions/click-sound';
import ContextMenu from '@/components/Window-ContextMenu/Window-ContextMenu';
import { clearActiveIcons, getActiveIcons } from '@/globals/global-selectors/icons-selectors';
import useIconStatesStore from '@/stores/iconStates';

const playSound = playClickSound();

const Home = () => {
  const [spawnSelection, setSpawnSelection] = useState(false);
  const changeUserState = useGlobalStatesStore(getChangeUserActivity);
  const somethingIsDrag = useGlobalStatesStore(getDragAnswer);
  const isContextMenuSpawned = useGlobalStatesStore(contextMenuSpawned);
  const contextMenuPos = useGlobalStatesStore(getContextMenuPos);
  const setContextMenuPos = useGlobalStatesStore(changeContextMenuPos);
  const setContextMenuSpawn = useGlobalStatesStore(changeContextMenuSpawn);
  const setActivatedSelection = useGlobalStatesStore(setActiveSelection);
  const setClearSelection = useGlobalStatesStore(deleteActiveSelection);
  const activeIcons = useIconStatesStore(getActiveIcons);
  const setClearActiveIcons = useIconStatesStore(clearActiveIcons);
  const [{startPoint,endPoint},setPoints] = useState<selectionPoints>({
    startPoint:{x:0,y:0},
    endPoint:{x:0,y:0}
  });
  const userSelectionRef = useRef<UserSelection | null>(null);
  const mainRef = useRef(null);

  useEffect(() => {
    if(!userSelectionRef.current) {
      userSelectionRef.current = new UserSelection(
        setSpawnSelection,
        setPoints,
        changeUserState,
        setActivatedSelection,
        setClearSelection,
        setContextMenuSpawn,
        setContextMenuPos,
        setClearActiveIcons
      );
    }
  },[]);

  useEffect(() => {
    const userSelection = userSelectionRef.current;
    const mainElem = mainRef.current;

    document.addEventListener('dblclick',playSound);
    
    if(userSelectionRef.current) {
      mainElem.addEventListener('mouseup',userSelection.endSelection);
      mainElem.addEventListener('mousedown',userSelection.startSelection);
    }

    return () => {
      document.removeEventListener('dblclick',playClickSound);

      if(userSelectionRef.current) {
        mainElem.removeEventListener('mousedown',userSelection.startSelection);
        mainElem.removeEventListener('mouseup',userSelection.endSelection);
      } 
    }

  },[userSelectionRef,isContextMenuSpawned,spawnSelection]);

  useEffect(() => {
    if(somethingIsDrag) {
      userSelectionRef.current.endSelection();
    }
  },[somethingIsDrag]);

  useEffect(() => {
    const userSelection = userSelectionRef.current;

    if(spawnSelection) {
      document.addEventListener('mousemove',userSelection.moveSelection);
    } else {
      document.removeEventListener('mousemove',userSelection.moveSelection);
    }

  },[spawnSelection]);

  return ( 
    <>
      { isContextMenuSpawned && activeIcons.length > 0 &&
        <span tabIndex={0} autoFocus onMouseLeave={() => {
          setContextMenuSpawn(false);
          if(activeIcons.length) {
            setClearActiveIcons();
          }
        }}>
          <ContextMenu pos={contextMenuPos} activeIcons={activeIcons}/>
        </span>
      }
      { spawnSelection && 
          <div style={{
            top:startPoint.y,
            left:startPoint.x,
            width:userSelectionRef.current.calculateSize(startPoint.x,endPoint.x),
            height:userSelectionRef.current.calculateSize(startPoint.y,endPoint.y),
          }} className="user-selection"></div>
      }
      <main ref={mainRef} className='window-main'>
        <WindowGrid/>
        <BgEyes/>
      </main>
    </>
   );
}
 
export default Home;