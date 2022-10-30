import { React, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithFacebook } from "../firebase-config";
import loginImage from "../loginImage.jpg";

const Signin = () => {

    // get the googleSignIn function and user object from UserAuth
    const {user} = UserAuth();
    const navigate = useNavigate();
    
    // Called when "login with Google" button clicked
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error);
        }
    }

    // Called when "login with Facebook" button clicked
    const handleFacebookSignIn = async () => {
        try {
            await signInWithFacebook();
        } catch (error) {
            console.log(error);
        }
    }

    // Called when user changes, if someone's signed in then redirect to home page
    useEffect(() => {
        if (user != null){
            navigate("/");
        }
    },[user]);

    return (
        <div className="bg-primary min-h-screen flex items-center justify-center">
            {/* Login container */}
            <div className="bg-white flex max-w-3xl hover:rounded-xl transition-all duration-200 ease-linear border border-darkColour p-4">

                {/* Form */}
                <div className="sm:w-1/2 px-8">
                    <h2 className="text-darkColour text-3xl font-black font-roboto">Login</h2>

                    {/* Login buttons (taken from Flowbite.com) */}
                    <div className="flex flex-col gap-4 mt-8">
                        {/* Google login button */}
                        <button type="button" onClick={handleGoogleSignIn} className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 font-medium hover:rounded-lg transition-all duration-200 ease-linear text-sm px-5 py-3 text-center inline-flex items-center my-2 border border-darkColour">
                            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Sign in with Google
                        </button>
                        {/* Facebook login button */}
                        <button type="button" onClick={handleFacebookSignIn} className="text-white border border-darkColour bg-[#3b5998] hover:bg-[#3b5998]/90 font-medium hover:rounded-lg transition-all duration-200 ease-linear text-sm px-5 py-3 text-center inline-flex items-center my-2">
                            <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"></path></svg>
                            Sign in with Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mt-10 grid grid-cols-3 items-center text-lg font-roboto font-black text-darkColour">
                        <hr className="border-t border-gray-700"/>
                        <p className="text-center">Why?</p>
                        <hr className="border-t border-gray-700"/>
                    </div>
                    {/* Account requirement message */}
                    <div className="text-darkColour text-xl text-left font-cormorant mt-2">
                        <p>An account isn't required to use YourBarCart, but in the future it will allow us to give you better
                            recommendations and improve your general experience.
                        </p>
                    </div>
                </div>
                {/* Image */}
                <div className="w-1/2 sm:block hidden">
                    <img className="hover:rounded-xl transition-all duration-200 ease-linear" src={loginImage} alt=""/>
                </div>
            </div>
        </div>
    );
};

export default Signin;