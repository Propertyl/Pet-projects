function genChatID() {
  let id = "";
  for(let i = 0; i < 6; i++) {
    const symbol = String.fromCharCode(Math.floor(Math.random() * (91 - 65)) + 65);
    id += symbol;
  }
  return `chat-${id}`;
}

export default genChatID;

  