const textChanger = (uaText:string,enText:string) => {
  return ['ua','uk','ru'].includes(navigator.language) ? uaText : enText;
}

export default textChanger;