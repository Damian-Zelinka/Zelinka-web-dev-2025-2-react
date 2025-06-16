import { useState } from "react";
import { Link } from 'react-router-dom';
import signUpStyles from '../css/signUp.module.css';


function SignUpForm() {

    const [emailFocused, setEmailFocused] = useState(false);
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordConfirmFocused, setPasswordConfirmFocused] = useState(false);
    const [errorMessage, setErrorMessage] = useState(" ");

    const [emailInput, setEmailInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    



    const handleSignUpSubmit = (event) => {
        event.preventDefault();

        const password = event.target.elements["input-password"];
        const passwordConfirm = event.target.elements["input-password-confirm"];

        if (password.value !== passwordConfirm.value) {
            setErrorMessage("Passwords do not match");
            password.classList.add('error-input');
            passwordConfirm.classList.add('error-input');
            event.preventDefault();
            return;
        } else {
            setErrorMessage(" ");
            password.classList.remove('error-input');
            passwordConfirm.classList.remove('error-input');
        }  


        const formData = new FormData();
        formData.append("email", emailInput);
        formData.append("password", passwordInput);
        formData.append("username", usernameInput);

        fetch("https://damko13.pythonanywhere.com/register", {
            method: "POST",
            body: formData, 
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || "An error occurred");
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                setErrorMessage(data.error);
            } else {
                setErrorMessage(data.message);
                console.log("Success:", data);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            setErrorMessage(error.message || "An unexpected error occurred");
        });


    };


const handleUsernameChange = (e) => {
    setUsernameInput(e.target.value);
}

const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
}

const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
}






    return(
        <main className={signUpStyles['main']}>
            <Link to='/' className={signUpStyles['FYP']}>Mystic Map</Link>
            <div className={signUpStyles['sign-up-flexbox']}>
                <h1 className={signUpStyles['sign-up-h1']}>Create an account</h1>
                <p className={signUpStyles['enter-email-p']}>Enter your email to sign up for this app</p>

                <form onSubmit={handleSignUpSubmit} id='sign-up-form'>
                    <div className={signUpStyles['email-flexbox']}>
                        <div className={signUpStyles['floating-label']}>
                            <input type="text" name="username" onChange={handleUsernameChange} value={usernameInput} className={signUpStyles['input-email-password']} id="input-username" placeholder=" " required
                                onFocus={() => setUsernameFocused(true)}
                                onBlur={(e) => setUsernameFocused(e.target.value !== "")} />
                            <label className={usernameFocused ? signUpStyles.focused : ""} htmlFor="input-username">Username</label>
                        </div>
                        <div className={signUpStyles['floating-label']}>
                            <input type="email" name="email" onChange={handleEmailChange} value={emailInput} className={signUpStyles['input-email-password']} id="input-email" placeholder=" " required
                                onFocus={() => setEmailFocused(true)}
                                onBlur={(e) => setEmailFocused(e.target.value !== "")} />
                            <label className={emailFocused ? signUpStyles.focused : ""} htmlFor="input-email">Email</label>
                        </div>
                        <div className={signUpStyles['floating-label']}>
                            <input type="password" name="password" onChange={handlePasswordChange} value={passwordInput} className={signUpStyles['input-email-password']} id="input-password" placeholder=" " required
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={(e) => setPasswordFocused(e.target.value !== "")} />
                            <label className={passwordFocused ? signUpStyles.focused : ""} htmlFor="input-password">Password</label>
                        </div>
                        <div className={signUpStyles['floating-label']}>
                            <input type="password" name="user-password-confirm" className={signUpStyles['input-email-password']} id="input-password-confirm" placeholder=" " required
                                onFocus={() => setPasswordConfirmFocused(true)}
                                onBlur={(e) => setPasswordConfirmFocused(e.target.value !== "")} />
                            <label className={passwordConfirmFocused ? signUpStyles.focused : ""} htmlFor="input-password-confirm">Confirm password</label>
                        </div>
                        <input className={signUpStyles['form-btn']} type="submit" value="Sign in with email" />
                    </div>
                </form>

                {errorMessage && (
                    <p style={{ color: "rgba(207, 127, 135, 1)", marginTop: "20px", marginBottom: "20px", alignSelf: 'center'}}>{errorMessage}</p>
                )}

                <div className={signUpStyles['sign-in-link-div']}>
                    <Link to='/signin' className={signUpStyles['sign-in-link']}>Already have an account? Click here to sign in!</Link>
                </div>
            </div>
        </main>

        
    );
};

export default SignUpForm;