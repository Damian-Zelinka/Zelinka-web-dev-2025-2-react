import headerStyles from '../css/header.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx";



function Header() {

    const { user, role, isLoggedIn, logout } = useAuth();

    


    return(
        <div className={headerStyles['main-div']}>
            <Link to="/" className={headerStyles['logo']} draggable="false">Mystic Map</Link>
            {role === "admin" ? (<Link to="/users" className={headerStyles['header-button']} draggable="false">Users</Link>) : null}
            {isLoggedIn ? (<>
                <Link to="/account" className={headerStyles['header-button']} draggable="false">Account</Link>
                <button onClick={logout} className={headerStyles['header-button']} draggable="false">Log out</button>
                </>) : (<>
                <Link to="/signup" className={headerStyles['header-button']} draggable="false">Sign up</Link>
                <Link to="/signin" className={headerStyles['header-button']} draggable="false">Sign in</Link>
            </>)}
            {isLoggedIn && user?.profile_picture ? (<img src={user.profile_picture} className={headerStyles['profile-picture']} alt="profile pic"/>) : null}
        </div>
    )
}   

export default Header