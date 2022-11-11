import { React, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDownloadURL, ref } from "firebase/storage";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";
import { ReactComponent as BackArrow } from "../icons/arrow-left.svg";

const CocktailPage = ({}) => {
    // Get the state from the current location from react router dom
    const {state} = useLocation();
    // Get access to react router dom's useNavigate
    const navigate = useNavigate();
    // Get the cocktail object from the state
    const {cocktailObj} = state;
    // Make a useState to handle the URL of the cocktails image
    const [url, setUrl] = useState();
    // Tracks the units the user wants to see the ingredients in
    const [usingOz, setUsingOz] = useState(true);

    // Navigate to home screen
    const returnToHome = () => {
        navigate("/");
    }

    const handleUnits = (ingredientUnit) => {
        if (ingredientUnit === "oz") {
            if (!usingOz) {
                return "ml";
            }
        }
        return ingredientUnit;
    }

    const handleQuantities = (ingredientObj) => {
        if (ingredientObj.units === "oz") {
            if (!usingOz) {
                const ml = ingredientObj.quantity * 30;
                return ml.toString();
            }
        }
        return ingredientObj.quantity;
    }

    // Called if the cocktail object changes
    useEffect(() => {
        // Gets the URL of the image by using Firebase storage's getDownloadURL method
        const getImageUrl = async () => {
            // This gets the name of the image in the storage bucket
            const reference = ref(storage, `/cocktail-images/${cocktailObj.imageAddress}`);
            await getDownloadURL(reference).then((val) => {
                setUrl(val);
            })
        }
        
        getImageUrl();
    },[cocktailObj]);

    return (
        // The whole page is wrapped in a motion div from framer motion so there can be transitions between pages
        <motion.div initial={{height: 0}} animate={{height: "100%"}} exit={{y: window.innerHeight, transition: {duration: 0.25}}}>
            {/* Header to contain the name of the cocktail as well as a back button to navigate back to home page */}
            <header className="bg-testColour p-4 grid grid-cols-3 justify-center bg-primary border-b border-darkColour">
                {/* Back button */}
                <div onClick={returnToHome} className="w-10 h-10 mt-3 bg-primary hover:bg-primaryVariant p-2
                    hover:rounded-xl transition-all duration-100 ease-linear cursor-pointer border border-darkColour"><BackArrow/>
                </div>
                <h1 className="text-3xl font-black font-roboto py-4 text-darkColour">{cocktailObj.name}</h1>
            </header>
            {/* This is where details of the cocktail are shown */}
            <div className="bg-lightColour">
                {/* Div to have the image and ingredients / steps */}
                <div className="flex flex-col lg:flex-row justify-center py-8">
                    {/* Image */}
                    <img className="lg:w-160 w-full lg:m-4 h-fit" src={url}/>
                    {/* Div containing ingredients and steps */}
                    <div className="lg:w-160 w-full lg:m-4">
                        {/* Ingredients section */}
                        <div>
                            {/* Title and unit conversion buttons */}
                            <div className="flex flex-row">
                                {/* Title */}
                                <h2 className="text-xl font-black font-roboto my-4 text-left ml-2">Ingredients:</h2>
                                {/* Unit conversion buttons */}
                                <div className="flex-1"></div>
                                <div>
                                    <button onClick={() => setUsingOz(true)} className={`text-darkColour text-xl font-cormorant border-t border-b border-l border-darkColour ml-2 my-2 py-2 px-4 ${usingOz ? "bg-primary hover:bg-primaryVariant" : "bg-lightColour hover:bg-lightVariant"}`}>oz</button>
                                    <button onClick={() => setUsingOz(false)} className={`text-darkColour text-xl font-cormorant border border-darkColour mr-2 my-2 py-2 px-4 ${usingOz ? "bg-lightColour hover:bg-lightVariant" : "bg-primary hover:bg-primaryVariant"}`}>ml</button>
                                </div> 
                            </div>
                            <ul>
                                {/* For each ingredient add a row to the list containing the name, quantity and units */}
                                {cocktailObj.ingredients.map((ingredient, index) => {
                                    return(
                                        // Use grid with 3 columns so there is consistent spacing
                                        <li className="border-t flex-wrap font-cormorant text-xl p-2 px-8 border-gray-400 grid grid-cols-3" key={index}>
                                            <div className="">{handleQuantities(ingredient)}</div>
                                            <div className="">{handleUnits(ingredient.units)}</div>
                                            <div className="">{ingredient.name}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        {/* Steps */}
                        <div className="mt-16">
                            {/* title */}
                            <h2 className="text-xl font-black font-roboto my-4">How to make:</h2>
                            {/* List of steps - uses grid auto because the number of steps is unknown */}
                            <ul className="grid grid-flow-col auto-cols-auto">
                                {/* For each step create an element saying what step it is and the instructions */}
                                {cocktailObj.steps.map((step, index) => {
                                    return(
                                        <li className="p-2" key={index}>
                                            <div className="text-lg font-black font-roboto">{"Step " + (index+1).toString()}</div>
                                            <p className="flex-wrap font-cormorant text-xl">{step}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CocktailPage;