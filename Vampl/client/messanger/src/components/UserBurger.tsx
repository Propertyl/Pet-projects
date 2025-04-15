import { useSelector } from "react-redux";
import { Store } from "../types/global";
import './styles/userBurger.css';

const UserBurger = () => {
  const isOpen = useSelector((state:Store) => state.stuff.burgerOpen);
  const user = useSelector((state:Store) => state.stuff.userInBurger)

  return (
    <section className={`user-burger-menu ${isOpen ? 'appear' : 'disappear'}`}>
    <div className="container">
       {user}
    </div>
  </section>
  )
}

export default UserBurger;