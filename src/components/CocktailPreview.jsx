import { getDownloadURL, ref } from "firebase/storage";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";

const CocktailPreview = ({ cocktail }) => {
    // Get useNavigate from react-router-dom
    const navigate = useNavigate();
    // UseState which will store the URL of the image of this cocktail
    const [url, setUrl] = useState();

    // Redirect to the CocktailPage, passing the cocktailObject used to populate it
    const navigateToCocktail = () => {
        navigate("/CocktailPage", { state: { cocktailObj: cocktail } });
    }

    // Runs when the cocktail prop changes, and gets the URL of the cocktails image.
    // This was added into a useEffect hook to fix a bug where cocktailPreviews were
    // showing the wrong image
    useEffect(() => {
        const getImageUrl = async () => {
            const reference = ref(storage, `/cocktail-images/${cocktail.imageAddress}`);
            await getDownloadURL(reference).then((val) => {
                setUrl(val);
            })
        }
        
        getImageUrl();
    },[cocktail]);

    return (
        // Container div for the preview card
        <div className="bg-lightColour hover:bg-lightVariant dark:bg-darkModeMain dark:hover:bg-darkModeVariant ml-2 mt-2 overflow-hidden border hover-rounded-xl border-darkColour" onClick={() => navigateToCocktail()}>
            {/* Cocktail name */}
            <h2 className="font-bold p-2 border-b border-darkColour text-left">{cocktail.name}</h2>
            {/* Cocktail image */}
            <div className="p-2">
                <img src={url} alt={cocktail.name}/>
            </div>
        </div>
    );
}

export default CocktailPreview;