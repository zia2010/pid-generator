import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import "./DraftGenerator.scss";
import "../../shared/commonStyles/common.scss";
import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as LinkIcon } from "../../assets/icons/LinkIcon.svg";
import { ReactComponent as Cross } from "../../assets/icons/close.svg";
import { ReactComponent as FileIcon } from "../../assets/icons/fileIcon.svg";
import { ReactComponent as ErrorIcon } from "../../assets/icons/alertRedCircle.svg";
import { ReactComponent as ToolTipIcon } from "../../assets/icons/toolTipIcon.svg";
import { ReactComponent as UploadIcon } from "../../assets/icons/upload-cloud.svg";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import GrafiDropDownSelect from "../../shared/elementLib/DropDownSelect/GrafiDropDownSelect";
import {
  setManualReviewResult,
  setFirstDraftGeneratorDocumentCategory,
  setFirstDraftGeneratorReadingLevel,
  setFirstDraftGeneratorProductCategory,
  setUrl,
  setUrlValidationErrorMessage,
  updateListOfUrls,
  setFirstDraftGeneratorKeywords,
  updateListOfFiles,
  setFileValidationErrorMessage,
  setFirstDraftGeneratorTemplate,
  fetchNewDraftId,
  fetchDraftManual,
  saveDraftUrl,
  saveDraftFile,
  resetDraft,
  setFirstDraftGeneratorSourceType,
} from "./draftGeneratorSlice";
import { hideSpinner, showSpinner } from "../Spinner/spinnerSlice";
import {
  resetNotification,
  setErrorNotification,
  setSuccessNotification,
} from "../../shared/compositeLib/notificationSlice";
import PdfViewer from "./pdfViewer/PdfViewer";
export default function DraftGenerator() {
  const [edit, setEdit] = useState(true);
  const [displayResult, setDisplayResult] = useState(false);
  const resultTextFieldRef = useRef(null);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  let {
    manualReviewResult,
    url,
    listOfUrls,
    urlValidationErrorMessage,
    productCategory,
    readingLevel,
    documentCategory,
    keywords,
    listOfFiles,
    filesValidationErrorMessage,
    template,
    draftId,
    sourceType,
  } = useSelector((state) => state.draft);
  const formData = new FormData();
  const cancelFileUpload = useRef(null);
  const abortController = useRef(null);
  //const { getRootProps, getInputProps } = useDropzone({});
  const handleFirstDraftGeneratorUrlChange = (e) => {
    const { value } = e.target;
    dispatch(setUrl(value));
  };
  // Drag and Drop File Starts
  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      cancelFileUpload.current = new AbortController();
      dispatch(setFileValidationErrorMessage(""));
      // filesInProgressCount();
      // eslint-disable-next-line array-callback-return
      acceptedFiles.map((file) => {
        if (
          listOfFiles.filter((fileData) => fileData.resource === file.name)
            .length > 0
        ) {
          dispatch(
            setFileValidationErrorMessage(
              "This file is already added. Please drop another file."
            )
          );
        } else {
          formData.append("file", file);
          const fileData = {
            resource: file?.name,
            fileSize: fileSizeConvertion(file?.size),
            fileSizeBytes: file?.size,
          };
          const fileList = [...listOfFiles, fileData];
          dispatch(showSpinner());
          dispatch(
            saveDraftFile({
              formData,
              fileList,
              name: file.name,
              controller: cancelFileUpload.current.signal,
              draftId,
            })
          )
            .unwrap()
            .then((data) => {
              dispatch(hideSpinner());
              dispatch(
                setSuccessNotification({
                  message: "File uploaded successfully",
                })
              );
            })
            .catch(() => {
              dispatch(
                setErrorNotification({
                  message: "Unable to upload File",
                })
              );
              dispatch(hideSpinner());
            });
        }
      });
    },
    // eslint-disable-next-line no-console
    onDropRejected: (fileRejections) => {
      dispatch(setFileValidationErrorMessage(""));
      if (fileRejections[0].errors[0].code === "file-invalid-type") {
        dispatch(
          setFileValidationErrorMessage(
            `Please select a file with '.pdf' extension.`
          )
        );
      } else if (fileRejections[0].errors[0].code === "too-many-files") {
        dispatch(
          setFileValidationErrorMessage(
            `Too many files. Please select a single file.`
          )
        );
      }
    },
  });
  function handleUrlRemove(url) {
    const updatedUrls = listOfUrls.filter((Item) => Item.resource !== url);
    dispatch(updateListOfUrls(updatedUrls));
  }
  const handleAddUrls = () => {
    dispatch(setUrlValidationErrorMessage(""));
    dispatch(resetNotification());
    if (listOfUrls.filter((Item) => Item.resource === url).length > 0) {
      dispatch(
        setUrlValidationErrorMessage("This URL has already been added !")
      );
    } else {
      // dispatch(hideSpinner());
      dispatch(showSpinner());
      dispatch(updateListOfUrls({ resource: url }));
      dispatch(hideSpinner());
      dispatch(
        setSuccessNotification({
          message: "URL added successfully",
        })
      );
      dispatch(setUrl(""));
      dispatch(hideSpinner());
      // dispatch(saveDraftUrl({ draftId, url }))
      //   .unwrap()
      //   .then(() => {
      //     dispatch(updateListOfUrls({ resource: url }));
      //     dispatch(hideSpinner());
      //     dispatch(
      //       setSuccessNotification({
      //         message: "URL added successfully",
      //       })
      //     );
      //     dispatch(setUrl(""));
      //   })
      //   .catch(() => {
      //     dispatch(
      //       setErrorNotification({
      //         message: "Unable to Add URL",
      //       })
      //     );
      // dispatch(hideSpinner());
      // });
    }
  };
  const fileSizeConvertion = (fileSize) => {
    const fileSizeToBytes =
      fileSize / 1024 ** Math.floor(Math.log2(fileSize) / 10);
    const dataName = ["Bytes", "KB", "MB", "GB", "TB"][
      Math.floor(Math.log2(fileSize) / 10)
    ];
    return fileSizeToBytes.toFixed(2) + dataName;
  };
  // Drag and Drop File Ends
  const handleRemoveFile = (fileCloseIconClicked) => {
    // if (abortController.current) {
    // abortController.current.abort();
    const filteredFileListAfterfileUploadCancel = listOfFiles.filter(
      (file) => file.resource !== fileCloseIconClicked?.resource
    );
    dispatch(updateListOfFiles(filteredFileListAfterfileUploadCancel));
    //}
    dispatch(setFileValidationErrorMessage(""));
  };

  const handleFileChange2 = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);
      console.log("FormData:", formData);
      // Perform actions with formData, e.g., send it to the server
    } else {
      console.error("Please select a valid PDF file.");
    }
  };

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();

  const handleFileChange1 = (event) => {
    const selectedFile = event.target.files[0];
    setFileName(event.target.files[0].name);
    setFile(event.target.files[0]);
    console.log("filename is : ", fileName);
    console.log("file is : ", file);

    if (selectedFile && selectedFile.type === "application/pdf") {
      // Do something with the selected PDF file
      console.log("Selected PDF file:", selectedFile);

      // You can also read the contents of the file if needed
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const pdfContent = fileReader.result;
        console.log("PDF content:", pdfContent);
      };
      fileReader.readAsArrayBuffer(selectedFile);
    } else {
      // Handle the case where a non-PDF file is selected
      console.error("Please select a valid PDF file.");
      dispatch(
        setFileValidationErrorMessage(
          `Please select a file with '.pdf' extension.`
        )
      );
    }
  };
  const handleFileChange = (e) => {
    dispatch(resetNotification());
    abortController.current = new AbortController();
    dispatch(setFileValidationErrorMessage(""));
    const fileList = [e?.target?.files];
    formData.append("file", e?.target?.files[0]);
    fileList.map((v, i) => {
      // eslint-disable-next-line no-unused-vars
      const [extension, ...nameParts] = v[i].name.split(".").reverse();
      if (extension.toLowerCase() === "pdf") {
        if (
          listOfFiles.filter((file) => file.resource === v[i].name).length > 0
        ) {
          dispatch(
            setFileValidationErrorMessage(
              "This file is already added. Please select another file."
            )
          );
        } else {
          const fileData = {
            resource: v[i].name,
            fileSize: fileSizeConvertion(v[i].size),
            fileSizeBytes: v[i].size,
          };
          const fileList = [...listOfFiles, fileData];
          dispatch(showSpinner());
          dispatch(
            saveDraftFile({
              formData,
              fileList,
              name: v[i].name,
              controller: abortController.current.signal,
              draftId,
            })
          )
            .unwrap()
            .then((data) => {
              dispatch(hideSpinner());
              dispatch(
                setSuccessNotification({
                  message: "File uploaded successfully",
                })
              );
              // const fileData = {
              //   resource: v[i].name,
              //   fileSize: fileSizeConvertion(v[i].size),
              //   fileSizeBytes: v[i].size,
              // };
              // listOfFiles = [...listOfFiles, fileData];
              // dispatch(updateListOfFiles(data.fileListArray));
            })
            .catch(() => {
              dispatch(
                setErrorNotification({
                  message: "Unable to upload File",
                })
              );
              dispatch(hideSpinner());
            });
        }
      } else {
        dispatch(
          setFileValidationErrorMessage(
            `Please select a file with '.pdf' extension.`
          )
        );
      }
      return listOfFiles;
    });
    fileRef.current.value = null;
  };
  const handleSubmit = async () => {
    setDisplayResult(true);
    console.log({
      documentName: keywords,
      agent: productCategory,
      skill: template,
      url: sourceType,
      file: fileName,
    });

    
    // dispatch(showSpinner());
    // try {
    //   await dispatch(
    //     fetchDraftManual({ draftId, productCategory, keywords })
    //   ).unwrap();
    //   navigate("/finaldraft");
    // } catch (err) {
    //   dispatch(hideSpinner());
    //   dispatch(
    //     setErrorNotification({
    //       message:
    //         "No content generated, please try adjusting input prompt or instruction.",
    //     })
    //   );
    // }
  };


  useEffect(() => {
    // Scroll to and focus the result TextField when displayResult is true
    if (resultTextFieldRef.current ) {
      resultTextFieldRef.current.scrollIntoView({ behavior: 'smooth' });
      resultTextFieldRef.current.focus();
    }
  }, [displayResult]);
  const readingLevels = [
    {
      label: "👨‍💼 middle school",
      value: "middleschool",
    },
    {
      label: "👨‍🎨 high school",
      value: "highschool",
    },
    {
      label: "👨‍🎓 post graduate",
      value: "postgraduate",
    },
  ];

  const documentCategories = [
    {
      label: "URL",
      value: "url",
    },
    {
      label: "operation manual",
      value: "operationmanual",
    },
    {
      label: "user manual",
      value: "usermanual",
    },
  ];
  const sourceTypes = [
    {
      label: "Upload File",
      value: "uploadfile",
    },
    {
      label: "URL",
      value: "url",
    },
  ];

  const productCategories = [
    {
      label: "Software Developer",
      value: "softwaredeveloper",
    },
    {
      label: "Principal Engineer",
      value: "principalengineer",
    },
    {
      label: "Product Manager",
      value: "productmanager",
    },
    {
      label: "Custom Agent",
      value: "customagent",
    },
  ];

  const templates = [
    {
      label: "Debug Code",
      value: "debugcode",
    },
    {
      label: "Write Code",
      value: "writecode",
    },
    {
      label: "Write Product Requirement Documentation",
      value: "writeproductrequirementdocumentation",
    },
    {
      label: "Use Notion",
      value: "usenotion",
    },
    {
      label: "Write High Level Design",
      value: "writehighleveldesign",
    },
    {
      label: "Create Kanban Board",
      value: "createkanbanboard",
    },
    {
      label: "Custom Skill",
      value: "customskill",
    },
    {
      label: "Write lowdefy YAML",
      value: "writelowdefyYAML",
    },
  ];

  const handleManualReviewResultChange = (event) => {
    dispatch(setManualReviewResult(event.target.value));
  };
  const handleProductCategoryChange = (e) => {
    dispatch(setFirstDraftGeneratorProductCategory(e.target.value));
  };
  const handleSourceTypeChange = (e) => {
    if (e.target.value === "url") {
      setFileName("");
      setFile();
    }
    if (e.target.value === "uploadfile") {
      dispatch(updateListOfUrls([]));
    }
    dispatch(setFirstDraftGeneratorSourceType(e.target.value));
  };
  const handleReadingLevelChange = (e) => {
    dispatch(setFirstDraftGeneratorReadingLevel(e.target.value));
  };
  const handleDocCategoryChange = (e) => {
    dispatch(setFirstDraftGeneratorDocumentCategory(e.target.value));
  };
  const handleKeywordsChange = (e) => {
    dispatch(setFirstDraftGeneratorKeywords(e.target.value));
  };
  const handleTemplateChange = (e) => {
    dispatch(setFirstDraftGeneratorTemplate(e.target.value));
  };
  useEffect(() => {
    dispatch(resetNotification());
    dispatch(resetDraft());
    dispatch(showSpinner());
    dispatch(hideSpinner());
    dispatch(fetchNewDraftId())
      .unwrap()
      .then(() => {
        dispatch(hideSpinner());
      })
      .catch(() => {
        dispatch(hideSpinner());
        // dispatch(
        //   setErrorNotification({
        //     message: "Unable to generate Draft Id",
        //   })
        // );
      });
  }, []);

  
  
  const loremText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
  return (
    <>
      <Grid className="FirstDraftGenerator-ContentBody mainLayout">
        <Grid className="FirstDraftGenerator-Section3">
          <Grid container item className="addSpacing" spacing={4}>
            <Grid item xs={6} className="removeSpacing">
              <Typography className=" FirstDraftGenerator_LabelName--firstLebel  fontFamilyPoppins fontWeight-500">
                Document Name
                <Tooltip title="This input will be used to help select relevant content - be specific">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <TextField
                placeholder="Please enter a product you want to go through"
                className="textField"
                required
                autoFocus
                size="small"
                value={keywords}
                onChange={handleKeywordsChange}
                aria-label="Upload a URL"
                aria-required="true"
                name="url"
              />
            </Grid>
            <Grid
              item
              xs={6}
              className={
                // !keywords ? "itemDisable removeSpacing" : "removeSpacing"
                "removeSpacing"
              }
            >
              <Typography
                className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500"
                sx={{ textTransform: "capitalize" }}
              >
                select agent
                <Tooltip title="Depending on your requirement, you can adjust the type of agent">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                // disabled={!keywords}
                placeholder="select agent"
                value={productCategory}
                onChange={handleProductCategoryChange}
                menuItems={productCategories}
                className="textField"
                aria-label="select agent"
                aria-required="true"
                name="productCategory"
                style={{ textAlign: "left" }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              className={
                // !keywords ? "itemDisable removeSpacing" : "removeSpacing"
                "removeSpacing"
              }
            >
              <Typography
                className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500"
                sx={{ textTransform: "capitalize" }}
              >
                select source
                <Tooltip title="Depending on your requirement, you can select the type of source input">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                // disabled={!keywords}
                placeholder="select source"
                value={sourceType}
                onChange={handleSourceTypeChange}
                menuItems={sourceTypes}
                className="textField"
                aria-label="select source"
                aria-required="true"
                name="sourceType"
                style={{ textAlign: "left" }}
              />
              {/* <Typography
              className={
                (!keywords || !productCategory) ? 'itemDisable FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500' : 'FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500'
                }>
                Template
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                disabled={!keywords || !productCategory}
                placeholder="select template"
                value={template}
                onChange={handleTemplateChange}
                menuItems={templates}
                className={
                  (!keywords || !productCategory) ? 'itemDisable textField' : 'textField'
                  }
                aria-label="select template"
                aria-required="true"
                name="template"
                style={{textAlign: 'left'}}
              /> */}
            </Grid>
            <Grid
              item
              xs={6}
              className={
                // !keywords ? "itemDisable removeSpacing" : "removeSpacing"
                "removeSpacing"
              }
            >
              <Typography
                className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500"
                sx={{ textTransform: "capitalize" }}
              >
                select skill
                <Tooltip title="Depending on your requirement, you can select the skill">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                // disabled={!keywords}
                placeholder="select skill"
                value={template}
                onChange={handleTemplateChange}
                menuItems={templates}
                className="textField"
                aria-label="select agent"
                aria-required="true"
                name="template"
                style={{ textAlign: "left" }}
              />
              {/* <Typography
              className={
                (!keywords || !productCategory) ? 'itemDisable FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500' : 'FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500'
                }>
                Template
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                disabled={!keywords || !productCategory}
                placeholder="select template"
                value={template}
                onChange={handleTemplateChange}
                menuItems={templates}
                className={
                  (!keywords || !productCategory) ? 'itemDisable textField' : 'textField'
                  }
                aria-label="select template"
                aria-required="true"
                name="template"
                style={{textAlign: 'left'}}
              /> */}
            </Grid>
            {/* <Grid
              item
              xs={6}
              className={
                !keywords || !productCategory
                ? "itemDisable removeSpacing"
                : "removeSpacing"
                "removeSpacing"
              }
            > */}
            {/* <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Input Type
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                // disabled={!keywords || !productCategory}
                placeholder="select document category"
                value={documentCategory}
                onChange={handleDocCategoryChange}
                menuItems={documentCategories}
                className="textField"
                aria-label="select Category"
                aria-required="true"
                name="document"
                style={{ textAlign: "left" }}
              /> */}
            {/* <Typography className="FirstDraftGenerator_LabelName--firstLebel fontFamilyPoppins fontWeight-500">
                Reading Level
                <Tooltip title="Most content is written for an 8th grade or intermediate reading level">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                disabled={!keywords || !productCategory}
                value={readingLevel}
                onChange={handleReadingLevelChange}
                placeholder="select reading level"
                menuItems={readingLevels}
                className="textField"
                style={{textAlign: 'left'}}
                aria-label="select reading level"
                aria-required="true"
                name="readinglevel"
              /> */}
            {/* </Grid> */}
          </Grid>
          {/* <Grid container className="removeSpacingWrapper" item spacing={4}>
            <Grid item xs={6} className={"removeSpacing"}>
              <Typography
                className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500"
                sx={{ textTransform: "capitalize" }}
              >
                Manual Review Result
                <Tooltip title="Depending on your requirement, you can adjust the manual review result">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <FormControl component="fieldset" sx={{ display:'flex'}}>
                <RadioGroup
                  aria-label="manual-review-result"
                  name="manualReviewResult"
                  value={manualReviewResult}
                  onChange={handleManualReviewResultChange}
                  style={{ flexDirection: "row" }}
                >
                  <FormControlLabel
                    value="approve"
                    control={<Radio />}
                    label="Approve"
                    className="textField"
                  />
                  <FormControlLabel
                    value="reject"
                    control={<Radio />}
                    label="Reject"
                    className="textField"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid> */}

          <Grid container className="removeSpacingWrapper" item spacing={4}>
            <Grid
              item
              xs={12}
              className={
                sourceType !== "uploadfile"
                  ? "itemDisable removeSpacing"
                  : "removeSpacing"
              }
              sx={{ maxHeight: "100%" }}
            >
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Uploadable Sources <span>(Optional)</span>
                <Tooltip title="If you've already curated PDFs and want to use the content as source material, upload the files here.">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <Box
                // className="boxWrapper"
                sx={{ height: "100%" }}
              >
                <Box gap={4} className="AddLinkBox">
                  {/* <Box
                    //   component="span"
                    width="100%"
                    textAlign="center"
                    size="small"
                    sx={{
                      p: 0.5,
                      border: "1px dashed grey",
                    }}
                    className="fileDropBox"
                  >
                    <Typography {...getRootProps({ className: "dropzone" })}>
                      <input
                        {...getInputProps()}
                        // disabled={!keywords || !productCategory}
                        disabled={sourceType !== "uploadfile"}
                      />
                      <Typography className="fontFamilyPoppins dragDrop fontWeight-400">
                        <UploadIcon /> Drag & Drop files here
                      </Typography>
                    </Typography>
                  </Box> */}

                  <Button
                    component="label"
                    className="buttonStyle"
                    variant="outlined"
                    // disabled={!keywords || !productCategory}
                    disabled={sourceType !== "uploadfile"}
                  >
                    Browse File
                    <input
                      ref={fileRef}
                      hidden
                      accept=".pdf"
                      type="file"
                      onChange={handleFileChange1}
                    />
                  </Button>
                </Box>
                {filesValidationErrorMessage && (
                  <Grid
                    container
                    className="invalidLabel validationErrorMessage fontFamilyPoppins fontWeight-500"
                  >
                    <ErrorIcon />
                    {filesValidationErrorMessage || null}
                  </Grid>
                )}
                {fileName !== "" && (
                  <Box className="addedContentBox">
                    <Grid
                      container
                      item
                      alignItems="center"
                      className="dataItem"
                    >
                      <Grid
                        item
                        container
                        justifyContent="flex-start"
                        className="dataIconContainer"
                        xs={0.5}
                      >
                        <FileIcon />
                      </Grid>
                      <Grid
                        container
                        item
                        className="urlDataTextContainer"
                        xs={11}
                      >
                        <Typography className="urlDataText ">
                          {fileName}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {/* <Box className="addedContentBox">
                  {listOfFiles && listOfFiles.length >= 1 ? (
                    listOfFiles.map((item, indx) => (
                      <Grid
                        // eslint-disable-next-line react/no-array-index-key
                        key={indx}
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <FileIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="fileDataTextContainer"
                          xs={8}
                        >
                          <Typography className="fileDataText fontFamilyInter fontWeight-400">
                            {item?.resource}
                          </Typography>
                        </Grid>
                        <Grid
                          container
                          item
                          className="fileProgressBarContainer"
                          xs={3}
                          spacing={2}
                        >
                          <Grid item container justifyContent="flex-end" xs={5}>
                            <Typography className="fileDataText fontFamilyInter fontWeight-400">
                              {item?.fileSize}
                            </Typography>
                          </Grid>

                          <Grid item container alignItems="center" xs={7}>
                            <Box className="emptyProgressBar">
                              <Box
                                className="fillProgressBar"
                                sx={{
                                  width: `${item?.progress?.toFixed(
                                    2
                                  )}% !important`,
                                }}
                              ></Box>
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid container item className="removeUrlIcon" xs={0.5}>
                          <IconButton
                            // disabled={!file.id}
                            disableRipple
                            className="removeFile"
                          >
                            <Cross onClick={() => handleRemoveFile(item)} />
                            //    <Cross />  
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <FileIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <FileIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <FileIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <FileIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box> */}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              className={
                sourceType !== "url"
                  ? "itemDisable removeSpacing"
                  : "removeSpacing"
              }
            >
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Online Sources <span>(Optional)</span>
                <Tooltip title="If you have already researched this topic and want to use the content assource material, add the URLs here.">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <Box className="boxWrapper">
                <Box gap={4} className="AddLinkBox">
                  <TextField
                    // placeholder="storyset.com/search?q=Add%20link"
                    placeholder="storyset.com"
                    className="textField"
                    id="textBoxMedium"
                    required
                    aria-label=""
                    aria-required="true"
                    name="url"
                    // disabled={!keywords || !productCategory}
                    disabled={sourceType !== "url"}
                    value={url}
                    onChange={handleFirstDraftGeneratorUrlChange}
                    onPaste={handleFirstDraftGeneratorUrlChange}
                  />
                  <Button
                    // disabled={!keywords || !productCategory}
                    disabled={sourceType !== "url"}
                    onClick={handleAddUrls}
                    variant="outlined"
                    className="buttonStyle"
                  >
                    Add URL
                  </Button>
                </Box>
                {urlValidationErrorMessage ? (
                  <Grid
                    container
                    className="invalidLabel validationErrorMessage fontFamilyPoppins fontWeight-500"
                  >
                    <ErrorIcon />
                    {urlValidationErrorMessage}
                  </Grid>
                ) : null}
                <Box className="addedContentBox">
                  {listOfUrls && listOfUrls.length >= 1 ? (
                    listOfUrls.map((item) => (
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <LinkIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText FirstDraftGenerator-urlLink">
                            {item.resource}
                          </Typography>
                        </Grid>
                        <Grid container item className="removeUrlIcon" xs={0.5}>
                          <IconButton disableRipple className="">
                            <Cross
                              onClick={() => handleUrlRemove(item.resource)}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <LinkIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <LinkIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <LinkIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        item
                        alignItems="center"
                        className="dataItem"
                      >
                        <Grid
                          item
                          container
                          justifyContent="flex-start"
                          className="dataIconContainer"
                          xs={0.5}
                        >
                          <LinkIcon />
                        </Grid>
                        <Grid
                          container
                          item
                          className="urlDataTextContainer"
                          xs={11}
                        >
                          <Typography className="urlDataText ">
                            Empty
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid className="FirstDraftGenerator_actionBtn" spacing={2}>
          <Button
            size="large"
            style={{ textTransform: "none" }}
            variant="outlined"
            color="primary"
            // disabled={!!(keywords === "" || productCategory === "")}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Cancel
          </Button>
          <Button
            size="large"
            style={{ textTransform: "none", marginLeft: "1rem" }}
            variant="outlined"
            color="primary"
            // disabled={!!(keywords === "" || productCategory === "")}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </Grid>

        {displayResult && (
          <>
            <Grid
              container
              item
              className="boxWrapperResult  FirstDraftGenerator-Section3"
              spacing={0}
            >
              <Grid item xs={12}>
                <Typography
                  className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500"
                  sx={{
                    textTransform: "capitalize",
                    marginTop: "0px !important",
                  }}
                >
                  Display Result
                  <Tooltip title="Result is displayed here">
                    <ToolTipIcon />
                  </Tooltip>
                </Typography>
                <TextField
                  ref={resultTextFieldRef}
                  placeholder="Result displayed here"
                  className="textField"
                  size="small"
                  defaultValue={loremText}
                  aria-label="Text Field with Default Value"
                  aria-required="true"
                  name="textWithDefault"
                  fullWidth
                  multiline
                  // rows={3}
                  autoHeight
                  disabled={edit}
                />
              </Grid>
            </Grid>
            <Grid className="FirstDraftGenerator_actionBtn" spacing={2}>
              <Button
                size="large"
                style={{ textTransform: "none" }}
                variant="contained"
                color="primary"
                // disabled={!!(keywords === "" || productCategory === "")}

                onClick={() => alert("download")}
              >
                Download
              </Button>
              <Button
                size="large"
                style={{ textTransform: "none", marginLeft: "1rem" }}
                variant="outlined"
                color="primary"
                // disabled={!!(keywords === "" || productCategory === "")}
                onClick={() => setEdit(false)}
                //can change disable field here
              >
                Edit
              </Button>
              <Button
                size="large"
                style={{ textTransform: "none", marginLeft: "1rem" }}
                variant="outlined"
                color="primary"
                // disabled={!!(keywords === "" || productCategory === "")}
                // can save and navigate to home page
                onClick={() => alert("save")}
              >
                Save
              </Button>
            </Grid>
            <PdfViewer  />
          </>
        )}
      </Grid>


      
    </>
  );
}
