
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../components/AuthContext.jsx";
import userStyles from "../css/users.module.css"
import userIcon from '../assets/userIcon.svg';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

function Users () {

    const { role, fetchAllLandmarks } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {

        try{
            const response = await fetch("https://damko13.pythonanywhere.com/users", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }
            const data = await response.json();

            setUsers(data.users);



        } catch(error) {
            if (['Token is missing!', 'Token has expired!', 'Invalid token!'].includes(error.message)) {
                navigate("/signin");
                return;
            } else {
                alert("An unexpected error occoured, please try again later!");
            }
        }
    } 


    const handleUserDelete = async (user_id) => {
        if (role != "admin") {
            alert("Only an admin may do that you moron!");
            return;
          }


        try {

            const requestData = {
                user_id: user_id
            }

            const response = await fetch("https://damko13.pythonanywhere.com/delete_user", {
                method: "DELETE",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
              }


        } catch(error) {
            if (['Token is missing!', 'Token has expired!', 'Invalid token!'].includes(error.message)) {
                navigate("/signin");
                return;
            } else {
                alert("An unexpected error occoured, please try again later!");
            }
        } finally {
            fetchUsers();
            fetchAllLandmarks();
        }
    }








    useEffect(() => {
        fetchUsers();
    }, [])


    return(
        <>
        <Header/>
        <div className={userStyles['main-div']}>
            <div className={userStyles['all-users-div']}>
                {users.map((user) => (
                    <div className={userStyles['user-div']} key={user.id}>
                        <img className={userStyles['user-icon']} src={user.profile_picture || userIcon} alt="" />
                        <p className={userStyles['user-email']}>{user.email}</p>
                        <button className={userStyles['delete-button']} onClick={() => {handleUserDelete(user.id)}}>X</button>
                    </div>
                                    
                ))}
            </div>
        </div>
        <Footer/>
        </>
    )


}
export default Users;