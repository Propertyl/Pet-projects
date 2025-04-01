const changeTheme = (theme:string) => {
  const html = document.getElementById('root');

  if(html) {
    html.className = theme;
  }
}

export default changeTheme;