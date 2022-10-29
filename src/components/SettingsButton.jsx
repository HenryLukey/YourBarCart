import { React, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { ReactComponent as Cog } from "../icons/cog.svg";

const SettingsButton = ({ icon }) => {
    // Get access to the logOut function from UserAuth
    const {logOut} = UserAuth();
    // Make a useState to keep track of whether the dropdown is open
    const [open, setOpen] = useState(false);

    // When toggled set open to be the opposite of what it currently is
    const handleOpen = () => {
        setOpen(!open);
    };

    // Attempt to logout, if it fails then log the error
    const handleSignOut = async () => {
        try {
            await logOut();
            setOpen(false);
        } catch (error) {
            console.log(error);
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
                <ul className="absolute right-0 z-30 w-48 origin-top-right bg-lightColour border border-darkColour hover:rounded-xl transition-all duration-200 ease-linear">
                    {/* Call handleSignOut if someone clicks the signout button */}
                    <li onClick={handleSignOut} className="mx-2 my-3 border border-darkColour hover:rounded-lg transition-all duration-200 ease-linear select-none bg-primary hover:bg-primaryVariant">
                        <div>Sign Out</div>
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