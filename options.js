// JavaScript for the options page/popup.


let inputs = document.getElementsByTagName('input');

function load_options() {
  chrome.storage.local.get('options', function (items) {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "checkbox" ||
          inputs[i].type === "radio") {
        inputs[i].checked = items.options[inputs[i].id];
      } else if (inputs[i].type === "text") {
        inputs[i].value = items.options[inputs[i].id] || "";
      }
    }
  });
}

function save_options() {
  let options = {};
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "checkbox" ||
        inputs[i].type === "radio"){
      options[inputs[i].id] = inputs[i].checked;
    } else if (inputs[i].type === "text") {
      options[inputs[i].id] = inputs[i].value;
    }
  }
  chrome.storage.local.set({options: options}, function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      updateToolbarButton(tabs[0]);
    });
  });
}

load_options();
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('change', save_options);
}

// Show or hide the receipts warning
chrome.tabs.query({active: true, currentWindow: true}, showHideReceiptsWarning);
function showHideReceiptsWarning (tabs){
  chrome.cookies.get({
    url: tabs[0].url,
    name: 'PacerPref'
  }, function (pref_cookie) {
    if (pref_cookie) {
      let disabled_el = document.getElementById('receipts_disabled');
      if (pref_cookie.value.match(/receipt=N/)) {
        // Receipts are disabled. Show the warning.
        disabled_el.classList.remove('hidden');
      } else {
        disabled_el.className += ' hidden';
      }
    }
  });
}


// Set the image source
let img = document.createElement("img");
img.src = chrome.extension.getURL('assets/images/donate-button.png');
let donateLink = document.querySelector("#donate-plea a");
let donateURL = donateLink.href;
donateLink.appendChild(img);
donateLink.addEventListener('click', function(e) {
  e.preventDefault();
  chrome.tabs.create({url: donateURL});
});
