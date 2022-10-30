import { React, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { ReactComponent as Cog } from "../icons/cog.svg";
import { useNavigate } from "react-router-dom";

const SettingsButton = ({ icon }) => {
    // Get access to the logOut function from UserAuth
    const {user, logOut} = UserAuth();
    // Make a useState to keep track of whether the dropdown is open
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    // When toggled set open to be the opposite of what it currently is
    const handleOpen = () => {
        setOpen(!open);
    };

    // Attempt to logout, if it fails then log the error
    const handleClick = async () => {
        if (user?.uid) {
            try {
                await logOut();
                setOpen(false);
            } catch (error) {
                console.log(error);
            }
        } else {
            navigate("/signin");
        }
        
    }
    
    return (
        // Create a div to contain both the button and it's dropdown
        <div className={"relative inline-block m-1"}>
            {/* When clicked call handleOpen */}
            <div onClick={handleOpen} className="navbar-icon">
                <Cog className={`${open ? "rotate-60 transition-all duration-200 ease-linear" : "-rotate-60 transition-all duration-200 ease-linear"}`}/>
            </div>
            {/* If open is true then render the dropdown */}
            {open ? (
                // The dropdown is contained in an unordered list
                <ul className="absolute right-0 z-30 w-48 origin-top-right bg-lightColour border border-darkColour hover:rounded-xl transition-all duration-200 ease-linear text-darkColour text-xl font-cormorant mt-2">
                    {/* Call handleSignOut if someone clicks the signout button */}
                    <li onClick={handleClick} className="mx-2 my-3 border border-darkColour hover:rounded-lg transition-all duration-200 ease-linear select-none bg-primary hover:bg-primaryVariant">
                        {user?.uid ? <div>Sign out</div> : <div>Sign in</div>}
                    </li>
                    {/* Dark mode toggle */}
                    {/* <li className="mx-2 my-3 hover:rounded-lg border border-darkColour transition-all duration-200 ease-linear select-none bg-primary hover:bg-primaryVariant"> */}
                        {/* <button>Dark mode</button> */}
                    {/* </li> */}
                </ul>
                // If it's not open then render nothing
            ) : null}
        </div>
    );
}

export default SettingsButton;