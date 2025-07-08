const EmptyChatBox = ({text}:{text:string}) => {
  return (
    <div className="chat-empty-chat-box">
      <div className="empty-chat-box-text-container flex-center">
        <div className="empty-chat-box-text">
          {text}
          <div className="empty-chat-box-dots-container">
              {Array.from({length:3},(_,i) => (
                <span key={`chat-box-dot-${i}`} className="empty-chat-box-text-dot"></span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default EmptyChatBox;