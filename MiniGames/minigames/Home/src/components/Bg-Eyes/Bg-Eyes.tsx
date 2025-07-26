import { _2dCoords_, GlobalStatesStore } from '@/types/valueTypes';
import './Bg-Eyes.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import useGlobalStatesStore from '@/stores/globalStates';
import { ScreenEntity } from './functions/ScreenEntity';
import { RefObj } from '@/types/cutTypes';

const BgEyes = () => {
  const [eyePos, setEyePos] = useState<_2dCoords_>({x:0,y:0});
  const [eyeText, setEyeText] = useState<string>('');
  const userActivity = useGlobalStatesStore((state:GlobalStatesStore) => state.userActive);
  const screenEntity:RefObj<ScreenEntity> = useRef(null);

  useEffect(() => {
    if(!screenEntity.current) {
      screenEntity.current = new ScreenEntity(setEyePos,setEyeText);
    }
  },[]);

  useEffect(() => {
      const calcEyesPos = screenEntity.current.calcMousePercentPos;

      document.addEventListener('mousemove',calcEyesPos);

      return () => {
        document.removeEventListener('mousemove',calcEyesPos);
      }
  },[]);

  useMemo(() => {
    if(screenEntity.current) {
      if(userActivity.clicked) {
        screenEntity.current.speak("What do you want to play, mortal?");
      }
    
      if(userActivity.manySelect) {
        screenEntity.current.speak("Why do you need this?");
      }
    }
  },[userActivity,screenEntity]);  

  return (
    <>
      <div className="eyes-container">
        { Array.from({length:2},(_,i) => (
          <div key={`bg-eye-${i}`} className="bg-eye">
            <div style={{top:`${eyePos.y}%`,left:`${eyePos.x}%`}} className="eye-pupil"></div>
          </div>
        ))
        }
        <div className="eyes-phrase-container">
          <p className='eyes-phrase'>{eyeText}</p>
        </div>
      </div>
    </>
  );
}
 
export default BgEyes;