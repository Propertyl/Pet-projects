import parseMessageTime from "../../components/Chat/functions/parseMessageTime";
import useFormatter from "../../components/global-functions/dateFormatter";

describe('Testing time',() => {
  const date = new Date;
  const formatter = useFormatter();
  const currentFormattedTime = formatter.format(date);

  it('Should normal convert to 12 hours time',() => {
    const [hours,minutes,sec] = date.toLocaleTimeString().split(':');
    const [_,dayPart] = sec.split(' ');

    expect(parseMessageTime('en',currentFormattedTime)).toBe(`${hours.padStart(2,'0')}:${minutes} ${dayPart}`);
  });

  it('Should normal convert to 24 hours time',() => {
    const [_,time] = currentFormattedTime.split(',');
    const timeArr = time.split(':');
    timeArr.pop();

    expect(parseMessageTime('ua',currentFormattedTime)).toBe(`${timeArr.join(':')}`);
  });

});



