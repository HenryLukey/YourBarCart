import React, { useState, useEffect, useMediaQuery } from "react";
import { db } from "../firebase-config";
import { collection, doc, addDoc, getDocs, limit, query, where, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { UserAuth } from "../context/AuthContext";
import IngredientsPanel from "../components/IngredientsPanel";
import CocktailsPanel from "../components/CocktailsPanel";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Home = ({ navHeight }) => {
    // Get the current user
    const {user} = UserAuth();

    // Calculate the height of the viewport minus the height of the navbar and put this in an object to be used in css form
    let heightStyle = {
        height: `calc(100vh - ${navHeight+1}px)`,
    };

    // Make a useState to keep track of the userIngredients false at first to prevent unnecessary
    // changes to Firestore or local storage
    const [userIngredients, setUserIngredients] = useState(false);

    // Make a useState to store the docID of the userIngredients doc for the specific user
    const [docID, setDocID] = useState("");

    // Track how many cocktails can be made with the addition of 1 extra ingredient, passed to ingredientsPanel component
    const [additionals, setAdditionals] = useState();

    // Keep track of whether user is on a mobile device - used for changing scrolling behaviour
    const { height:windowHeight, width:windowWidth} = useWindowDimensions()

    // Add an ingredient to the userIngredients state
    const addIngredient = (ingredient) => {
        setUserIngredients(oldArray => [...oldArray, ingredient]);
    }

    // Remove an ingredient from the userIngredients state
    const removeIngredient = (ingredient) => {
        setUserIngredients(userIngredients.filter(item => item !== ingredient));
    }

    // Set userIngredients state to an empty array
    const removeAllIngredients = () => {
        setUserIngredients([]);
    }

    const handleAdditionals = (additionalObj) => {
        setAdditionals(additionalObj);
    }

    // Called when the user changes, gets the ingredients the user has from the userIngredients
    // collection in Firestore
    useEffect(() => {
        // Get a reference to the collection
        const userIngredientsRef = collection(db, "userIngredients");
        const getUserIngredients = async () => {
            // Set userIngredients to be equal to whatever's in local storage
            if (localStorage.getItem("userIngredients") !== null) {
                setUserIngredients(JSON.parse(localStorage.getItem("userIngredients")));
            // Otherwise userIngredients should be an empty array
            } else {
                setUserIngredients([]);
            }
        };

        getUserIngredients(); 
    },[]);

    // Called whenever userIngredients changes
    useEffect(() => {
        // If the userIngredients state is false then there's no need to update the database or local storage
        if (userIngredients !== false) {
            localStorage.setItem("userIngredients", JSON.stringify(userIngredients));
        }
        
    },[userIngredients]);

    // If the user is on mobile or a mobile sized screen then adjust the heightStyle to be used by panels accordingly
    useEffect(() => {
        // If on mobile the height should be auto so the panels expand with more results
        if (windowWidth < 768) {
            heightStyle = {height: "auto",}
        // If not on mobile the height should be the screen - the height of navbar so there is scrolling within the panel
        } else {
            heightStyle = {height: `calc(100vh - ${navHeight+1}px)`,}
        }
    },[windowWidth])

    return (
        // Must be wrapped in a motion div from framer motion so there can be transitions
        <motion.div className="bg-lightColour dark:bg-darkModeMain" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition:{duration: 0.25}}}>
            {/* Div to contain the ingredients and cocktail recipes panels */}
            <div className="flex md:flex-row flex-col">
                <IngredientsPanel heightStyleObj={heightStyle} userIngredients={userIngredients} addIngredient={addIngredient} removeIngredient={removeIngredient} removeAllIngredients={removeAllIngredients} additionals={additionals}/>
                <CocktailsPanel heightStyleObj={heightStyle} userIngredients={userIngredients} handleAdditionals={handleAdditionals} />
            </div>
        </motion.div>
    );
};

export default Home;