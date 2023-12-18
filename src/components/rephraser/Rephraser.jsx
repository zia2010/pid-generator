import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import "./Rephraser.scss";
import "../../shared/commonStyles/common.scss";
import React, { useRef } from "react";
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
  setRephraserDocumentCategory,
  setRephraserReadingLevel,
  setRephraserProductCategory,
  setUrl,
  setUrlValidationErrorMessage,
  updateListOfUrls,
  setRephraserKeywords,
  updateListOfFiles,
  setFileValidationErrorMessage,
  setRephraserTemplate
} from "./rephraserSlice";
export default function Rephraser() {
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
    template
  } = useSelector((state) => state.rephraser);
  const formData = new FormData();
  const cancelFileUpload = useRef(null);
  const abortController = useRef(null);
  //const { getRootProps, getInputProps } = useDropzone({});
  const handleFirstRephraserGeneratorUrlChange = (e) => {
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
          const paramForFileResource = {
            resources: [
              {
                resource: file?.name,
                resourceType: "FILE",
                documentId: "",
              },
            ],
          };
          // const dataPayload = {
          //   userId: tokenDetails?.sub,
          //   referenceId: "",
          //   fileName: file?.name,
          //   category: "ModelTraining",
          //   tenantId: tenantDetails.tenant_id,
          // };
          const fileData = {
            resource: file?.name,
            fileSize: fileSizeConvertion(file?.size),
            fileSizeBytes: file?.size,
          };
          listOfFiles = [...listOfFiles, fileData];
          dispatch(updateListOfFiles(listOfFiles));
          // dispatch(
          //   fetchFileUploadData(
          //     dataPayload,
          //     formData,
          //     listOfFiles,
          //     file?.name,
          //     cancelFileUpload.current.signal,
          //     paramForFileResource,
          //     draftId
          //   )
          // );
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
    const paramForUrlResource = {
      resources: [
        {
          resource: url,
          resourceType: "URL",
          documentId: null,
        },
      ],
    };
    if (listOfUrls.filter((Item) => Item.resource === url).length > 0) {
      dispatch(
        setUrlValidationErrorMessage("This URL has already been added !")
      );
    } else {
      dispatch(updateListOfUrls({ resource: url }));
      // dispatch(
      //   // fetchUrlValidationStatusInServer(url, paramForUrlResource, draftId)
      // );
      dispatch(setUrl(""));
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
    // abortController.current = new AbortController();
    // filesInProgressCount();
    dispatch(setFileValidationErrorMessage(""));
    const fileList = [e?.target?.files];
    formData.append("file", e?.target?.files[0]);
    // const dataPayload = {
    //   userId: tokenDetails?.sub,
    //   referenceId: '',
    //   fileName: listOfFiles[0],
    //   category: 'ModelTraining',
    //   tenantId: tenantDetails.tenant_id,
    // };
    const paramForFileResource = {
      resources: [
        {
          resource: e?.target?.files[0].name,
          resourceType: "FILE",
          documentId: "",
        },
      ],
    };
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
          listOfFiles = [...listOfFiles, fileData];
          dispatch(updateListOfFiles(listOfFiles));
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
  const handleSubmit = () => {
    navigate("/finalrephraser");
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
      label: "👨‍💼 product manual",
      value: "productmanual",
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
    }
  ];
  const productCategories = [
    {
      label: "mobile",
      value: "mobile",
    },
    {
      label: "television",
      value: "television",
    },
    {
      label: "washing Machine",
      value: "washingmachine",
    }
  ];
  const handleProductCategoryChange = (e) => {
    dispatch(setRephraserProductCategory(e.target.value));
  };
  const handleReadingLevelChange = (e) => {
    dispatch(setRephraserReadingLevel(e.target.value));
  };
  const handleDocCategoryChange = (e) => {
    dispatch(setRephraserDocumentCategory(e.target.value));
  };
  const handleKeywordsChange = (e) => {
    dispatch(setRephraserKeywords(e.target.value));
  };
  const handleTemplateChange = (e) => {
    dispatch(setRephraserTemplate(e.target.value));
  }
  return (
    <>
      <Grid className="FirstDraftGenerator-ContentBody mainLayout">
        <Grid className="FirstDraftGenerator-Section3">
          <Grid container item className="addSpacing" spacing={4}>
          <Grid item xs={12} className="removeSpacing">
              <Typography className="FirstDraftGenerator_LabelName--firstLebel  fontFamilyPoppins fontWeight-500">
                What topic do you want to write about?
                <Tooltip title="This input will be used to help select relevant content - be specific">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <TextField
                placeholder="Please enter a topic you want to go through"
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
            <Grid item xs={6} className="removeSpacing">
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Template
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want Grafi AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                placeholder="select template"
                value={template}
                onChange={handleTemplateChange}
                menuItems={templates}
                className="textField"
                aria-label="select template"
                aria-required="true"
                name="template"
                style={{textAlign: 'left'}}
              />
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
              Product Category
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want Grafi AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                placeholder="select product category"
                value={productCategory}
                style={{textAlign: 'left'}}
                onChange={handleProductCategoryChange}
                menuItems={productCategories}
                className="textField"
                aria-label="select productn category"
                aria-required="true"
                name="productCategory"
              />
            </Grid>
            <Grid item xs={6} className="removeSpacing">
              <Typography className="FirstDraftGenerator_LabelName--firstLebel fontFamilyPoppins fontWeight-500">
                Reading Level
                <Tooltip title="Most content is written for an 8th grade or intermediate reading level">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                value={readingLevel}
                style={{textAlign: 'left'}}
                onChange={handleReadingLevelChange}
                placeholder="select reading level"
                menuItems={readingLevels}
                className="textField"
                aria-label="select reading level"
                aria-required="true"
                name="readinglevel"
              />
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Document Category
                <Tooltip title="Depending on your audience, you can adjust how casual or technical you want Grafi AI to be">
                  <ToolTipIcon />
                </Tooltip>
              </Typography>
              <GrafiDropDownSelect
                placeholder="select document category"
                style={{textAlign: 'left'}}
                value={documentCategory}
                onChange={handleDocCategoryChange}
                menuItems={documentCategories}
                className="textField"
                aria-label="select Category"
                aria-required="true"
                name="document"
              />
            </Grid>
          </Grid>
          <Grid container className="removeSpacingWrapper" item spacing={4}>
            <Grid item xs={6} className="removeSpacing">
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
                    value={url}
                    onChange={handleFirstRephraserGeneratorUrlChange}
                    onPaste={handleFirstRephraserGeneratorUrlChange}
                  />
                  <Button
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
            <Grid item xs={6} className="removeSpacing">
              <Typography className="FirstDraftGenerator_LabelName fontFamilyPoppins fontWeight-500">
                Uploadable Sources <span>(Optional)</span>
                <Tooltip title="If you've already curated PDFs and want to use the content as source material, upload the files here. Note: Grafi cannot read images, only text">
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
                      <input {...getInputProps()} />
                      <Typography className="fontFamilyPoppins dragDrop fontWeight-400">
                        <UploadIcon /> Drag & Drop files here
                      </Typography>
                    </Typography>
                  </Box>

                  <Button
                    component="label"
                    className="buttonStyle"
                    variant="outlined"
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
        <Grid className="FirstDraftGenerator_actionBtn">
          <Button
            size="large"
            style={{ textTransform: "none" }}
            variant="outlined"
            color="primary"
            disabled={!!(keywords === '' || productCategory === '')}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
