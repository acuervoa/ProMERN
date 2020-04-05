const dateRegex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

export default function graphQLFetch(query, variables = {}) {
  return fetch(window.ENV.UI_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.text())
    .then((body) => JSON.parse(body, jsonDateReviver))
    .then((result) => {
      if (result.errors) {
        const error = result.errors[0];
        if (error.extension.code === "BAD_USER_INPUT") {
          const details = error.extensions.exception.errors.join("\n ");
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    })
    .catch((e) => {
      alert(`CATCH Error in sending data to server: ${e.message}`);
      return null;
    });
}
