import BgEyes from '@/components/Bg-Eyes/Bg-Eyes';
import './Home.scss';
import WindowGrid from '@/components/Window-grid/Window-grid';

const Home = () => {
  return ( 
    <>
      <main className='window-main'>
        <WindowGrid/>
        <BgEyes/>
      </main>
    </>
   );
}
 
export default Home;