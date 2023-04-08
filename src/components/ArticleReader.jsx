import React, { useMemo, useCallback } from 'react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import isHotkey from 'is-hotkey';
import { Editor, Transforms, createEditor, Descendant, Element as SlateElement } from 'slate';
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  useSlate,
  withReact,
  ReactEditor,
} from 'slate-react';
import { withHistory } from 'slate-history';
import { css } from '@emotion/css';
import { Button, Icon } from '../components/slate-components';

const RichTextEditor = ({value}) => {
    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leaf {...props} />, []);
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);

    return (
    <Slate editor={editor} value={value}>
        <Editable
        //renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={true}
        placeholder="Enter some rich text…"
        renderElement={props => <Element {...props} />}
        />
    </Slate>
    )
}

const withImages = editor => {
  const { insertData, isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}

const Element = props => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'image':
      return <Image {...props} />
    case 'block-quote':
      return (
      <blockquote style={style} {...attributes}>
      {children}
      </blockquote>
      )
    case 'bulleted-list':
      return (
      <ul style={style} {...attributes}>
      {children}
      </ul>
      )
    case 'heading-one':
      return (
      <h1 style={style} {...attributes}>
      {children}
      </h1>
      )
    case 'heading-two':
      return (
      <h2 style={style} {...attributes}>
      {children}
      </h2>
      )
    case 'list-item':
      return (
      <li style={style} {...attributes}>
      {children}
      </li>
      )
    case 'numbered-list':
      return (
      <ol style={style} {...attributes}>
      {children}
      </ol>
      )
    default:
      return (
      <p style={style} {...attributes}>
      {children}
      </p>
      )
  }
}

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={css`
          position: relative;
        `}
      >
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
  
    if (leaf.code) {
      children = <code>{children}</code>
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>
    }
  
    if (leaf.underline) {
      children = <u>{children}</u>
    }
  
    return <span {...attributes}>{children}</span>
 }

const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

export default RichTextEditor;