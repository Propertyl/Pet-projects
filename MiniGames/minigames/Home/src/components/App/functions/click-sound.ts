import clickSound from '../../../assets/sounds/mouse-click.mp3';
const playClickSound = () => {
  const sound = new Audio(clickSound);

  return () => {
    if(sound.currentTime > 0) {
      sound.currentTime = 0;
    }

    sound.play();
  }
} 
 
export default playClickSound;