import { React, useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, doc, addDoc, getDocs, limit, query, where, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { UserAuth } from "../context/AuthContext";
import IngredientsPanel from "../components/IngredientsPanel";
import CocktailsPanel from "../components/CocktailsPanel";

const Home = ({ navHeight }) => {
    // Get the current user
    const {user} = UserAuth();

    // Calculate the height of the viewport minus the height of the navbar and put this in an object to be used in css form
    const heightStyle = {
        height: `calc(100vh - ${navHeight+1}px)`,
    };

    // Make a useState to keep track of the userIngredients false at first to prevent unnecessary
    // changes to Firestore or local storage
    const [userIngredients, setUserIngredients] = useState(false);

    // Make a useState to store the docID of the userIngredients doc for the specific user
    const [docID, setDocID] = useState("");

    // Track how many cocktails can be made with the addition of 1 extra ingredient, passed to ingredientsPanel component
    const [additionals, setAdditionals] = useState();

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
            if (user?.uid) {
                // Get the document for the current user
                const q = query(userIngredientsRef, where("userID", "==", user.uid), limit(1));
                const data = await getDocs(q);
                // If a userIngredients doc already exists for this user set userIngredients state to be equal
                // to the data from the ingredients field
                if (data.docs.length > 0)
                {
                    setDocID(data.docs[0].id);
                    setUserIngredients(data.docs[0].data().ingredients);
                // If no documents are found then create a document for current user uid using userIngredients state array
                } else {
                    createUserIngredients();
                    setUserIngredients([]);
                }
            // If there's no logged in user then local storage should be used instead of Firestore
            } else {
                // Set userIngredients to be equal to whatever's in local storage
                if (localStorage.getItem("userIngredients") !== null) {
                    setUserIngredients(JSON.parse(localStorage.getItem("userIngredients")));
                // Otherwise userIngredients should be an empty array
                } else {
                    setUserIngredients([]);
                }
            }  
        };

        // Create a userIngredients doc for the current user. Will only ever be called once per user
        const createUserIngredients = async () => {
            await addDoc(userIngredientsRef, {userID: user.uid, ingredients: []});
        };

        getUserIngredients(); 
    },[user]);

    // Called whenever userIngredients or docID state changes, used to update the userIngredients doc in Firestore
    useEffect(() => {
        // Update the users ingredients doc
        const updateUserIngredients = async () => {
            const docRef = doc(db, "userIngredients", docID);
            const newFields = {ingredients: userIngredients};
            await updateDoc(docRef, newFields);
        }

        // If the userIngredients state is false then there's no need to update the database or local storage
        if (userIngredients !== false) {
            // Only call this if there is an existing docID and logged in user
            if (docID && user) {
                updateUserIngredients();
            } else {
                localStorage.setItem("userIngredients", JSON.stringify(userIngredients));
            }
        }
        
    },[userIngredients, docID]);

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