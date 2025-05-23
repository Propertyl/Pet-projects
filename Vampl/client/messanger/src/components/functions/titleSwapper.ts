const handleTitleSwap = () => {
    let timer:any = null;

    return function swap() {
      if(timer) clearTimeout(timer);
      if(document.visibilityState === 'hidden') {
        document.title = 'New Message';
        timer = setTimeout(() => {
          document.title = 'Vampl';
          setTimeout(swap,1000);
        },1000);
        return;
      }

      document.title = "Vampl";
      return;
    }
}

export const titleSwapper = handleTitleSwap();