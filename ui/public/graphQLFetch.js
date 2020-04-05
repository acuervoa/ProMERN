"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = graphQLFetch;
var dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

function graphQLFetch(query) {
  var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return fetch(window.ENV.UI_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(function (response) {
    return response.text();
  }).then(function (body) {
    return JSON.parse(body, jsonDateReviver);
  }).then(function (result) {
    if (result.errors) {
      var error = result.errors[0];

      if (error.extension.code === "BAD_USER_INPUT") {
        var details = error.extensions.exception.errors.join("\n ");
        alert("".concat(error.message, ":\n ").concat(details));
      } else {
        alert("".concat(error.extensions.code, ": ").concat(error.message));
      }
    }

    return result.data;
  }).catch(function (e) {
    alert("CATCH Error in sending data to server: ".concat(e.message));
    return null;
  });
}