import { Outlet } from "react-router-dom";
import './App.scss';

const App = () => {
  return (
    <>
    <div>This is spy game!</div>
    <Outlet/>
    </>
  );
}
 
export default App;