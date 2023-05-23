import React, { useEffect, useState } from "react";
import ArticlePreview from "../components/ArticlePreview";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Articles = ({}) => {
    const [articles, setArticles] = useState([]);

    //Get all articles from firestore
    useEffect(() => {
        const getArticles = async () => {
            const articlesRef = collection(db, "articles");
            const data = await getDocs(articlesRef);
            data.docs.forEach(article => {
                let articleData = article.data();
                setArticles(prevState => [...prevState, articleData]);
            });
            // Sort the articles by date, with the most recent at index 0
            setArticles(prevState => prevState.sort((a, b) => (a.date > b.date) ? -1 : 1));
        }
        getArticles();
    }, []);

    if (articles.length === 0) {
        return (
            <div>Loading...</div>
        );
    } else {
        return (
            <div className="xl:px-32 2xl:px-64 md:px-8 px-4">
                {/* Title */}
                <div className="flex justify-left items-left">
                    <h1 className="text-8xl md:text-9xl font-bold">ARTICLES</h1>
                </div>
                <hr className="mt-2"/>
                {/* Section to contain top 4 articles */}
                <div className="lg:flex -mx-4">
                    {/* Most recent article container */}
                    <div className="lg:w-1/2 flex flex-col">
                        {/* Most recent article */}
                        <div className="h-full">
                            <ArticlePreview title={articles[0].title} imgSrc={articles[0].mainImage} imgPosition={"up"} date={articles[0].dateCreated} isBig={true} slug={articles[0].slug} deck={articles[0].deck}/>
                        </div>
                        <hr className="mx-4 lg:hidden"/>
                    </div>
                    {/* Container for next 3 articles */}
                    <div className="lg:w-1/2 mb-4 flex flex-col lg:h-full">
                        <div className="flex-1">
                            <ArticlePreview title={articles[1].title} imgSrc={articles[1].mainImage} imgPosition={"left"} date={articles[1].dateCreated} slug={articles[1].slug} deck={articles[1].deck} />
                        </div>
                        <hr className="ml-4"/>
                        <div className="flex-1">
                            <ArticlePreview title={articles[2].title} imgSrc={articles[2].mainImage} imgPosition={"left"} date={articles[2].dateCreated} slug={articles[2].slug} deck={articles[2].deck} />
                        </div>
                        <hr className="ml-4"/>
                        <div className="flex-1">
                            <ArticlePreview title={articles[3].title} imgSrc={articles[3].mainImage} imgPosition={"left"} date={articles[3].dateCreated} slug={articles[3].slug} deck={articles[3].deck} />
                        </div>
                    </div>
                </div>
                <hr />
                {/* Section to contain all other articles */}
                <div className="flex flex-wrap mt-4 -mx-4 h-128">
                {articles.slice(4).map((article, index) => (
                    <div key={index} className="lg:w-1/3 sm:w-1/2">
                        {/* Article content here */}
                        <ArticlePreview title={article.title} imgSrc={article.mainImage} imgPosition={"up"} slug={article.slug} date={article.dateCreated} deck={article.deck} />
                    </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Articles;