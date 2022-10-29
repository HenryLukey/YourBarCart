import { React, useState } from "react";
import Toggle from "./Toggle";
import { ReactComponent as ChevronDown } from "../icons/chevron-down.svg";
import { ReactComponent as ChevronUp } from "../icons/chevron-up.svg";

const CategoryDropdown = ({categoryObj, userIngredients, onToggleIngredient}) => {
    // Make a useState to keep track of whether the dropdown is open
    const [isOpen, setIsOpen] = useState(false);

    // Set to be the opposite of what it currently is
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return(
        // Container div for whole dropdown
        <div className="m-2 py-2 border border-darkColour hover:rounded-xl transition-all duration-200 ease-linear">
            {/* Category button - used to open and close dropdown */}
            <div className="flex items-center justify-center" onClick={toggle}>
                <div className="select-none mx-3 text-left">
                    {categoryObj.category}
                </div>
                <div className="flex-1"></div>
                {!isOpen && <ChevronDown className="w-4 h-4 mr-3"/>}
                {isOpen && <ChevronUp className="w-4 h-4 mr-3"/>}
            </div>
            

            {/* If the dropdown is open then display all ingredients within this category */}
            {isOpen && categoryObj.ingredients.map((item, key) => {
                    return (
                        <div key={key}>
                            <Toggle initialState={userIngredients.includes(item)} value={item} onToggle={onToggleIngredient}/>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default CategoryDropdown;