"use strict";

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  $(document).ready(function () {
    tableau.extensions.initializeAsync().then(
      function () {
        console.log("called here");
      },
      function (err) {
        // Something went wrong in initialization
        console.log("Error while Initializing: " + err.toString());
      }
    );
  });
})();

function getImage() {
  var n = document.getElementById("keyInput").value;
  // http://localhost:3000/fileUpload?url=https://www.kindacode.com/wp-content/uploads/2021/01/test.jpg&key=mOYna0HFMgMg3tc
  var base_url =
    "http://localhost:3000/fileUpload?key=mOYna0HFMgMg3tc&url=" + n;
  fetch(base_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("data = ", data);
      console.log("data = ", "http://localhost:3000/fileLink?url="+data);

      // window.location.href = "http://localhost:3000/fileLink?url="+data;
    })
    .catch(function (err) {
      console.log("err = ", err);
    });
}
