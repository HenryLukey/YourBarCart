import React, { useEffect, useState, useMemo } from "react";
import { createEditor } from 'slate'
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

const TestComponent = () => {
    const editor = useMemo(() => withReact(createEditor()), [])

    const [articleObj, setArticleObj] = useState(null);

  useEffect(() => {
    const getArticle = async () => {
        const id = "ime7r5xJI8TSO6H9HGDl";
        const articleRef = doc(db, "articles", id);
        const articleData = await getDoc(articleRef);
        if (articleData.exists()) {
            setArticleObj(articleData.data());
        }
    }

    getArticle();
}, []);

    if (!articleObj) {
        return <div>Loading...</div>
    }


    return (
        // <Slate editor={editor} value={articleObj.content}>
        //     <Editable readOnly placeholder="Enter some plain text..." />
        // </Slate>
        <ArticleReader value={articleObj.content}/>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows what happens when the Editor is set to readOnly, it is not editable',
      },
    ],
  },
]

export default TestComponent;