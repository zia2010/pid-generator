import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  url: "",
  listOfUrls: [],
  url: "",
  listOfFiles: [],
  filesValidationErrorMessage: "",
  urlValidationErrorMessage: "",
  productCategory: "",
  readingLevel: "middleschool",
  documentCategory: "productmanual",
  keywords: "",
  template: "producttemplate"
};
export const rephraserSlice = createSlice({
  name: "rephraser",
  initialState,
  reducers: {
    updateListOfUrls: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.listOfUrls = action.payload;
      } else {
        state.listOfUrls = [...state.listOfUrls, action.payload];
      }
    },
    updateListOfFiles: (state, action) => {
      state.listOfFiles = action.payload;
      // setTimeout(() => {
      state.listOfFiles.map((item) =>
        !item?.progress ? (item["progress"] = 100) : null
      );
      // });
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setRephraserProductCategory: (state, action) => {
      state.productCategory = action.payload;
    },
    setRephraserReadingLevel: (state, action) => {
      state.readingLevel = action.payload;
    },
    setRephraserDocumentCategory: (state, action) => {
      state.documentCategory = action.payload;
    },
    setUrlValidationErrorMessage: (state, action) => {
      state.urlValidationErrorMessage = action.payload;
    },
    setFileValidationErrorMessage: (state, action) => {
      state.filesValidationErrorMessage = action.payload;
    },
    setRephraserKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    setRephraserTemplate: (state, action) => {
      state.template = action.payload;
    },
    resetRephraser: () => initialState,
  },
});

export const {
  updateListOfUrls,
  setUrl,
  resetRephraser,
  setUrlValidationErrorMessage,
  setRephraserProductCategory,
  setRephraserReadingLevel,
  setRephraserDocumentCategory,
  setRephraserKeywords,
  updateListOfFiles,
  setRephraserTemplate,
  setFileValidationErrorMessage,
} = rephraserSlice.actions;

export default rephraserSlice.reducer;
