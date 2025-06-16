import landmarkDescriptionStyles from '../css/landmarkDescription.module.css'
import userIcon from '../assets/userIcon.svg';
import likeFull from '../assets/like-full.svg';
import likeOutlined from '../assets/like-outlined.svg';
import dislikeFull from '../assets/dislike-full.svg';
import dislikeOutlined from '../assets/dislike-outlined.svg';
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handler } from 'leaflet';


function LandmarkDescription({landmark, closeDescriptionModal}) {

    const { role, user, isLoggedIn, fetchAllLandmarks, landmarks } = useAuth();
    const currentLandmark = landmarks.find(l => l.id === landmark.id);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [userInteraction, setUserInteraction] = useState(null);
    const [currentLikes, setCurrentLikes] = useState(null);
    const [currentDislikes, setCurrentDislikes] = useState(null);

    const setReaction = (reaction) => {
        if (userInteraction == "like" && reaction == null) {
            setCurrentLikes(currentLikes - 1);
        } else if (userInteraction == null && reaction == "like") {
            setCurrentLikes(currentLikes + 1);
        } else if (userInteraction == "dislike" && reaction == null) {
            setCurrentDislikes(currentDislikes - 1);
        } else if (userInteraction == null && reaction == "dislike") {
            setCurrentDislikes(currentDislikes + 1);
        } else if (userInteraction == "dislike" && reaction == "like") {
            setCurrentLikes(currentLikes + 1);
            setCurrentDislikes(currentDislikes - 1);
        } else if (userInteraction == "like" && reaction == "dislike") {
            setCurrentLikes(currentLikes - 1);
            setCurrentDislikes(currentDislikes + 1);
        }
        setUserInteraction(reaction);
    };



    const handleReactionSubmit = async (reaction) => {
        const previousReaction = userInteraction;
        setIsSubmitting(true);

        const requestData = {
            reaction: reaction,
            landmark_id: currentLandmark.id
        };

        try {
            const response = await fetch("https://damko13.pythonanywhere.com/reaction", {
              method: "POST",
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
          
              setReaction(reaction);
              await fetchAllLandmarks();


        } catch (error) {
            if (['Token is missing!', 'Token has expired!', 'Invalid token!'].includes(error.message)) {
                navigate("/signin");
                return;
            } else {
                alert("An unexpected error occoured, please try again later!");
                setReaction(previousReaction);
            }


        } finally {
            setIsSubmitting(false);
        }


    }




    useEffect(() => {
        setReaction(currentLandmark.userReaction);
        setCurrentLikes(currentLandmark.likes);
        setCurrentDislikes(currentLandmark.dislikes)
    }, [currentLandmark])


    const handleCommentChange = (e) => {
        setComment(e.target.value);
    }

    function formatDate(dateString) {
        const [date] = dateString.split('T');
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }


    const handleSubmit = async () => {

        if (!isLoggedIn) {
            navigate('/signin', { replace: true });
            return;
          }

        const text = comment;
        const user_id = user.id;
        const landmark_id = currentLandmark.id;

        const requestData = {
            text: text,
            user_id: user_id,
            landmark_id: landmark_id
        };
        try {
            const response = await fetch("https://damko13.pythonanywhere.com/comment", {
              method: "POST",
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



        } catch (error) {
            if (['Token is missing!', 'Token has expired!', 'Invalid token!'].includes(error.message)) {
                navigate("/signin");
                return;
            } else {
                alert("An unexpected error occoured, please try again later!");
            }
        } finally {
            setComment("");
            fetchAllLandmarks();
        }
    }



    const handleCommentDelete = async (comment_id) => {
        if (role != "admin") {
            alert("Only an admin may do that you moron!");
            return;
          }


        try {

            const requestData = {
                comment_id: comment_id
            }

            const response = await fetch("https://damko13.pythonanywhere.com/delete_comment", {
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
            fetchAllLandmarks();
        }
    }

    const handleLandmarkDelete = async (landmark_id) => {
        if (role != "admin") {
            alert("Only an admin may do that you moron!");
            return;
          }


        try {

            const requestData = {
                landmark_id: landmark_id
            }

            const response = await fetch("https://damko13.pythonanywhere.com/delete_landmark", {
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
            fetchAllLandmarks();
            closeDescriptionModal();
        }
    }








    return(
        <>
            <div className={landmarkDescriptionStyles['modal-main-div']}>
                <div className={landmarkDescriptionStyles['left-subdiv']}>
                    <h2>{currentLandmark.name}</h2>
                    <img src={currentLandmark.image} alt={currentLandmark.name} className={landmarkDescriptionStyles['modal-image']}/>
                    <p className={landmarkDescriptionStyles['modal-description']}>{currentLandmark.description}</p>
                </div>

                <div className={landmarkDescriptionStyles['right-subdiv']}>
                    {currentLandmark.comments.length > 0 ? (
                        currentLandmark.comments.map((comment) => (
                        <div className={landmarkDescriptionStyles['comment-div']} key={comment.id}>
                            {role === "admin" ? (<button className={landmarkDescriptionStyles['delete-comment-button']} onClick={() => {handleCommentDelete(comment.id)}}>×</button>) : null}
                            
                            <div className={landmarkDescriptionStyles['comment-head-div']}>
                                <img className={comment.profile_picture ? landmarkDescriptionStyles['user-icon'] : landmarkDescriptionStyles['default-icon']} src={comment.profile_picture || userIcon} alt="" />
                                <p className={landmarkDescriptionStyles['comment-username']}>{comment.username}</p>
                                <p className={landmarkDescriptionStyles['comment-date']}>{formatDate(comment.date_of_creation)}</p>
                            </div>
                            <p className={landmarkDescriptionStyles['comment-text']}>{comment.text}</p>
                        </div>                     
                    ))) : (<p>No comments yet, be the first one to comment!</p>)}
                </div>
                <div className={landmarkDescriptionStyles['input-div']}>
                    <input className={landmarkDescriptionStyles['input']} onChange={handleCommentChange} value={comment} type="text" placeholder='Comment' />
                    <button className={landmarkDescriptionStyles['input-button']} onClick={handleSubmit} disabled={comment.trim() === ""}>Submit</button>
                </div>




                
                <button className={landmarkDescriptionStyles['close-button']} onClick={closeDescriptionModal}>×</button>

                <div className={landmarkDescriptionStyles['reaction-div']}>

                    {userInteraction === 'like' ? (
                        <button className={landmarkDescriptionStyles['reaction-button']} disabled={isSubmitting} onClick = {() => {handleReactionSubmit(null);}}><img draggable="false" src={likeFull} alt="no like button" className={landmarkDescriptionStyles['reaction-icon']} /></button>
                    ) : (
                        <button className={landmarkDescriptionStyles['reaction-button']} disabled={isSubmitting} onClick = {() => {handleReactionSubmit('like');}}><img draggable="false" src={likeOutlined} alt="no like button" className={landmarkDescriptionStyles['reaction-icon']} /></button>
                    )}

                    <p className={landmarkDescriptionStyles['reaction-amount']}>{currentLikes}</p>

                    {userInteraction === 'dislike' ? (
                        <button className={landmarkDescriptionStyles['reaction-button']} disabled={isSubmitting} onClick = {() => {handleReactionSubmit(null);}}><img draggable="false" src={dislikeFull} alt="no like button" className={landmarkDescriptionStyles['reaction-icon']} /></button>
                    ) : (
                        <button className={landmarkDescriptionStyles['reaction-button']} disabled={isSubmitting} onClick = {() => {handleReactionSubmit('dislike');}}><img draggable="false" src={dislikeOutlined} alt="no like button" className={landmarkDescriptionStyles['reaction-icon']} /></button>
                    )}

                    <p className={landmarkDescriptionStyles['reaction-amount']}>{currentDislikes}</p>
                    {role === "admin" ? (<button className={landmarkDescriptionStyles['delete-button']} onClick={() => {handleLandmarkDelete(currentLandmark.id)}}>DELETE LANDMARK</button>) : null}
                </div>
            </div>
            <div className={landmarkDescriptionStyles['description-overlay']}></div>
        </>
    );
}

export default LandmarkDescription;