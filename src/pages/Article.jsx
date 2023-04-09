import React, { useEffect, useState } from "react";
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { motion } from "framer-motion";
import { getDownloadURL, ref } from "firebase/storage";
import { useLocation, useNavigate, useParams, Redirect } from "react-router-dom";
import { storage } from "../firebase-config";
import { ReactComponent as BackArrow } from "../icons/arrow-left.svg";
import { collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import RichTextEditor from "../components/RichTextEditor";
import ArticleReader from "../components/ArticleReader";
import { Helmet } from "react-helmet-async";

const Article = () => {
    // Get the state from the current location from react router dom
    const {state} = useLocation();

    const { id } = useParams();

    const [articleObj, setArticleObj] = useState(null);
    const [mainImageUrl, setMainImageUrl] = useState("");

    // Get access to react router dom's useNavigate
    const navigate = useNavigate();
    
    // Create a Slate editor object that won't change across renders.
    const [editor] = useState(() => withReact(createEditor()));

    // Navigate to home screen
    const returnToArticles = () => {
        navigate("/articles");
    }

    const slateToPlainText = (richText) => {
        const asString = richText.map(n => Node.string(n)).join(" ");
        return asString;
    }

    useEffect(() => {
        const getArticle = async () => {
            const articleRef = doc(db, "articles", id);
            const articleData = await getDoc(articleRef);
            if (articleData.exists()) {
                setArticleObj(articleData.data());
            }
        }

        getArticle();
    }, []);

    useEffect(() => {
        const getMainImageUrl = async () => {
            if (!articleObj || !articleObj.mainImage) {
                return;
            }
            const reference = ref(storage, `${articleObj.mainImage}`);
            await getDownloadURL(reference).then((val) => {
                setMainImageUrl(val);
            })
        }
        
        getMainImageUrl();
    },[articleObj]);

    if (!articleObj) {
        return (
            <div className="dark:bg-darkModeMain dark:text-lightColour text-darkColour">
                <div>Oops... couldn't find that article!</div>
            </div>
        )
    }

    return (
        // The whole page is wrapped in a motion div from framer motion so there can be transitions between pages
        <motion.div className="dark:bg-darkModeMain dark:text-lightColour text-darkColour" initial={{height: 0}} animate={{height: "100%"}} exit={{y: window.innerHeight, transition: {duration: 0.25}}}>
            <Helmet>
                <title>{articleObj.title}</title>
                <script type="application/ld+json">
                {`
                    {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "${articleObj.title}",
                        "datePublished": "${articleObj.date}",
                        "articleBody": "${slateToPlainText(articleObj.content)}",
                        "alternativeHeadline": "${articleObj.deck}"
                    }
                `}
                </script>
            </Helmet>
            {/* Article title + back button*/}
            <header className="bg-testColour p-4 grid grid-cols-3 justify-center bg-primary border-b border-darkColour">
                {/* Back button */}
                <div onClick={returnToArticles} className="w-10 h-10 mt-3 bg-primary hover:bg-primaryVariant p-2
                    hover:rounded-xl transition-all duration-100 ease-linear cursor-pointer border border-darkColour"><BackArrow className="text-darkColour"/>
                </div>
                <h1 itemProp="" className="text-3xl font-black font-roboto py-4">{articleObj.title}</h1>
            </header>


            <div className="bg-lightColour dark:bg-darkModeMain flex flex-col items-center">
                <div className="flex flex-col py-8 w-2/5 mx-auto items-center font-roboto">
                    {/* Deck */}
                    <h2 className="text-xl mb-2">{articleObj.deck}</h2>
                    {/* Container for date and read time */}
                    <div className="flex mb-2">
                        {/* Publish date */}
                        <h3 className="">{"Published: " + articleObj.date}</h3>
                        {/* Read time */}
                        <h3 className="mx-4">{"~" + articleObj.readTime + " min read"}</h3>
                    </div>
                    {/* Tags */}
                    {/* <h3 className="">{articleObj.tags}</h3> */}
                    {/* Main Image */}
                    <img className="h-128 w-full object-cover" alt={articleObj.mainImage} src={mainImageUrl}/>
                </div>
                {/* Div to contain the article*/}
                <div className="flex flex-col pb-4 w-1/3 mx-auto font-cormorant text-lg">
                    {/* Article section*/}
                    <div className="text-left">
                        <ArticleReader value={articleObj.content}/>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Article;