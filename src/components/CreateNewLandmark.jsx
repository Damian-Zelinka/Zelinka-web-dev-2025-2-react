import { useState } from 'react';
import newLandmarkStyles from '../css/createNewLandmark.module.css';
import { useAuth } from './AuthContext.jsx';


function CreateNewLandmark ({lat, lng, closeModal, clearMarker}) {

    const { user, fetchAllLandmarks } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");


    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    
    const handleModalClose = () => {
        closeModal();
        setName("");
        setDescription("");
        setImage("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("likes", 0);
        formData.append("latitude", lat);
        formData.append("longitude", lng);
        formData.append("user_id", user.id);
        formData.append("image", image);

        const response = await fetch("https://damko13.pythonanywhere.com/newlandmark", {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message);
            return false;
          }


        fetchAllLandmarks();

        handleModalClose();
        clearMarker();
    }


    return(
        <>
            <div className={newLandmarkStyles['new-landmark-main-div']}>
                <div className={newLandmarkStyles['input-div']}>
                    <label htmlFor="landmark-name" className={newLandmarkStyles['input-label']}>Landmark name</label>
                    <input type="text" id='landmark-name' placeholder='Some castle or something' className={newLandmarkStyles['input']} value={name} onChange={handleNameChange} required/>
                </div>

                <div className={newLandmarkStyles['input-div']}>
                    <label htmlFor="landmark-description" className={newLandmarkStyles['input-label']}>Landmark description</label>
                    <textarea id='landmark-description' name='landmark_description' placeholder='Describe your castle' className={newLandmarkStyles['input-area']} value={description} onChange={handleDescriptionChange} required></textarea>
                </div>

                <div className={newLandmarkStyles['input-div']}>
                    <label htmlFor="landmark-image" className={newLandmarkStyles['input-label']}>Landmark image</label>
                    <label htmlFor="landmark-image" className={newLandmarkStyles['file-input-special-label']}>{image ? (<p className={newLandmarkStyles['selected-text']}>Uploaded: {image.name}</p>) : (<p className={newLandmarkStyles['file-input-special-label-p']}>Click here to upload</p>)}</label>
                    <input type="file" id='landmark-image' placeholder='Dunno' className={newLandmarkStyles['file-input']} onChange={handleImageChange} required/>
                </div>
                <button className={newLandmarkStyles['close-button']} onClick={handleModalClose}>×</button>
                <button className={newLandmarkStyles['submit-button']} onClick={handleSubmit}>Create your landmark</button>
            </div>
            <div className={newLandmarkStyles['overlay']}></div>
        </>
    )
}


export default CreateNewLandmark