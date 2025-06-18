const changeTheme = (theme:string) => {
  const html = document.getElementById('theme-root');

  if(html) {
    html.className = theme;
  }
}

export default changeTheme;