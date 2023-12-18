import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
// import parse from 'html-dom-parser';
// eslint-disable-next-line no-unused-vars
import "react-quill/dist/quill.snow.css";
import "./Editor.css";
import EditorToolbar, { formats, modules } from "./EditorToolbar/EditorToolbar";
import { setDraftTextManual } from "../draftGenerator/draftGeneratorSlice";
import { hideSpinner } from "../Spinner/spinnerSlice";

const Editor = () => {
  // const {
  //   composeClickedFlag,
  //   composeClickedValue,
  //   setComposeClickedToFalseAfterBlacklisting,
  //   setPromptGeneratedTextPlusUserTypedContent,
  //   promptFromComposeClickApiResponse,
  //   calculateSeoClickedFlag,
  //   saveDraftClickedValue,
  // } = props;

  // const { details } = useSelector((state) => state.firstDraftGeneratorReducer);
  // const {
  //   title,
  //   rephraseClickedFlag,
  //   latestDescription,
  //   selectedTone,
  //   selectedReadingLevels,
  //   rephrasedText,
  //   selectedIndex,
  //   selectedText,
  //   selectedTextLength,
  // } = useSelector((state) => state.firstDraftGeneratorEditReducer);
  const dispatch = useDispatch();
  // let blacklistedWordsFound = [];
  let quillRef = null;
  let reactQuillRef = null;
  const { draftManual } = useSelector((state) => state.draft);
  // const [userInfo, setuserInfo] = useState({
  //   description: '',
  //   latestDescription: '',
  // });

  // useEffect(() => {
  //   attachQuillRefs();
  // });

  // useEffect(() => {
  //   dispatch(setTextEditorDescriptionV2(details?.content));
  // }, [details]);
  // const { draftId } = useSelector((state) => state.firstDraftGeneratorReducer);

  // const attachQuillRefs = () => {
  //   // Ensure React-Quill reference is available:
  //   if (typeof reactQuillRef?.getEditor !== 'function') return;
  //   // Skip if Quill reference is defined:
  //   if (quillRef != null) return;
  //   quillRef = reactQuillRef?.getEditor();
  //   // eslint-disable-next-line no-self-assign
  //   if (quillRef != null) quillRef = quillRef;
  // };

  const ondescriptionChange = (value) => {
  // dispatch(setdraftTextManual(value));
    // dispatch(setSelectedTextLength(0));
  };
useEffect(() => {
  if (typeof reactQuillRef.getEditor !== 'function') return;
  const editor = reactQuillRef.getEditor();
  const unprivilegedEditor = reactQuillRef && reactQuillRef.makeUnprivilegedEditor(editor);
  const text = unprivilegedEditor?.getText();
  console.log(unprivilegedEditor?.getText());
  dispatch(setDraftTextManual(text));
  dispatch(hideSpinner());
}, [])
  const onSelectedText = (range, source, editor) => {
    // if (source === 'user') {
    //   dispatch(
    //     setSelectedText(editor?.getText(range?.index, range?.length).trim())
    //   );
    //   if (selectedText !== ' ') {
    //     dispatch(setSelectedTextLength(range?.length));
    //     dispatch(setTextIndex(range?.index));
    //   }
    // }
  };

  const onBlurEditor = () => {
    // dispatch(setSelectedTextLength(0));
  };
  return (
    <div>
      <EditorToolbar toolbarId="t1" />
      <div className="textEditor repurposeEditor">
        <ReactQuill
          theme="snow"
          value={draftManual}
          onChangeSelection={(e, source, editor) =>
            onSelectedText(e, source, editor)
          }
          onBlur={onBlurEditor}
          onChange={ondescriptionChange}
          placeholder="Write something awesome..."
          modules={modules("t1")}
          formats={formats}
          ref={(el) => {
            reactQuillRef = el;
          }}
        />
      </div>
    </div>
  );
};
export default Editor;
