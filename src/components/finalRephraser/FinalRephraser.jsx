import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as TooltipIcon } from "../../assets/icons/toolTipIcon.svg";
import "./FinalRephraser.scss";
import TextEditor from "../TextEditor/Editor";
import { useDispatch, useSelector } from "react-redux";
import { setRephraserKeywords } from "../rephraser/rephraserSlice";
const FinalRephraser = () => {
  const dispatch = useDispatch();
  const { keywords } = useSelector((state) => state.rephraser);
  const handleSaveDraft = () => {};
  const handleDownloadDraft = () => {};
  const getSelectionHtml = () => {};
  const handleTitleChange = (e) => {
    dispatch(setRephraserKeywords(e.target.value));
  };

  const downloadTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob(['test'],    
                {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "product-manual.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  return (
    <div>
      <div className="draftLayout repurposeDraft progressbarContentBody mainLayout">
        <Grid container direction="row" spacing={4} className="screenHeight">
          <Grid
            item
            container
            xs={9}
            xl={8.5}
            alignContent="baseline"
            className="draftLeftWrapper"
          >
            <Grid container item xs={12} spacing={4} className="inputWrapper">
              <Grid item xs={10.9}>
                <Box className="topicText leftAlign fontFamilyPoppins fontWeight-300">
                  Title
                </Box>
                <TextField
                  className="draftTextHeight"
                  placeholder="Enter Title"
                  value={keywords}
                  onChange={(e) => handleTitleChange(e)}
                  // onPaste={(e) => handleTopicChange(e)}
                />
              </Grid>
            </Grid>

            <Grid item container>
              <Grid item xs={12}>
                <Box className="textEditorWrapper">
                  <TextEditor />
                  <Box className="textEditorFooter">
                    <Grid container>
                      <Grid
                        item
                        xs={6}
                        container
                        justifyContent="flex-start"
                      ></Grid>
                      <Grid item xs={6} container justifyContent="flex-end">
                        <Button onClick={downloadTextFile}>
                          Download Draft
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default FinalRephraser;
