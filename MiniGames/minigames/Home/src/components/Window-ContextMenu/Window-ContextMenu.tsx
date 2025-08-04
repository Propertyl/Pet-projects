import './Window-ContextMenu.scss';
import {changeContextMenuSpawn } from "@/globals/global-selectors/user-selectors";
import useGlobalStatesStore from "@/stores/globalStates";
import { ContextMenuProps } from "@/types/elementProps";
import { useEffect, useRef, useState } from 'react';
import ContextMenuPositionFixer from './functions/ContextMenuPositionFixer';
import { _2dCoords_ } from '@/types/valueTypes';
import useIconStatesStore from '@/stores/iconStates';
import { clearActiveIcons, setClickedIcon, setDeletedIcons } from '@/globals/global-selectors/icons-selectors';

const ContextMenu = ({pos,activeIcons}:ContextMenuProps) => {
  const setContextMenuSpawn = useGlobalStatesStore(changeContextMenuSpawn);
  const addDeletedIcons = useIconStatesStore(setDeletedIcons);
  const addClickedIcon = useIconStatesStore(setClickedIcon);
  const setClearActiveIcons = useIconStatesStore(clearActiveIcons);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<_2dCoords_>(pos);

  useEffect(() => {
    const rect = menuRef.current.getBoundingClientRect();
    setMenuPos(position => ContextMenuPositionFixer(rect,position));
  },[]);

  return (
    <>
      <div ref={menuRef} style={{top:`${menuPos.y - 16}px`,left:`${menuPos.x - 16}px`}} className="window-context-menu">
        <div className="window-context-menu-actions">
          { activeIcons.map(icon => (
              <div key={`context-menu-option-${icon}`} onClick={() => addClickedIcon(icon)} className="context-menu-action">
                Open {icon}
              </div>
            ))
          }
          <div onClick={() => {
            const withoutTrashCan = activeIcons.filter(icon => icon !== 'Trash can');
            addDeletedIcons(withoutTrashCan);
            setClearActiveIcons();
            setContextMenuSpawn(false);
          }} className="context-menu-action">
            Delete
          </div>
        </div>
      </div>
    </>
  );
}
 
export default ContextMenu;