import signInStyles from '../css/signIn.module.css';

import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Import the useAuth hook


function SignInForm() {

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [errorMessage, setErrorMessage] = useState(" ");

    const [passwordInput, setPasswordInput] = useState("");
    const [emailInput, setEmailInput] = useState("");

    const { login } = useAuth();

    const handlePasswordChange = (e) => {
        setPasswordInput(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmailInput(e.target.value);
    }
      

    const handleSignInSubmit = (event) => {
        event.preventDefault();

        const requestData = {
            email: emailInput,
            password: passwordInput
        };

        login(requestData)
            .then((data) => {
                setErrorMessage(data.message);
            })
            .catch((error) => {
                setErrorMessage(error.message || "An unexpected error occurred");
                console.error("Login failed:", error);
            });
    };






    return(
        <main className={signInStyles['main']}>
            <Link to='/' className={signInStyles['FYP']}>Mystic Map</Link>
            <div className={signInStyles['sign-in-flexbox']}>
                <h1 className={signInStyles['sign-in-h1']}>Log in to your account</h1>
                <p className={signInStyles['enter-email-p']}>Enter your email and password</p>
                <form onSubmit={handleSignInSubmit} method="post">
                    <div className={signInStyles['email-flexbox']}>
                        <div className={signInStyles['floating-label']}>
                            <input type="email" name="email" onChange={handleEmailChange} value={emailInput} className={signInStyles['input-email-password']} id="input-email" placeholder=" " required
                                onFocus={() => setEmailFocused(true)}
                                onBlur={(e) => setEmailFocused(e.target.value !== "")} />
                            <label className={emailFocused ? signInStyles.focused : ""} htmlFor="input-email">Email</label>
                        </div>
                        <div className={signInStyles['floating-label']}>
                            <input type="password" name="password" onChange={handlePasswordChange} value={passwordInput} className={signInStyles['input-email-password']} id="input-password" placeholder=" " required 
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={(e) => setPasswordFocused(e.target.value !== "")} />
                            <label className={passwordFocused ? signInStyles.focused : ""} htmlFor="input-password">Password</label>
                        </div>
                        <input className={signInStyles['form-btn']} type="submit" value="Sign in with email" />
                    </div>
                </form>

                {errorMessage && (
                    <p style={{ color: "rgba(207, 127, 135, 1)", marginTop: "20px", marginBottom: "20px", alignSelf: 'center'}}>{errorMessage}</p>
                )}









                <div className={signInStyles['sign-up-link-div']}>
                    <Link to='/signup' className={signInStyles['sign-up-link']}>Don&apos;t have an account yet? Click here to sign up!</Link>
                </div>
            </div>
        </main>
    );
};

export default SignInForm;



