import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import SunEditor from "suneditor-react";
import listButtom from "./config/editor";
import defaultLetter from "./config/letter";
import "./App.css";
import Button from "@material-ui/core/Button";
import "suneditor/dist/css/suneditor.min.css";
import { generatePdf, savePdf } from "./services/service.pdf";
import Parser from "html-react-parser";
import LinearProgress from "@material-ui/core/LinearProgress";

function App() {
  const [letter, setLetter] = useState(defaultLetter.html);
  const [progress, setProgress] = useState(false);
  const [view, setView] = useState(1);

  const editLetter = () => {
    setView(2);
  };

  const downloadPdf = (letter) => {
    setProgress(true);
    return generatePdf(letter).then((response) => {
      setProgress(false);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `generate_file.pdf`;
      link.click();
    });
  };

  const savePdfAndBackPage = (letter) => {
    setProgress(true);
    savePdf(letter).then((res) => {
      setProgress(false);
      if (res.data.success) {
        setView(1);
        setLetter(letter.html);
      }
    });
  };

  return (
    <div className="App">
      {progress && <LinearProgress />}
      <Container maxWidth="lg">
        {view == 1 ? (
          <Letter
            letter={letter}
            editLetter={editLetter}
            downloadPdf={downloadPdf}
          ></Letter>
        ) : (
          <Editor letter={letter} savePdfAndBackPage={savePdfAndBackPage} />
        )}
      </Container>
    </div>
  );
}

export default App;

const Editor = ({ letter, savePdfAndBackPage }) => {
  let myText = letter;
  const handleChange = (content) => {
    myText = content;
  };

  const generatePDF = () => {
    let data = {
      html: myText,
    };
    savePdfAndBackPage(data);
  };

  return (
    <Box m={3}>
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row-reverse" mb={3}>
          <Button variant="contained" color="primary" onClick={generatePDF}>
            Save
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <SunEditor
          onChange={handleChange}
          height="400"
          setContents={letter}
          setOptions={listButtom}
        />
      </Grid>
    </Box>
  );
};

const Letter = ({ letter, editLetter, downloadPdf }) => {
  return (
    <React.Fragment>
      <Box m={3}>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="row-reverse">
            <Box ml={3}>
              <Button variant="contained" color="primary" onClick={editLetter}>
                EDIT DEMAND
              </Button>
            </Box>
            <Box ml={3}>
              <Button variant="contained" color="primary" onClick={downloadPdf}>
                DONWLOAD PDF
              </Button>
            </Box>
          </Box>
        </Grid>
        <Box border={1} borderColor="grey.500" p={5} mt={5}>
          <Grid item xs={12}>
            {Parser(letter)}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};
