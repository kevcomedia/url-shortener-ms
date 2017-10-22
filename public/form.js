/* eslint-env browser */

const $urlForm = document.querySelector('#urlForm');
const $url = document.querySelector('#urlForm-url');
const $urlResponse = document.querySelector('#urlResponse');

$urlForm.addEventListener('submit', function(event) {
  event.preventDefault();

  $urlResponse.innerHTML = '<p>Loading...</p>';

  fetch('/new/' + $url.value)
      .then(function(response) {
        if (response.ok) return response.json();
        throw new Error();
      })
      .then(function({shortened}) {
        $urlResponse.innerHTML =
            `<p><a href="${shortened}">${shortened}</a></p>`;
      })
      .catch(function(error) {
        $urlResponse.innerHTML = '<p>Oops, something went wrong</p>';
      });
});
