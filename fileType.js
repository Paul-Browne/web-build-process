const mime = require("mime-types");

module.exports = (file) => {
  /*
		Trying to get as many from here...
		https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
	*/
  const mimeType = mime.lookup(file);
  let type = {
    exact: "other",
    general: undefined,
  };

  if (mimeType === "text/html") {
    type.exact = "html";
  } else if (mimeType === "application/javascript") {
    type.exact = "js";
  } else if (mimeType === "application/typescript") {
    // needs testing
    type.exact = "ts";
  } else if (mimeType === "application/json") {
    type.exact = "json";

    /*********/
    /* STYLE */
    /*********/
  } else if (mimeType === "text/css") {
    type.exact = "css";
    type.general = "style";
  } else if (mimeType === "text/less") {
    type.exact = "less";
    type.general = "style";
  } else if (mimeType === "text/x-sass") {
    type.exact = "sass";
    type.general = "style";
  } else if (mimeType === "text/x-scss") {
    type.exact = "scss";
    type.general = "style";

    /**********/
    /* IMAGES */
    /**********/
  } else if (mimeType === "image/jpeg") {
    type.exact = "jpg";
    type.general = "image";
  } else if (mimeType === "image/png") {
    type.exact = "png";
    type.general = "image";
  } else if (mimeType === "image/gif") {
    type.exact = "gif";
    type.general = "image";
  } else if (mimeType === "image/svg+xml") {
    type.exact = "svg";
    type.general = "image";
  } else if (mimeType === "image/webp") {
    type.exact = "webp";
    type.general = "image";

    /*********/
    /* VIDEO */
    /*********/
  } else if (mimeType === "video/mp4") {
    type.exact = "mp4";
    type.general = "video";
  } else if (mimeType === "video/webm") {
    type.exact = "webm";
    type.general = "video";

    /*********/
    /* FONTS */
    /*********/
  } else if (mimeType === "font/woff") {
    type.exact = "woff";
    type.general = "font";
  } else if (mimeType === "font/woff2") {
    type.exact = "woff2";
    type.general = "font";
  } else if (mimeType === "font/otf") {
    type.exact = "otf";
    type.general = "font";
  } else if (mimeType === "font/ttf") {
    type.exact = "ttf";
    type.general = "font";
  }
  return type;
};
