import { constants } from "../config/constants";
const axios = require("axios").default;

function savePdf(data) {
  let url = constants.ROOT + "puppeteer";
  console.log(data);
  return axios.post(url, {
    html: data.html,
  });
}

function generatePdf() {
  return axios.get(`${constants.ROOT}puppeteer`, {
    responseType: "arraybuffer",
    headers: {
      Accept: "application/pdf",
    },
  });
}
export { generatePdf, savePdf };
