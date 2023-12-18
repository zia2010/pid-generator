import axios from "axios";
import { updateListOfFiles } from "../components/draftGenerator/draftGeneratorSlice";
// import { setFilesArrayList } from "../../components/Layout/Dashboard/TrainGrafi/actions/trainGrafiActions";
// import Store from "../../redux/store";
// import { AxiosTrainModelService as Axios } from '../../../../../Errorframework/NetworkErrorHandler/axios';
const defaultHeaders = {
  "Content-Type": "application/json",
};

export class AxiosClass {
  Axios;

  constructor(baseURL) {
    this.Axios = axios.create({
      baseURL,
    });
    this.setUpInterceptors();
  }

  setUpInterceptors() {
    this.Axios?.interceptors?.response?.use(
      (response) => response,
      (error) => {
    //     const errorData = error?.response?.data || error || error.message;
    //     const errorObj = {
    //       ...errorData,
    //       message: error?.message
    //         ? error?.message
    //         : "Oops, something went wrong. Please try again later.",
    //     };
    //     const errCode = error?.response?.status;
    //     Store.dispatch(
    //       setEmptySubtopicsMessage({
    //         subTopics: "No Sub Topics Found",
    //         resources: "No Resources Found",
    //         outline: "Create your outline",
    //       })
    //     );
    //     if (
    //       error.message.includes(
    //         '"error": "invalid_token", "error_description": "Token required but invalid"'
    //       )
    //     ) {
    //       Store.dispatch(hideLoadingSpinner());
    //       Store.dispatch(hideLoaderWithText());
    //       Store.dispatch(
    //         setErrorNotification({
    //           message: "Session Timed Out !! Please re-login",
    //         })
    //       );
    //     }
    //     if (errCode === 400) {
    //       Store.dispatch(hideLoadingSpinner());
    //       Store.dispatch(hideLoaderWithText());
    //       if (
    //         error.response.data.message?.includes(
    //           "is not mapped to any tenant!!"
    //         )
    //       ) {
    //         Store.dispatch(
    //           setErrorNotification({
    //             message: "This User is not mapped to any tenant!!",
    //           })
    //         );
    //       } else if (
    //         error.response.data.message?.includes(
    //           "You are using blacklisted url. Please change it!!"
    //         )
    //       ) {
    //         Store.dispatch(
    //           setErrorNotification({
    //             message:
    //               "You are using blacklisted url. Please change the url!!",
    //           })
    //         );
    //       } else if (
    //         error.response.data.errorMessage?.includes("Unable to scrap url.")
    //       ) {
    //         Store.dispatch(
    //           setErrorNotification({
    //             message: "Unable to scrap url.",
    //           })
    //         );
    //       } else if (
    //         error.response.data.message?.includes(
    //           "Make sure your topic is healthcare related!"
    //         )
    //       ) {
    //         Store.dispatch(
    //           setErrorNotification({
    //             message: "Make sure your topic is healthcare related!",
    //           })
    //         );
    //       } else if (
    //         error.response.data.message?.includes(
    //           "Make sure to include a medical keyword - diabetes, multiple sclerosis, etc"
    //         )
    //       ) {
    //         Store.dispatch(
    //           setErrorNotification({
    //             message:
    //               "Make sure to include a medical keyword - diabetes, multiple sclerosis, etc",
    //           })
    //         );
    //       } else {
    //         Store.dispatch(
    //           setErrorNotification({
    //             message: "Server cannot process due to some bad request  ",
    //           })
    //         );
    //       }
    //     } else if (errCode === 429) {
    //       Store.dispatch(hideLoadingSpinner());
    //       Store.dispatch(hideLoaderWithText());
    //       Store.dispatch(
    //         setErrorNotification({
    //           message:
    //             "You have reached your 5,000 word limit for this month. Upgrade to Grafi Professional for unlimited text generation!",
    //         })
    //       );
    //       Store.dispatch(setOriginalityScoreClicked(false));
    //     } else if (errCode === 403) {
    //       Store.dispatch(hideLoadingSpinner());
    //       Store.dispatch(hideLoaderWithText());
    //       Store.dispatch(
    //         setErrorNotification({
    //           message: "Access is forbidden",
    //         })
    //       );
    //     } else if (errCode === 401) {
    //       if (
    //         error?.response?.data?.message?.includes(
    //           '"error": "invalid_token", "error_description": "Token required but invalid"'
    //         )
    //       ) {
    //         Store.dispatch(hideLoadingSpinner());
    //         Store.dispatch(hideLoaderWithText());
    //         Store.dispatch(
    //           setErrorNotification({
    //             message: "Session Timed Out !! Please re-login",
    //           })
    //         );
    //       } else if (
    //         error.message.includes("Request failed with status code 401")
    //       ) {
    //         Store.dispatch(hideLoadingSpinner());
    //         Store.dispatch(hideLoaderWithText());
    //         Store.dispatch(
    //           setErrorNotification({
    //             message: "Session Timed Out !! Please re-login",
    //           })
    //         );
    //       } else {
    //         Store.dispatch(hideLoadingSpinner());
    //         Store.dispatch(hideLoaderWithText());
    //         Store.dispatch(setErrorNotification(errorObj));
    //       }
    //     }

    //     if (
    //       errCode === 404 ||
    //       errCode === 405 ||
    //       errCode === 500 ||
    //       errCode === 504
    //     ) {
    //       Store.dispatch(hideLoadingSpinner());
    //       Store.dispatch(hideLoaderWithText());
    //       Store.dispatch(setErrorNotification(errorObj));
    //     }
    //     if (
    //       typeof error?.response === "undefined" &&
    //       error?.message !== "operation cancelled"
    //     ) {
    //       if (error.message === "canceled") {
    //         const cancelErr = {
    //           type: "CORB",
    //           message: "File Upload Cancelled",
    //         };
    //         Store.dispatch(hideLoadingSpinner());
    //         Store.dispatch(hideLoaderWithText());
    //         Store.dispatch(setErrorNotification(cancelErr));
    //       } else {
    //         // Cross-Origin Request Blocked
    //         const corsErr = {
    //           type: "CORB",
    //           message: "Oops, something went wrong. Please try again later",
    //         };
    //         Store.dispatch(hideLoadingSpinner());
    //         Store.dispatch(hideLoaderWithText());
    //         Store.dispatch(setErrorNotification(corsErr));
    //       }
    //     }

    //     return Promise.reject(error);
      }
    );
  }

  getRequest(url, headers) {
    return this.Axios.get(url, {
      headers: { ...defaultHeaders, ...headers },
    }).then((response) => (response?.data ? response.data : response));
  }

  postRequest(url, data) {
    return this.Axios.post(url, data, {
      headers: { ...defaultHeaders, ...data.headers },
    });
  }

  // eslint-disable-next-line no-unused-vars
  postRequestForFileUpload(
    url,
    data,
    fileListArray,
    fileName,
    signal,
    dispatch
  ) {
    return this.Axios.post(url, data, {
      signal,
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
      onUploadProgress: (progressEvent) => {
        const loaded = (progressEvent.loaded / progressEvent.total) * 100;
        fileListArray.map((val, idx) => {
          if (val.resource === fileName) {
            Object.assign(fileListArray[idx], { progress: loaded });
          }
          return fileListArray;
        });
       dispatch(updateListOfFiles(fileListArray));
      },
      mode: "no-cors",
    });
  }
}

export const AxiosCoreService = new AxiosClass('https://f907-2401-4900-1c22-8fff-00-50a-a214.ngrok-free.app');
