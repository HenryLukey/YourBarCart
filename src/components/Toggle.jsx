import { React, useState, useEffect } from "react";

const Toggle = ({ initialState, value, onToggle }) => {
    // Create a useState to keep track of whether the toggle is on or off
    const [state, setState] = useState(initialState);

    // When toggled set the state to be opposite of what it currently is
    const toggle = () => {
        setState(!state);
    }

    // Called every time the state changes (cannot be inside the toggle function 
    // because setState is asynchronous)
    useEffect(() => {
        // Call the onToggle function to have the parent component handle the change
        onToggle(state, value);
    },[state]);

    // If the initial state changes then setState to be equal to what it is. This was
    // implemented to fix a bug where cocktails where still showing even if there were
    // no ingredients
    useEffect(() => {
        setState(initialState);
    },[initialState]);

    return (
        // A div which will have it's className change depending on state to handle colour changes
        <div className={`m-2 border hover:rounded-lg transition-all duration-200 ease-linear text-left px-1 p-1 border-darkColour select-none ${state ? "bg-primary hover:bg-primaryVariant" : "bg-lightColour hover:bg-gray-300"}`} onClick={toggle}>{value}</div>
    );
}

export default Toggle;