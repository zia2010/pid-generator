/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Quill } from 'react-quill';

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
// const CustomUndo = () => (
//   <svg viewBox="0 0 18 18">
//     <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
//     <path
//       className="ql-stroke"
//       d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
//     />
//   </svg>
// );

// // Redo button icon component for Quill editor
// const CustomRedo = () => (
//   <svg viewBox="0 0 18 18">
//     <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
//     <path
//       className="ql-stroke"
//       d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
//     />
//   </svg>
// );

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

// bad coding standards
// const icons = Quill.import('ui/icons');
// icons.header[1] = `<svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path class="ql-fill" d="M10.664 0.436V13H8.144V7.654H2.762V13H0.242V0.436H2.762V5.602H8.144V0.436H10.664ZM12.2263 7.6V6.439H14.3953V13H13.0993V7.6H12.2263Z" fill="#444"/>
// </svg>`;
// icons.header[2] = `<svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path class="ql-fill" d="M10.664 0.436V13H8.144V7.654H2.762V13H0.242V0.436H2.762V5.602H8.144V0.436H10.664ZM12.7753 11.578C13.3513 11.098 13.8103 10.699 14.1523 10.381C14.4943 10.057 14.7793 9.721 15.0073 9.373C15.2353 9.025 15.3493 8.683 15.3493 8.347C15.3493 8.041 15.2773 7.801 15.1333 7.627C14.9893 7.453 14.7673 7.366 14.4673 7.366C14.1673 7.366 13.9363 7.468 13.7743 7.672C13.6123 7.87 13.5283 8.143 13.5223 8.491H12.2983C12.3223 7.771 12.5353 7.225 12.9373 6.853C13.3453 6.481 13.8613 6.295 14.4853 6.295C15.1693 6.295 15.6943 6.478 16.0603 6.844C16.4263 7.204 16.6093 7.681 16.6093 8.275C16.6093 8.743 16.4833 9.19 16.2313 9.616C15.9793 10.042 15.6913 10.414 15.3673 10.732C15.0433 11.044 14.6203 11.422 14.0983 11.866H16.7533V12.91H12.3073V11.974L12.7753 11.578Z" fill="#444"/>
// </svg>`;
// icons.header[3] = `<svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path class="ql-fill" d="M10.664 0.436V13H8.144V7.654H2.762V13H0.242V0.436H2.762V5.602H8.144V0.436H10.664ZM12.3973 8.167C12.4273 7.567 12.6373 7.105 13.0273 6.781C13.4233 6.451 13.9423 6.286 14.5843 6.286C15.0223 6.286 15.3973 6.364 15.7093 6.52C16.0213 6.67 16.2553 6.877 16.4113 7.141C16.5733 7.399 16.6543 7.693 16.6543 8.023C16.6543 8.401 16.5553 8.722 16.3573 8.986C16.1653 9.244 15.9343 9.418 15.6643 9.508V9.544C16.0123 9.652 16.2823 9.844 16.4743 10.12C16.6723 10.396 16.7713 10.75 16.7713 11.182C16.7713 11.542 16.6873 11.863 16.5193 12.145C16.3573 12.427 16.1143 12.649 15.7903 12.811C15.4723 12.967 15.0883 13.045 14.6383 13.045C13.9603 13.045 13.4083 12.874 12.9823 12.532C12.5563 12.19 12.3313 11.686 12.3073 11.02H13.5313C13.5433 11.314 13.6423 11.551 13.8283 11.731C14.0203 11.905 14.2813 11.992 14.6113 11.992C14.9173 11.992 15.1513 11.908 15.3133 11.74C15.4813 11.566 15.5653 11.344 15.5653 11.074C15.5653 10.714 15.4513 10.456 15.2233 10.3C14.9953 10.144 14.6413 10.066 14.1613 10.066H13.9003V9.031H14.1613C15.0133 9.031 15.4393 8.746 15.4393 8.176C15.4393 7.918 15.3613 7.717 15.2053 7.573C15.0553 7.429 14.8363 7.357 14.5483 7.357C14.2663 7.357 14.0473 7.435 13.8913 7.591C13.7413 7.741 13.6543 7.933 13.6303 8.167H12.3973Z" fill="#444"/>
// </svg>`;

// Add sizes to whitelist and register them
const Size = Quill.import('formats/size');
Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = [
  'arial',
  'comic-sans',
  'courier-new',
  'georgia',
  'helvetica',
  'Inter',
  'lucida',
];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = (props) => ({
  toolbar: {
    container: `#${props}`,
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
});

// Formats objects for setting up the Quill editor
export const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'script',
  'blockquote',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'color',
  'code-block',
];

// Quill Toolbar component
export const QuillToolbar = (props) =>
  props.toolbarId !== undefined && (
    <div id={props.toolbarId}>
      <span className="ql-formats">
        {/* <select className="ql-font">
          <option value="arial"> Sans-Serif </option>
          <option value="arial"> Arial </option>
          <option value="comic-sans">Comic Sans</option>
          <option value="courier-new">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="helvetica">Helvetica</option>
          <option value="lucida">Lucida</option>
        </select> */}
        {/* <select className="ql-size">
          <option value="extra-small">Extra Small</option>
          <option value="small">Small</option>
          <option value="medium" selected>
            Medium
          </option>
          <option value="large">Large</option>
        </select> */}
      </span>
      <span className="ql-formats">
        <button
          id="combo8"
          aria-label="Aria Name8"
          className="ql-header"
          value="1"
        ></button>
        <button
          id="combo9"
          aria-label="Aria Name9"
          className="ql-header"
          value="2"
        ></button>
        <button
          id="combo10"
          aria-label="Aria Name10"
          className="ql-header"
          value="3"
        ></button>
      </span>

      <span className="ql-formats">
        <button id="combo1" aria-label="Aria Name1" className="ql-bold" />
        <button id="combo2" aria-label="Aria Name2" className="ql-italic" />
        <button id="combo3" aria-label="Aria Name3" className="ql-underline" />
      </span>

      {/* <span className="ql-formats">
        <button
          id="combo4"
          aria-label="Aria Name4"
          className="ql-list"
          value="ordered"
        />
        <button
          id="combo5"
          aria-label="Aria Name5"
          className="ql-list"
          value="bullet"
        />
        <button
          id="combo6"
          aria-label="Aria Name6"
          className="ql-indent"
          value="-1"
        />
        <button
          id="combo7"
          aria-label="Aria Name7"
          className="ql-indent"
          value="+1"
        />
      </span>

      <span className="ql-formats">
        <button className="ql-undo">
          <CustomUndo />
        </button>
        <button className="ql-redo">
          <CustomRedo />
        </button>
      </span> */}
    </div>
  );
export default QuillToolbar;
