import { allGames } from "@packages/shared";
import WindowIcon from "../Window-Icon/Window-Icon";
import './Window-grid.scss';
import useGlobalStatesStore from "@/stores/globalStates";
import { getActiveIcons } from "@/globals/global-selectors/user-selectors";

const WindowGrid = () => {
   const activeIcons = useGlobalStatesStore(getActiveIcons);

  return (
    <>
      <div className="window-icons-grid">
        { allGames.map(({icon,name,link},index) => (
            <WindowIcon key={`window-grid-icon-${index}`} icon={icon} name={name} link={link} iconId={index} active={activeIcons.includes(name)}/>
          ))
        }
      </div>
    </>
  );
}
 
export default WindowGrid;