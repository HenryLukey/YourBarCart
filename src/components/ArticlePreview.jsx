import React from "react";
import { useNavigate } from "react-router-dom";

const ArticlePreview = ({ imgSrc, imgPosition, title, date, deck, slug, isBig = false }) => {

    const navigate = useNavigate();

    const navigateToArticle = () => {
        //navigate("/CocktailPage", { state: { cocktailObj: cocktail } });
        navigate(`/articles/${slug}`);
    };

    if (imgPosition === "left") {
        return (
            <div className="flex w-full p-4" onClick={() => navigateToArticle()}>
                <div className="relative w-1/2" style={{paddingBottom: "30%"}}>
                    <img src={imgSrc} alt={title} className="absolute h-full w-full object-cover"/>
                </div>
                <div className="w-1/2 pl-4 p-1">
                    <h4 className="font-bold text-left font-roboto text-md pb-2">{date}</h4>
                    <h4 className={`font-bold text-left font-roboto pb-2 ${isBig ? 'text-5xl' : 'text-3xl'}`}>{title}</h4>
                    <h4 className="font-bold text-left font-roboto text-lg py-2">{deck}</h4>
                </div>
            </div>

        );
    } else if (imgPosition === "right") {
        return (
            <div className="flex w-full p-4" onClick={() => navigateToArticle()}>
                <div className="w-1/2 pr-4 p-1">
                    <h4 className="font-bold text-left font-roboto text-md pb-2">{date}</h4>
                    <h4 className={`font-bold text-left font-roboto pb-2 ${isBig ? 'text-5xl' : 'text-3xl'}`}>{title}</h4>
                    <h4 className="font-bold text-left font-roboto text-lg py-2">{deck}</h4>
                </div>
                <div className="relative w-1/2" style={{paddingBottom: "30%"}}>
                    <img src={imgSrc} alt={title} className="absolute h-full w-full object-cover"/>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col h-full w-full p-4" onClick={() => navigateToArticle()}>
                <div className="relative" style={{paddingBottom: "60%"}}>
                    <img src={imgSrc} alt={title} className="absolute h-full w-full object-cover"/>
                </div>
                <div className="pt-4">
                    <h4 className="font-bold text-left font-roboto text-md pb-2">{date}</h4>
                    <h4 className={`font-bold text-left font-roboto pb-2 ${isBig ? 'text-5xl' : 'text-3xl'}`}>{title}</h4>
                    <h4 className="font-bold text-left font-roboto text-lg py-2">{deck}</h4>
                </div>
            </div>
        );
    }
}

export default ArticlePreview;