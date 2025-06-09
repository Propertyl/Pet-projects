const useFormatter = () => {
  return Intl.DateTimeFormat('en-US',{
    day:'2-digit',
    month:'2-digit',
    year:'numeric',
    hour:'2-digit',
    minute:'2-digit',
    second:'2-digit',
    hour12:false
  });
}

export default useFormatter;