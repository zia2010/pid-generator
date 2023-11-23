import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosCoreService as Axios } from '../../NetworkErrorHandler/axios';
import { hideSpinner } from "../Spinner/spinnerSlice";

const initialState = {
  url: "",
  listOfUrls: [],
  listOfFiles: [],
  filesValidationErrorMessage: "",
  urlValidationErrorMessage: "",
  productCategory: "",
  readingLevel: "postgraduate",
  documentCategory: "url",
  keywords: "",
  template: "producttemplate",
  draftId: "",
  error: "",
  draftManual: "",
  draftTextManual: ""
};
export const fetchNewDraftId = createAsyncThunk(
  'content/fetchNewDraftId',
  async (arg, { dispatch }) => {
  let x = await Axios.postRequest(
    'application/api/v1/draft',{
      "action": "new_manual"
    }
  );
  return x.data;
    }
);
export const saveDraftUrl = createAsyncThunk(
  'content/saveDraftUrl',
 async ({draftId, url}, { dispatch }) => {
  const x = await Axios.postRequest(
      `/application/api/v1/draft/${draftId}/resource/url`,{
        url
      }
    )
      return x.data;
    }
);
export const saveDraftFile = createAsyncThunk(
  'content/saveDraftFile',
  async (arg, { dispatch }) => {
    const res = await Axios.postRequestForFileUpload(
      `/application/api/v1/draft/${arg['draftId']}/resource/file`,arg['formData'], arg['fileList'],
      arg['name'],arg['controller'],dispatch
    );
    const data = await res.data;
    return data;
  }
);
export const fetchDraftManual = createAsyncThunk(
  'content/fetchDraftManual',
  async ({draftId, productCategory, keywords}, { dispatch }) => {
  const res = await Axios.postRequest(
    `/application/api/v1/draft/${draftId}/manual`,{
      productCategory,
      title: keywords
    }
  );
    const data = await res.data;
    return data;
  }
);
export const draftGeneratorSlice = createSlice({
  name: "draftGenerator",
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
      // state.listOfFiles.map((item) =>
      //   !item?.progress ? (item["progress"] = 100) : null
      // );
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setFirstDraftGeneratorProductCategory: (state, action) => {
      state.productCategory = action.payload;
    },
    setFirstDraftGeneratorReadingLevel: (state, action) => {
      state.readingLevel = action.payload;
    },
    setFirstDraftGeneratorDocumentCategory: (state, action) => {
      state.documentCategory = action.payload;
    },
    setUrlValidationErrorMessage: (state, action) => {
      state.urlValidationErrorMessage = action.payload;
    },
    setFileValidationErrorMessage: (state, action) => {
      state.filesValidationErrorMessage = action.payload;
    },
    setFirstDraftGeneratorKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    setFirstDraftGeneratorTemplate: (state, action) => {
      state.template = action.payload;
    },
    setDraftTextManual: (state, action) => {
      state.draftTextManual = action.payload;
    },
    resetDraft: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNewDraftId.fulfilled, (state, action) => {
      state.draftId = action?.payload?.draftId;
    })
    builder.addCase(fetchDraftManual.fulfilled, (state, action) => {
      state.draftManual = action?.payload;
    })
  },
});

export const {
  updateListOfUrls,
  setUrl,
  resetDraft,
  setUrlValidationErrorMessage,
  setFirstDraftGeneratorProductCategory,
  setFirstDraftGeneratorTemplate,
  setFirstDraftGeneratorReadingLevel,
  setFirstDraftGeneratorDocumentCategory,
  setFirstDraftGeneratorKeywords,
  updateListOfFiles,
  setFileValidationErrorMessage,
  setDraftTextManual
} = draftGeneratorSlice.actions;

export default draftGeneratorSlice.reducer;
