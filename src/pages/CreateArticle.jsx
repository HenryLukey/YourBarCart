import React, { useEffect, useState } from "react";
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { motion } from "framer-motion";
import { db } from "../firebase-config";
import { collection, doc, addDoc, getDocs, limit, query, where, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";
import { ReactComponent as BackArrow } from "../icons/arrow-left.svg";
import RichTextEditor from "../components/RichTextEditor";

const CreateArticle = ({}) => {
    // Get the state from the current location from react router dom
    const {state} = useLocation();

    const [content, setContent] = useState([]);

    const initialValue = [];

    // Get access to react router dom's useNavigate
    const navigate = useNavigate();

    // Create a Slate editor object that won't change across renders.
    const [editor] = useState(() => withReact(createEditor()));

    // Navigate to home screen
    const returnToHome = () => {
        navigate("/");
    }

    const tester = () => {
        console.log(content);
    }

    const estimateReadTime = () => {
        const asString = content.map(n => Node.string(n)).join(" ");
        const words = asString.split(" ").length;
        const averageReadSpeed = 240;
        const minutes = Math.round(words / averageReadSpeed);
        return minutes;
    }

    const submitArticle = () => {
        // Get the value of the editor
        const value = editor.children;

        // Get the title of the article
        const title = document.getElementsByName("title")[0].value;

        // Get the deck of the article
        const deck = document.getElementsByName("deck")[0].value;

        // Get the tags of the article
        const tagsString = document.getElementsByName("tags")[0].value;
        // Split the tags string into an array of tags
        const tags = tagsString.split(",");
        // Trim the whitespace from each tag
        tags.forEach((tag, index) => {
            tags[index] = tag.trim();
        });

        // Get the main image of the article
        const mainImage = "article-images/"+document.getElementsByName("mainImage")[0].files[0].name;
        console.log(mainImage);

        // Get today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const date = `${year}-${month}-${day}`;

        // Calculate the estimated read time of the article
        const estimatedReadTime = Math.round(value.length / 200);

        // Get a reference to the articles collection
        const articlesRef = collection(db, "articles");

        // Create a new article object
        const newArticle = {
            title: title,
            deck: deck,
            tags: tags,
            date: date,
            readTime: estimatedReadTime,
            mainImage: mainImage,
            content: content,
        };

        // Add the new article to the "articles" collection
        addDoc(articlesRef, newArticle)
        .then(docRef => {
        console.log('Article added with ID: ', docRef.id);
        })
        .catch(error => {
        console.error('Error adding article: ', error);
        });
    }

    return (
        <div>
            <h1 className="text-3xl font-black font-roboto py-4">Create an article</h1>
            <div className="flex flex-col justify-center py-8 space-y-4 pl-32">
                <div className="flex flex-col">
                    <label className="text-left mb-2">Title</label>
                    <input type="text" name="title" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Deck</label>
                    <input type="text" name="deck" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Tags</label>
                    <input type="text" name="tags" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Main Image</label>
                    <input name="mainImage" type="file" className="max-w-md" />
                </div>
                <br />
                <div className="bg-white">
                    <RichTextEditor setContent={setContent}/>
                </div>
                <div className="flex flex-col max-w-md">
                    <button onClick={() => submitArticle()} className="bg-blue-500">Submit!</button>
                </div>
            </div>
        </div>
    );
}

export default CreateArticle