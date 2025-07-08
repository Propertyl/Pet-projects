const changeHTMLlang = () => {
  document.documentElement.lang = navigator.language.split('-')[0];
}

export default changeHTMLlang;