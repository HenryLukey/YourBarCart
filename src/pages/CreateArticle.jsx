import React, { useEffect, useState, useRef } from "react";
import { createEditor, Text, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { m, motion } from "framer-motion";
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

    const initialValue = [
        {
          type: 'paragraph',
          align: 'left',
          children: [
            {
              text:
                '',
            },
          ],
        },
    ];

    const [content, setContent] = useState(initialValue);
    const [reset, setReset] = useState(initialValue);

    const titleRef = useRef(null);
    const slugRef = useRef(null);
    const deckRef = useRef(null);
    const tagsRef = useRef(null);
    const mainImageRef = useRef(null);

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
        const textContents = [];
        const queue = [];
        content.forEach((node) => {
            queue.push(node);
        });

        while (queue.length > 0) {
            const node = queue.shift(); // Dequeue a node.

            // If the node is a Text node, add its text content to textContents.
            if (Text.isText(node)) {
                textContents.push(node.text);
            }

            // If the node has children, add them to the queue.
            if (node.children) {
                queue.push(...node.children);
            }
        }
        const words = textContents.join(" ").split(" ").length;
        const averageReadSpeed = 240;
        let minutes = Math.round(words / averageReadSpeed);
        if (minutes === 0) {
            minutes = 1;
        }
        return minutes;
    }

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/[^\w\d-]+/g, "") // Remove all non-word non-num non-hyphen chars
            .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
            .replace(/^-+/, "") // Trim hyphens from start of text
            .replace(/-+$/, ""); // Trim hyphens from end of text
    }

    const checkDuplicateSlug = async (slug) => {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }

    const submitArticle = () => {
        // Get the value of the editor
        const value = editor.children;

        // Get the title of the article
        const title = document.getElementsByName("title")[0].value;

        // Get the deck of the article
        const deck = document.getElementsByName("deck")[0].value;

        const slugRaw = document.getElementsByName("slug")[0].value;
        // Slugify the slug
        const slug = slugify(slugRaw);

        const splitSlug = slug.split("-");
        if (splitSlug.length > 6) {
            alert("Slug is over 6 words, this should probably be shortened.");
            return;
        }

        // Get the tags of the article
        const tagsString = document.getElementsByName("tags")[0].value;
        // Split the tags string into an array of tags
        const tags = tagsString.split(",");
        // Trim the whitespace from each tag
        tags.forEach((tag, index) => {
            tags[index] = tag.trim();
        });

        // Get the main image of the article
        const mainImage = document.getElementsByName("mainImage")[0].value;

        // Get today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const date = `${year}-${month}-${day}`;

        // Calculate the estimated read time of the article
        const estimatedReadTime = estimateReadTime();

        // Get a reference to the articles collection
        const articlesRef = collection(db, "articles");

        // Check for duplicate slug
        checkDuplicateSlug(slug)
            .then((isDupe) => {
                if (isDupe) {
                    alert("Duplicate slug detected. Please change the slug.");
                } else {
                    // Create a new article object
                    const newArticle = {
                        title: title,
                        slug: slug,
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
                    
                    // Clear all the input elements
                    setReset(initialValue);
                    titleRef.current.value = "";
                    slugRef.current.value = "";
                    deckRef.current.value = "";
                    tagsRef.current.value = "";
                    mainImageRef.current.value = "";
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error checking for duplicate slug. Please try again.");
            }
        );
    }

    return (
        <div className="bg-gray-500">
            <h1 className="text-3xl font-black font-roboto py-4">Create an article</h1>
            <div className="flex flex-col justify-center py-8 space-y-4 pl-32">
                <div className="flex flex-col">
                    <label className="text-left mb-2">Title</label>
                    <input ref={titleRef} type="text" name="title" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Slug</label>
                    <input ref={slugRef} type="text" name="slug" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Deck</label>
                    <input ref={deckRef} type="text" name="deck" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Tags</label>
                    <input ref={tagsRef} type="text" name="tags" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Main Image</label>
                    <input ref={mainImageRef} name="mainImage" type="text" className="max-w-md" />
                </div>
                <br />
                <div className="bg-white">
                    <RichTextEditor setContent={setContent} reset={reset}/>
                </div>
                <div className="flex flex-col max-w-md">
                    <button onClick={() => submitArticle()} className="bg-blue-500">Submit!</button>
                </div>
            </div>
        </div>
    );
}

export default CreateArticle