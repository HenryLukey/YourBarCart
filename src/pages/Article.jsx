import React, { useEffect, useState } from "react";
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { motion } from "framer-motion";
import { getDownloadURL, ref } from "firebase/storage";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";
import { ReactComponent as BackArrow } from "../icons/arrow-left.svg";

const Article = ({}) => {
    // Get the state from the current location from react router dom
    const {state} = useLocation();

    // Get access to react router dom's useNavigate
    const navigate = useNavigate();

    // Create a Slate editor object that won't change across renders.
    const [editor] = useState(() => withReact(createEditor()));

    // Navigate to home screen
    const returnToHome = () => {
        navigate("/");
    }

    return (
        // The whole page is wrapped in a motion div from framer motion so there can be transitions between pages
        <motion.div className="dark:bg-darkModeMain dark:text-lightColour text-darkColour" initial={{height: 0}} animate={{height: "100%"}} exit={{y: window.innerHeight, transition: {duration: 0.25}}}>
            {/* Article title + back button*/}
            <header className="bg-testColour p-4 grid grid-cols-3 justify-center bg-primary border-b border-darkColour">
                {/* Back button */}
                <div onClick={returnToHome} className="w-10 h-10 mt-3 bg-primary hover:bg-primaryVariant p-2
                    hover:rounded-xl transition-all duration-100 ease-linear cursor-pointer border border-darkColour"><BackArrow className="text-darkColour"/>
                </div>
                <h1 className="text-3xl font-black font-roboto py-4">{articleObj.title}</h1>
            </header>
            <div className="bg-lightColour dark:bg-darkModeMain">
                {/* Div to contain the entire article*/}
                <div className="flex flex-col lg:flex-row justify-center py-8">
                    {/* Deck */}
                    <h2 className="lg:w-160 w-full lg:m-4">{articleObj.deck}</h2>
                    {/* Publish date */}
                    <h3 className="lg:w-160 w-full lg:m-4">{articleObj.publishDate}</h3>
                    {/* Read time */}
                    <h3 className="lg:w-160 w-full lg:m-4">{articleObj.readTime}</h3>
                    {/* Tags */}
                    <h3 className="lg:w-160 w-full lg:m-4">{articleObj.tags}</h3>
                    {/* Main Image */}
                    <img className="lg:w-160 w-full lg:m-4 h-fit" alt={articleObj.mainImage} src={url}/>
                    {/* Article section*/}
                    <div className="lg:w-160 w-full lg:m-4">
                        <Slate editor={editor} value={articleObj.article} onChange={() => {}}>
                            <Editable readOnly={true} />
                        </Slate>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Article;