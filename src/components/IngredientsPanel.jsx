import { React, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { ReactComponent as Exclamation } from "../icons/exclamation.svg";
import SearchBar from "./SearchBar";
import Toggle from "./Toggle";
import Dropdown from "./CategoryDropdown";

const IngredientsPanel = ({ userIngredients, addIngredient, removeIngredient, additionals, heightStyleObj }) => {

    // Make a useState to keep track of the search results from the Searchbar component
    const [searchResults, setSearchResults] = useState([""]);
    // Make a useState to hold all the categories of ingredients
    const [ingredientsByCategory, setIngredientsByCategory] = useState([]);
    // Make a useState to hold all of the ingredients in a 1 dimensional array
    const [allIngredients, setAllIngredients] = useState([""]);

    // Called by the Searchbar whenever the searchTerm or population changes
    const handleSearchResults = (results) => {
        setSearchResults(results);
    }

    // Called whenever an ingredient is toggled
    const handleIngredientChange = (adding, ingredient) => {
        // If it was toggled to on and userIngredients doesn't already contain this ingredient
        // then call the addIngredient function provided by the parent component (Home)
        if (adding === true) {
            if (!userIngredients.includes(ingredient)) {
                addIngredient(ingredient);
            }
        // If it was toggled off and userIngredients does contain this ingredient
        // then call the removeIngredient function provided by the parent component (Home) 
        } else if (adding === false) {
            if (userIngredients.includes(ingredient)) {
                removeIngredient(ingredient);
            }
        }
    }

    // UseEffect hook called once on the first render. It gets the ingredients in the Firestore database
    // and populates the ingredientsByCategory and allIngredients with this data
    useEffect(() => {
        const getAllIngredients = async () => {
            const allIngredientsRef = collection(db, "allIngredients");
            const tempCategoriesArray = [];
            let tempIngredientsArray = [];
    
            const data = await getDocs(allIngredientsRef);
            data.docs.forEach(item => {
                let itemData = item.data();
                // Sort the ingredients alphabetically
                itemData.ingredients = itemData.ingredients.sort((a, b) => a.localeCompare(b))
                tempCategoriesArray.push(itemData);
                tempIngredientsArray = tempIngredientsArray.concat(item.data().ingredients);
            })
            setAllIngredients(tempIngredientsArray.sort((a, b) => a.localeCompare(b)));
            setIngredientsByCategory(tempCategoriesArray.sort(compareCategoryOrder))
        }

        // Compares the order of the categories from Firestore - this determines the order of the dropdown menus
        function compareCategoryOrder( a, b ) {
            if ( a.order < b.order ){
              return -1;
            }
            if ( a.order > b.order ){
              return 1;
            }
            return 0;
        }

        getAllIngredients();
    },[]);

    return (
        // Container div for the panel
        <div className="overflow-y-scroll no-scrollbar border-b flex flex-col top-0 left-0 w-screen md:w-1/5 border-r border-l border-darkColour" style={heightStyleObj}>
            {/* Header element of the panel containing the title and search bar */}
            <header className="bg-primary text-darkColour px-2 pb-4 border-b border-darkColour">
                <div className="flex flex-row justify-center">
                    <h1 className="text-2xl font-black font-roboto py-4 text-left">Ingredients</h1>
                    <div className="flex-1"/>
                    {/* Div to hold the tooltip which says that cocktails can be made with an additional ingredient */}
                    <div className="group font-cormorant text-lg">
                        <Exclamation className={`navbar-icon mt-3 ${(additionals?.ingredient !== "" && additionals?.possibleCocktails?.length > 1) ? "" : "hidden"}`} />
                        <div className="invisible group-hover:visible absolute hover-rounded-xl z-30 w-32 bg-lightColour border border-darkColour p-1 origin-top-right">If you bought some {additionals?.ingredient} you could make an additional {additionals?.possibleCocktails.length} cocktails</div>
                    </div>
                </div>
                
                {/* allIngredients is used as the search population. ShowAllByDefault is set to
                false because if there is no search term given by the user, then the ingredients are shown
                by category, rather than just showing every single ingredient */}
                <SearchBar searchPopulation={allIngredients} onSearch={handleSearchResults} showAllByDefault={false}/>
            </header>
            {/* Div which will contain search results or category dropdowns */}
            <div className="bg-lightColour text-darkColour font-cormorant text-lg font-bold md:px-0 px-8">
                {/* If no search term has been given then display the category dropdowns */}
                {(searchResults.length === 1 && searchResults[0] === "") && ingredientsByCategory.map((item, key) => {
                    return (
                        <Dropdown key={key} categoryObj={item} userIngredients={userIngredients} onToggleIngredient={handleIngredientChange} />
                    );
                })}
                {/* If there IS a valaid search then display all of the results of that search as toggles */}
                {(searchResults.length > 0 && searchResults[0] !== "") && searchResults.map((item, key) => {
                    return (
                        <div key={key}>
                            <Toggle initialState={userIngredients.includes(item)} value={item} onToggle={handleIngredientChange}/>
                        </div>
                    );
                })}
            </div>
        </div>
        
    );
}

export default IngredientsPanel;