import { setDispatch } from '@/types/cutTypes';
import talk from '../../../assets/sounds/eye_talk.mp3';
import { _2dCoords_ } from '@/types/valueTypes';

export class ScreenEntity {
  setEyePos;
  setEntityText;
  private interval:NodeJS.Timeout;

  constructor(setEyePos:setDispatch<_2dCoords_>,setEntityText:setDispatch<string>) {
    this.setEyePos = setEyePos;
    this.setEntityText = setEntityText;
  }

  calcMousePercentPos = (event:MouseEvent) => {
    const eyeWidth = (window.innerWidth * 0.4) * 0.3;
    const eyeHeight = (window.innerHeight * 0.5);
    const horizontal = ((event.clientX - eyeWidth) / window.innerWidth) * 100;
    const vertical = ((event.clientY - eyeHeight) / window.innerHeight) * 100;

    this.setEyePos({x:horizontal,y:vertical});
  }

  *phraseGen(phrase:string) {
    const bipSound = new Audio(talk);
    let skippedTurns = 0;

    const punctuationDelay = (symbol:string) => {
      return /[;.]/g.test(symbol) ? 10 : 5;
    }
  
    for(let i = 0; i < phrase.length; i++) {
      if(skippedTurns === 0) {
        const phraseSymbol = phrase[i];

        if(/[,.]/g.test(phraseSymbol)) {
          skippedTurns = punctuationDelay(phraseSymbol);
          yield phraseSymbol;
          continue;
        }

        bipSound.currentTime = 0;
        bipSound.play();
        yield phrase[i];

      } else {
        skippedTurns--;
        i--;
        yield '';
      }

    }

    return;
  }


  speak = (phrase:string) => {

    if(this.interval) {
      clearInterval(this.interval);
    }

    this.setEntityText('');
    const symbolsGen = this.phraseGen(phrase);
    const __DELAY__ = 75;
    this.interval = setInterval(() => {
      const {value,done} = symbolsGen.next();

      if(done) {
        clearInterval(this.interval);
        return;
      }

      if(value) {
        this.setEntityText((text:string) => text + value);
      }

    },__DELAY__);
    
  }
}
