const parseMessageTime = (lang:string,time:string) => {
  if(!time.length) return "";
  const [_,timer] = time.split(',');
  const [hours,minutes] = timer.split(':');
  const dayPart = Number(hours) >= 12 ? 'PM' : 'AM';
  const convertedHours = String(Number(hours) % 12 || 12);

  return lang === 'en' ? `${convertedHours.padStart(2,'0')}:${minutes.padStart(2,'0')} ${dayPart}` : `${hours}:${minutes}`;
}

export default parseMessageTime;