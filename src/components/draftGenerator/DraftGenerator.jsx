import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "./DraftGenerator.scss";
import "../../shared/commonStyles/common.scss";
import React, { useEffect, useRef } from "react";
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
} from "./draftGeneratorSlice";
import { hideSpinner, showSpinner } from "../Spinner/spinnerSlice";
import {
  resetNotification,
  setErrorNotification,
  setSuccessNotification,
} from "../../shared/compositeLib/notificationSlice";
export default function DraftGenerator() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  let {
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
      dispatch(showSpinner());
      dispatch(saveDraftUrl({ draftId, url }))
        .unwrap()
        .then(() => {
          dispatch(updateListOfUrls({ resource: url }));
          dispatch(hideSpinner());
          dispatch(
            setSuccessNotification({
              message: "URL added successfully",
            })
          );
          dispatch(setUrl(""));
        })
        .catch(() => {
          dispatch(
            setErrorNotification({
              message: "Unable to Add URL",
            })
          );
          dispatch(hideSpinner());
        });
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
    dispatch(showSpinner());
    try {
      await dispatch(
        fetchDraftManual({ draftId, productCategory, keywords })
      ).unwrap();
      navigate("/finaldraft");
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(
        setErrorNotification({
          message:
            "No content generated, please try adjusting input prompt or instruction.",
        })
      );
    }
  };
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

  const productCategories = [
    {
      label: "smart phones",
      value: "smartphones",
    },
    {
      label: "laptops",
      value: "laptop",
    },
    {
      label: "smoke detectors",
      value: " smokedetectors",
    },
    {
      label: "wireless routers",
      value: " wirelessrouters",
    },
    {
      label: "smart displays",
      value: "smartdisplays",
    },
  ];

  const templates = [
    {
      label: "product template",
      value: "producttemplate",
    },
    {
      label: "functional template",
      value: "functionaltemplate",
    },
    {
      label: "technical template",
      value: "technicaltemplate",
    },
  ];

  const handleProductCategoryChange = (e) => {
    dispatch(setFirstDraftGeneratorProductCategory(e.target.value));
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
  return (
    <>
      <Grid className="FirstDraftGenerator-ContentBody mainLayout">
        <Grid className="FirstDraftGenerator-Section3">
          <Grid container item className="addSpacing" spacing={4}>
            <Grid item xs={12} className="removeSpacing">
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
                !keywords ? "itemDisable removeSpacing" : "removeSpacing"
              }
            >
              <Typography
                className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500"
                sx={{ textTransform: "capitalize" }}
              >
                template
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                disabled={!keywords}
                placeholder="select template"
                value={productCategory}
                onChange={handleProductCategoryChange}
                menuItems={productCategories}
                className="textField"
                aria-label="select productCategory"
                aria-required="true"
                name="productCategory"
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
                !keywords || !productCategory
                  ? "itemDisable removeSpacing"
                  : "removeSpacing"
              }
            >
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Input Type
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                disabled={!keywords || !productCategory}
                placeholder="select document category"
                value={documentCategory}
                onChange={handleDocCategoryChange}
                menuItems={documentCategories}
                className="textField"
                aria-label="select Category"
                aria-required="true"
                name="document"
                style={{ textAlign: "left" }}
              />
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
            </Grid>
          </Grid>
          <Grid container className="removeSpacingWrapper" item spacing={4}>
            <Grid
              item
              xs={6}
              className={
                !keywords || !productCategory
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
                    disabled={!keywords || !productCategory}
                    value={url}
                    onChange={handleFirstDraftGeneratorUrlChange}
                    onPaste={handleFirstDraftGeneratorUrlChange}
                  />
                  <Button
                    disabled={!keywords || !productCategory}
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
            <Grid
              item
              xs={6}
              className={
                !keywords || !productCategory
                  ? "itemDisable removeSpacing"
                  : "removeSpacing"
              }
            >
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Uploadable Sources <span>(Optional)</span>
                <Tooltip title="If you've already curated PDFs and want to use the content as source material, upload the files here.">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <Box className="boxWrapper">
                <Box gap={4} className="AddLinkBox">
                  <Box
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
                        disabled={!keywords || !productCategory}
                      />
                      <Typography className="fontFamilyPoppins dragDrop fontWeight-400">
                        <UploadIcon /> Drag & Drop files here
                      </Typography>
                    </Typography>
                  </Box>

                  <Button
                    component="label"
                    className="buttonStyle"
                    variant="outlined"
                    disabled={!keywords || !productCategory}
                  >
                    Browse File{" "}
                    <input
                      ref={fileRef}
                      hidden
                      accept=".pdf"
                      type="file"
                      onChange={handleFileChange}
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
                <Box className="addedContentBox">
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
                            {/* <Cross /> */}
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
            disabled={!!(keywords === "" || productCategory === "")}
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
            disabled={!!(keywords === "" || productCategory === "")}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
