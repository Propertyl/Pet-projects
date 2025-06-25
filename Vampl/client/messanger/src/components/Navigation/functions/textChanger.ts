const textChanger = (uaText:string,enText:string) => {
  return ['ua','uk'].includes(navigator.language) ? uaText : enText;
}

export default textChanger;