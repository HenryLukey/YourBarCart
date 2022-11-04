import { React, useState, useEffect } from "react";
import Cocktails from "../cocktails.json";
import SearchBar from "./SearchBar";
import CocktailPreview from "./CocktailPreview";

const CocktailsPanel = ({ userIngredients }) => {
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
        const getPossibleCocktails = () => {

            const tempCocktailsArray = [];

            Cocktails.forEach(cocktail => {
                const tempIngredientArray = [];
                
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
                if (tempIngredientArray.every(val => val.some(el => userIngredients.includes(el) || el.includes("(optional)")))) {
                    tempCocktailsArray.push(cocktail);
                }
            });
            setPossibleCocktails(tempCocktailsArray);
        }
        if (userIngredients !== false) {
            getPossibleCocktails();
        }
    },[userIngredients]);

    return (
        // Div for the entire panel
        <div className="overflow-y-scroll no-scrollbar border-darkColour border-b top-0 right-0 w-screen md:w-4/5 flex flex-col">
            {/* Header section containing text and search bar */}
            <header className="bg-primary px-2 text-darkColour pb-4 border-b border-darkColour">
                <h1 className="text-2xl font-black font-roboto py-4 text-left">Here's What You Can Make</h1>
                <SearchBar searchPopulation={possibleCocktails} onSearch={handleSearchResults} showAllByDefault={true}/>
            </header>
            {/* Where all the cocktail preview cards will be displayed */}
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