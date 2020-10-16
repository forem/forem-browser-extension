// Uncomment this to clear chrome storage and return to base state.
// chrome.storage.sync.clear();
// Remember comment it again when you're done :)

const backgroundColor = '#d7d9e0';
const currentOrigin = window.location.origin;
initializeForemLogic();

function initializeForemLogic() {
  chrome.storage.sync.get(['subscribedForems', 'allforems', 'customforems'], function (result) {
    const myForems = result.subscribedForems;
    const initialForems = result.allforems;
    const customForems = result.customforems;
    if (!myForems) {
      chrome.storage.sync.set({ subscribedForems: [] }); // Create empty array if not initialized.
    }
    if (!initialForems) {
      chrome.storage.sync.set({ allforems: [] }); // Create empty array if not initialized.
    }
    if (!customForems) {
      chrome.storage.sync.set({ customforems: [] }); // Create empty array if not initialized.
    }
    const allForems = initialForems.concat(customForems)
    if (
      (myForems && myOrigins(myForems).includes(currentOrigin)) ||
      (allForems && validOrigins(allForems).includes(currentOrigin)) ||
      currentOrigin === 'https://www.forem.com'
    ) {
      loadForemHTML(result.subscribedForems);
      document.addEventListener('add', handleAdd, false);
      document.addEventListener('remove', handleRemove, false);
      document.addEventListener('reorder', handleReorder, false);
    }
  
    // Check for new extension version
    if (
      !allForems ||
      allForems.length === 0 ||
      validOrigins(allForems).includes(currentOrigin)
    ) {
      const init = !allForems || allForems.length === 0;
      setTimeout(async () => {
        const response = await window.fetch(
          'https://www.forem.com/valid_forems.json',
        );
        const json = await response.json();
        chrome.storage.sync.set({ allforems: json.forems }); // Create empty array if not initialized.
        const versionSubstring = json.meta.latestExtensionVersion.substring(0, 3);
        if (versionSubstring != '0.2') {
          if (
            window.confirm(
              '👋👋👋\n\nA new beta version of the Forem Browser Extension has been shipped.\n\nDownload the latest from GitHub...',
            )
          ) {
            window.location.href =
              'https://github.com/forem/forem-browser-extension';
          }
        }
  
        if (init && validOrigins(json.forems).includes(currentOrigin)) {
          loadForemHTML([]);
          document.addEventListener('add', handleAdd, false);
          document.addEventListener('remove', handleRemove, false);
          document.addEventListener('reorder', handleReorder, false);
        }
      }, 300);
    }
  });  
}

// if (!validOrigins(allForems).includes(currentOrigin)) { // If not known as listed compatible forem
setTimeout(function(){
  addCompatibleForem();
}, 450)
// }


function loadForemHTML(forems) {
  const foremSidecarStyles = `position:fixed;left:0;bottom:0;top:0px;background:${backgroundColor};z-index:1000;width:100%`;
  const imageStyle = `width:calc(38px + 1.1vw);height:calc(38px + 1.1vw);margin:calc(7px + 0.1vw) auto;border-radius:10px;display:block;background:#cacdd9;border:4px solid ${backgroundColor};`;
  const hoverStyle = 'opacity:0.8;';
  const actionButtonStyle =
    'position:fixed;left:0px;bottom:0px;right:0;background:transparent;border:0;cursor:pointer;text-align:center;width:100%;padding:10px 0px;';
  const styleCss = `
    #forem-sidecar {${foremSidecarStyles}}
    #forem-sidecar img {${imageStyle}}
    #forem-sidecar img:hover, #forem-sidecar svg:hover {${hoverStyle}}
    #forem-action-button {${actionButtonStyle}}
    .drag-target img {opacity:0.2;}
    .forem-expanded {left: 0 !important;}
  `;

  const homeLink = `<a href="https://www.forem.com/discover/" rel="noreferrer" title="Forem web site"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--ppabDsgB--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://www.forem.com/seedling.png" style="${
    currentOrigin === 'https://www.forem.com' ? 'border: 4px solid white' : ''
  }" alt="Forem logo" /></a>`;
  let navHTML = '';
  const subscribedOrigins = [];
  forems.forEach(function (forem, i) {
    subscribedOrigins.push(forem.homePageUrl);
    navHTML =
      navHTML +
      `<div class="forem-link-wrapper" data-index="${i}"><a id="forem-link-${i}" title="${
        forem.name
      } web site" href="${
        forem.homePageUrl
      }" draggable="true" class="forem-single-link" data-index="${i}"><img data-index="${i}" src="${
        forem.logo
      }" style="${
        currentOrigin === forem.homePageUrl ? 'border: 4px solid white' : ''
      }" alt="${forem.name} logo" /></a></div>`;
  });

  let actionButton = '';
  let script = '';

  if (
    !subscribedOrigins.includes(currentOrigin) &&
    currentOrigin !== 'https://www.forem.com'
  ) {
    actionButton =
      '<button id="forem-action-button" aria-label="Add a Forem instance"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg></button>';
    script = `<script>
      const event = new CustomEvent("add", { detail: "${currentOrigin}" });
      document.getElementById("forem-action-button").onclick = function() { window.parent.document.dispatchEvent(event) }
    </script>`;
  } else if (currentOrigin !== 'https://www.forem.com') {
    actionButton =
      '<button id="forem-action-button" aria-label="Remove a Forem instance"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9.414l2.828-2.829 1.415 1.415L13.414 12l2.829 2.828-1.415 1.415L12 13.414l-2.828 2.829-1.415-1.415L10.586 12 7.757 9.172l1.415-1.415L12 10.586z"/></svg></button>';
    script = `<script>
      var event = new CustomEvent("remove", { detail: "${currentOrigin}" });
      document.getElementById("forem-action-button").onclick = function() { window.parent.document.dispatchEvent(event) }
    </script>`;
  }

  const dragScript = `<script>
                      var dragStartY = 0;
                      var links = document.getElementsByClassName("forem-single-link");
                      var buckets = document.getElementsByClassName("forem-link-wrapper");
                      var currentDropIndex = 0;
                      for (var i = 0; i < links.length; i++) {
                        buckets[i].ondragover = function(e) {
                          e.preventDefault();
                          currentDropIndex = e.target.dataset.index;
                          this.classList.add("drag-target");
                        };
                        buckets[i].ondragleave = function(e) {
                          e.preventDefault();
                          this.classList.remove("drag-target");
                        };
                        links[i].ondragend = function(e) {
                            var event = new CustomEvent("reorder", { detail: { startIndex: this.dataset.index, endIndex: currentDropIndex }});
                            window.parent.document.dispatchEvent(event)\
                        };
                      }
                    </script>`;

  const foremHTML = `<style>${styleCss}</style><main id="forem-sidecar" class="forem-expanded"><base target="_parent">${
    homeLink + navHTML + actionButton + script + dragScript
  }</main>`;

  const constructedSidecarIframe =
    document.getElementById('forem-sidecar') ||
    document.createElement('IFRAME');
  constructedSidecarIframe.id = 'forem-sidecar';
  constructedSidecarIframe.title = 'My Forems';
  constructedSidecarIframe.srcdoc = foremHTML;
  const newStyles = document.createElement('STYLE');
  newStyles.innerHTML =
    `#chat {padding-left:60px !important}
     .crayons-snackbar {left: 70px !important}
     .fullscreen-code { left: 60px; width: calc(100% - 60px);}
     @media (max-width: 1380px){body {padding-left:60px !important}
     .crayons-header {left: 58px !important}}
     #forem-sidecar {top:0;left:0;bottom:0;height:100vh;width:60px;border:0;z-index:100000;position:fixed}`;
  document.documentElement.appendChild(newStyles);
  document.documentElement.appendChild(constructedSidecarIframe);

  // Adding getting started indicator if no forems are installed.
  if (
    currentOrigin !== 'https://www.forem.com' &&
    forems.length === 0 &&
    !document.getElementById('forem-gettingstarted')
  ) {
    const gettingStartedDiv = document.createElement('DIV');
    gettingStartedDiv.id = 'forem-gettingstarted';
    gettingStartedDiv.innerHTML =
      '👈 Use the + button to save a forem in your switcher';
    newStyles.innerHTML =
      newStyles.innerHTML +
      '#forem-gettingstarted { position: fixed; left: 70px; bottom: 10px; background: black; color: white;padding: 10px 15px; border-radius: 8px; z-index:999}';
    document.documentElement.appendChild(gettingStartedDiv);
  }
}

function handleAdd(_event) {
  chrome.storage.sync.get(['subscribedForems', 'allforems', 'customforems'], function (result) {
    const forems = result.subscribedForems;
    const customForems = result.customforems;
    const newForem = result.allforems.concat(customForems).filter(function (f) {
      return f.homePageUrl === currentOrigin;
    });
    forems.push(newForem[0]);
    chrome.storage.sync.set({ subscribedForems: forems }, function () {
      loadForemHTML(result.subscribedForems);
      const indicator = document.getElementById('forem-gettingstarted');
      if (indicator) {
        indicator.style.display = 'none';
      }
    });
  });
}

function handleRemove(_event) {
  chrome.storage.sync.get(['subscribedForems'], function (result) {
    const forems = result.subscribedForems;
    const currentForem = forems.filter(function (f) {
      return f.homePageUrl === currentOrigin;
    });

    const index = forems.indexOf(currentForem[0]);
    if (index > -1) {
      forems.splice(index, 1);
    }
    chrome.storage.sync.set({ subscribedForems: forems }, function () {
      loadForemHTML(result.subscribedForems);
    });
  });
}

function handleReorder(event) {
  const startIndex = event.detail.startIndex;
  const endIndex = event.detail.endIndex;
  chrome.storage.sync.get(['subscribedForems'], function (result) {
    let forems = result.subscribedForems;
    forems = arrayMove(forems, startIndex, endIndex);
    chrome.storage.sync.set({ subscribedForems: forems });
    loadForemHTML(forems);
  });
}

function addCompatibleForem() {
  const name = document.querySelector("meta[property='forem:name']");
  const logo = document.querySelector("meta[property='forem:logo']");
  const domain = document.querySelector("meta[property='forem:domain']");
  chrome.storage.sync.get('customforems', function (result) {
    const allForems = result['customforems'] || [];
    if (domain && allForems && !arrayContainsUrl("https://"+domain.content, allForems)) {
      allForems.push({
        "homePageUrl": "https://"+domain.content,
        "logo": logo.content,
        "name": name.content
      })
      chrome.storage.sync.set({ customforems: allForems })
      initializeForemLogic();
    }
  });
}

function validOrigins(forems) {
  return forems.map(function (f) {
    return f.homePageUrl;
  });
}

function myOrigins(myForems) {
  return myForems.map(function (f) {
    return f.homePageUrl;
  });
}

function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}

function arrayContainsUrl(url, myArray){
  for (var i=0; i < myArray.length; i++) {
    if (myArray[i]['homePageUrl'] === url) {
        return myArray[i];
    }
  }
}
