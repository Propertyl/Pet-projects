const unScrollDocument = () => {
  const rootElem = document.documentElement;
  rootElem.classList.add('hidden');
  
  return () => {
    rootElem.classList.remove('hidden');
  }
}
 
export default unScrollDocument;