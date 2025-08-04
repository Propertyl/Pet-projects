import spyIcon from './assets/spy-icon.png';
import gardenIcon from './assets/garden-icon.png';
import { SpyRoutes } from './routes/SpyRoute';

const allGames = [
  {
    icon:spyIcon,name:'Spy-Game.exe',link:SpyRoutes.main
  },
  {
    icon:gardenIcon,name:'Garden-Game.exe',link:'/garden'
  }
];

export {defineRootProperties} from "./functions/globalFunctions";
export { allGames };
export { LoadingScreen } from './components/Loading/Loading';
