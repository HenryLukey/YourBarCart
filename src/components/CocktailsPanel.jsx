import { React, useState, useEffect } from "react";
import Cocktails from "../cocktails.json";
import SearchBar from "./SearchBar";
import CocktailPreview from "./CocktailPreview";

const CocktailsPanel = ({ userIngredients, handleAdditionals }) => {
    // Make a useState to hold all the cocktails that can be made with the current ingredients
    const [possibleCocktails, setPossibleCocktails] = useState([]);
    // Make a useState to keep track of the search results from the Searchbar component
    const [searchResults, setSearchResults] = useState([""]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    }

    // Runs whenever the userIngredients state changes, checks what cocktails can be made with the given ingredients
    // then stores them in the possibleCocktails state
    useEffect(() => {

        const missingIngredientsDict = {};

        const handleSome = (element) => {
            return userIngredients.includes(element) || element.includes("(optional)");
        }

        const getPossibleCocktails = () => {
            const tempCocktailsArray = [];
            
            Cocktails.forEach(cocktail => {
                const tempIngredientArray = [];
                const missingIngredients = [];
                
                let canBeMade = true;
                
                cocktail.ingredients.forEach(ingredient => {
                    // If the ingredient contains an "or" then split it to get the potential ingredients in an array
                    if (ingredient.name.includes(" or ")) {
                        const splitResult = ingredient.name.split(" or ");
                        tempIngredientArray.push(splitResult);
                    // Otherwise just return the name within its own array
                    } else {
                        tempIngredientArray.push([ingredient.name]);
                    }
                });

                // Check if the userIngredients array contains every ingredient in the current cocktail
                for (let i = 0; i < tempIngredientArray.length; i++) {
                    const test = tempIngredientArray[i].some(handleSome);
                    if (test === false) {
                        canBeMade = false;
                        missingIngredients.push(tempIngredientArray[i]);
                    }
                }

                if (canBeMade) {
                    tempCocktailsArray.push(cocktail);
                }

                if (missingIngredients.length === 1) {
                    missingIngredients[0].forEach(item => {
                        if (item in missingIngredientsDict) {
                            missingIngredientsDict[item].push(cocktail);
                        } else {
                            missingIngredientsDict[item] = [cocktail];
                        }
                    })
                }
            });
            setPossibleCocktails(tempCocktailsArray.sort((a, b) => a.name.localeCompare(b.name)));

            const additionals = {
                "ingredient" : "",
                "possibleCocktails" : []
            };

            // Look through all the entries in the dictionary
            for (var key in missingIngredientsDict) {
                if (!missingIngredientsDict.hasOwnProperty(key)) {
                    continue;
                }
                // If the current missing ingredient has more occurences than the current highest then replace the current highest
                if (additionals.possibleCocktails.length < missingIngredientsDict[key].length) {
                    additionals.ingredient = key;
                    additionals.possibleCocktails = missingIngredientsDict[key];
                }
            }
            // Pass the most commonly occuring missing ingredient to the home page, so it can be displayed on ingredients panel
            handleAdditionals(additionals);
        }
        if (userIngredients !== false) {
            getPossibleCocktails();
        }
    },[userIngredients]);

    return (
        // Div for the entire panel
        <div className="overflow-y-scroll no-scrollbar relative border-darkColour border-b top-0 right-0 w-screen md:w-4/5 flex flex-col">
            {/* Header section containing text and search bar */}
            <header className="bg-primary px-2 text-darkColour pb-4 border-b border-darkColour">
                <h1 className="text-2xl font-black font-roboto py-4 text-left">Here's What You Can Make</h1>
                <SearchBar searchPopulation={possibleCocktails} onSearch={handleSearchResults} showAllByDefault={true}/>
            </header>
            {/* Where all the cocktail preview cards will be displayed */}
            <div className={`md:absolute md:inset-0 m-1 mt-2 flex justify-center items-center z-10 text-center font-cormorant text-lg ${possibleCocktails.length > 0 ? "hidden" : ""}`}>
                <p>You can't make any cocktails with the current ingredients</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 pr-2 pb-2 bg-lightColour font-cormorant text-lg text-darkColour">
                {/* Check through all the search results and for each one display a preview */}
                {(searchResults[0] !== "") && searchResults.map((cocktail, index) => {
                    return (
                        <CocktailPreview key={index} cocktail={cocktail}/>
                    );
                })}
            </div>
            
        </div>
    );
};

export default CocktailsPanel;