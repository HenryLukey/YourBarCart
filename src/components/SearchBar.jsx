import { React, useState, useEffect } from "react";

const SearchBar = ({ searchPopulation, onSearch, showAllByDefault }) => {
    
    // Make a useState hook to store and keep track of search terms input by the user
    const [searchTerm, setSearchTerm] = useState("");

    // Runs whenever the searchTerm or searchPopulation changes, will call onSearch function
    // passing the results of the search back to the parent component
    useEffect(() => {
        if (searchPopulation && searchPopulation.length > 0) {
            // Create local array to store all the results
            let searchResults = [];

            // If showAllByDefault is false then if the search term is blank an array with a 
            // single empty string should be returned (this is for ingredients panel)
            if (!showAllByDefault) {
                if (searchTerm == "") {
                    onSearch([""]);
                    return;
                }
                // Use the filter method to perform the search, checking if elements in the search
                // population contain text from the search term
                searchPopulation.filter((item) => {
                    if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return item;
                    }
                // Then for each of the items matching the search, add them to the results array
                }).map(val => {
                    searchResults.push(val);
                });
            // If showAllByDefault is true then if the search term is blank the entire search population
            // should be returned (this is for cocktail recipes panel). This is also a way of determining
            // what the searchPopulation consists of, the cocktail recipes panel will have a population of
            // objects rather than strings, therefore they must be handled accordingly.
            } else if (showAllByDefault) {
                if (searchTerm == "") {
                    onSearch(searchPopulation);
                    return;
                }
                // Use the filter method to perform the search, checking if elements in the search
                // population contain text from the search term
                searchPopulation.filter((item) => {
                    // Uses item.name rather than just item because objects are being used rather than strings
                    if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return item;
                    }
                // Then for each of the items matching the search, add them to the results array
                }).map(val => {
                    searchResults.push(val);
                });
            }
            // Return the search results to the parent component
            onSearch(searchResults);
        // If there was no searchPopulation then return an empty array
        } else {
            onSearch([]);
        }
    },[searchTerm, searchPopulation]);

    return (
        // The component itself is just a simple input
        <input type="text" onChange={event => {setSearchTerm(event.target.value)}} placeholder="Search..." className="justify-center w-full p-2 focus:rounded-xl bg-lightColour border hover:rounded-xl border-darkColour font-roboto transition-all duration-200 ease-linear"/>
    );
}

export default SearchBar;