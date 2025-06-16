import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import accountPageStyles from '../css/accountPage.module.css'
import AvatarUploader from '../components/AvatarUploader.jsx'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../components/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';


function AccountPage () {
    const containerRef = useRef(null);
    const {user, landmarks, checkAuth} = useAuth();
    const navigate = useNavigate();

    const [nameInput, setNameInput] = useState('');
    const [surnameInput, setSurnameInput] = useState('');
    const maxLength = 30;


    const handleNameInputChange = (e) => {
        if (e.target.value.length <= maxLength) {
            setNameInput(e.target.value);
          }
    }

    const handleSurnameInputChange = (e) => {
        if (e.target.value.length <= maxLength) {
            setSurnameInput(e.target.value);
          }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        

        if (!nameInput.trim() && !surnameInput.trim()) return;
    
        try {

            const payload = {};
            if (nameInput.trim()) payload.name = nameInput.trim();
            if (surnameInput.trim()) payload.surname = surnameInput.trim();
    
            const response = await fetch("https://damko13.pythonanywhere.com/change_info", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData.message);
                return;
            }

            setNameInput('');
            setSurnameInput('');
            checkAuth();
    
        } catch (error) {
            console.error("Network error:", error.message);
        }
    }


    const handleLandmarkClick = (landmark) => {
        navigate('/', {
            state: {
                centerOnLandmark: landmark.id
            }
        });
    };


    useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);
    



    return(
        <div className={accountPageStyles['main-div']}>
            <Header/>
            <div className={accountPageStyles['main-content']}>
                <section className={accountPageStyles['user-data-section']}>
                    <AvatarUploader/>
                    <div className={accountPageStyles['personal-data-div']}>
                        <form onSubmit={handleFormSubmit}>
                            <label htmlFor="name-input" className={accountPageStyles['label']}>Here you can change your name</label>
                            <div className={accountPageStyles['input-field-div']}>
                                <input type="text" id='name-input' className={accountPageStyles['input-field']} value={nameInput} onChange={handleNameInputChange} placeholder={user.firstName ? user.firstName : "Name"}/>
                                <p className={accountPageStyles['counter']}>{nameInput.length}/{maxLength}</p>
                            </div>

                            <label htmlFor="surname-input" className={accountPageStyles['label']}>Here you can change your surname</label>
                            <div className={accountPageStyles['input-field-div']}>
                                <input type="text" id='surname-input' className={accountPageStyles['input-field']} value={surnameInput} onChange={handleSurnameInputChange} placeholder={user.lastName ? user.lastName : "Surname"}/>
                                <p className={accountPageStyles['counter']}>{surnameInput.length}/{maxLength}</p>
                            </div>
                            <input type='submit' className={accountPageStyles['submit-button']} id='submit-button' name='submit' value="Submit" />
                        </form>
                        
                    </div>
                </section>
                
                <section className={accountPageStyles['landmarks-section']}>
                    <p className={accountPageStyles['landmarks-section-p']}>Your landmarks</p>
                    <div className={accountPageStyles['landmarks-main-div']} ref={containerRef}>
                        
                        {landmarks.filter(landmark => landmark.user_id === user.id).map((landmark) => (
                            <div key={landmark.id} className={accountPageStyles['landmark-div']} onClick={() => handleLandmarkClick(landmark)}>
                            <img src={landmark.image} alt="" className={accountPageStyles['landmark-img']}/>
                            <p className={accountPageStyles['landmark-p']}>{landmark.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        
            <Footer/>
        </div>
    )
}

export default AccountPage;