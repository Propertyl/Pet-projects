import { allGames } from "@packages/shared";
import WindowIcon from "../Window-Icon/Window-Icon";
import './Window-grid.scss';
import { useEffect,useState } from "react";
import useIconStatesStore from "@/stores/iconStates";
import { getActiveIcons, getCellSize, getDeletedIcons } from "@/globals/global-selectors/icons-selectors";

const WindowGrid = () => {
  const activeIcons = useIconStatesStore(getActiveIcons);
  const deleteIcons = useIconStatesStore(getDeletedIcons);
  const cellSize = useIconStatesStore(getCellSize);
  const [screenIcons, setScreenIcons] = useState([...allGames,{icon:'',name:'Trash can',link:''}]);

  useEffect(() => {
    const getTrashCanIcon = async () => {
      let icon = deleteIcons.length 
      ? (await import('@/assets/icons/filled-trash-can.png')).default
      : (await import('@/assets/icons/trash-can.png')).default;

      setScreenIcons(screenIcons => screenIcons.map(screenIcon => {
        if(screenIcon.name === 'Trash can') {
          screenIcon.icon = icon;
        }

        return screenIcon;
      }));
    }

    getTrashCanIcon();
  },[deleteIcons]);

  useEffect(() => {
    if(deleteIcons.length) {
      setScreenIcons(screenIcons => screenIcons.filter(({name}) => !deleteIcons.includes(name)));
    }
  },[deleteIcons]);

  return (
    <>
      <div style={{gridTemplateColumns:`repeat(auto-fill,${cellSize}px)`,gridTemplateRows:`repeat(auto-fill,${cellSize}px)`}} className="window-icons-grid">
        {screenIcons.length && screenIcons
          .map(({icon,name,link},index) => {
            return (
              <WindowIcon key={`window-grid-icon-${name}`} icon={icon} name={name} link={link} iconId={index} active={activeIcons.includes(name)}/>
            )
          })
        }
      </div>
    </>
  );
}
 
export default WindowGrid;