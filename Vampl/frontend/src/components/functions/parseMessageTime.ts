const parseMessageTime = (time:string) => {
  if(!time.length) return "";

  const [_,timer] = time.split(',');
  const [hours,minutes] = timer.split(':');

  return `${hours}:${minutes}`;
}

export default parseMessageTime;