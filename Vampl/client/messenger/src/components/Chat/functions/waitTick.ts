const waitTick = async () => {
  return new Promise((r) => requestAnimationFrame(r));
}

export default waitTick;