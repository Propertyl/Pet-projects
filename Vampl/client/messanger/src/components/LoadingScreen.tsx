import './styles/loading.css';


const LoadingScreen = () => {
  return (
    <div className="loading-screen container">
        <div className='loading-circle'>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
        </div>
        <p className='loading-text'>Check your access</p>
    </div>
  )
}

export default LoadingScreen;