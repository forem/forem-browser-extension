const backgroundColor = "#d7d9e0";
const currentOrigin = window.location.origin;
chrome.storage.sync.get(['subscribedForems'], function(result) {
  var myForems = result.subscribedForems;
  if (myOrigins(myForems).includes(currentOrigin) || validOrigins().includes(currentOrigin) || currentOrigin === 'https://www.forem.com') {
      loadForemHTML(result.subscribedForems);
    document.addEventListener('add', handleAdd, false);
    document.addEventListener('remove', handleRemove, false);
    document.addEventListener('reorder', handleReorder, false);

  }
});


function loadForemHTML(forems) {

  var foremSidecarStyles = `position:fixed;left:0;bottom:0;top:0px;background:${backgroundColor};z-index:1000;width:100%`;
  var imageStyle = `width:calc(38px + 1.1vw);height:calc(38px + 1.1vw);margin:calc(7px + 0.1vw) auto;border-radius:10px;display:block;background:#cacdd9;border:4px solid ${backgroundColor};`
  var hoverStyle = 'opacity:0.8;'
  var actionButtonStyle = 'position:fixed;left:0px;bottom:0px;right:0;background:transparent;border:0;cursor:pointer;text-align:center;width:100%;padding:10px 0px;'
  var styleCss = `
    #forem-sidecar {${foremSidecarStyles}}
    #forem-sidecar img {${imageStyle}}
    #forem-sidecar img:hover, #forem-sidecar svg:hover {${hoverStyle}}
    #forem-action-button {${actionButtonStyle}}
    .drag-target img {opacity:0.2;}
    .forem-expanded {left: 0 !important;}
  `;

  
  var homeLink = `<a href="https://www.forem.com" rel="noreferrer"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--ppabDsgB--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://www.forem.com/seedling.png" /></a>`
  var navHTML = ''
  var subscribedOrigins = []
  forems.forEach(function(forem, i){
    subscribedOrigins.push(forem.homePageUrl)
    navHTML = navHTML + `<div class="forem-link-wrapper" data-index="${i}"><a id="forem-link-${i}" href="${forem.homePageUrl}" draggable="true" class="forem-single-link" data-index="${i}"><img data-index="${i}" src="${forem.logo}" style="${(currentOrigin === forem.homePageUrl ? 'border: 4px solid white' : '')}" /></a></div>`
  })

  var actionButton = '';
  var script = ''
  
  if (!subscribedOrigins.includes(currentOrigin)) {
    actionButton = '<button id="forem-action-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg></button>'
    script = `<script>
      var event = new CustomEvent("add", { detail: "${currentOrigin}" });
      document.getElementById("forem-action-button").onclick = function() { window.parent.document.dispatchEvent(event) }
    </script>`
  } else {
    actionButton = '<button id="forem-action-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9.414l2.828-2.829 1.415 1.415L13.414 12l2.829 2.828-1.415 1.415L12 13.414l-2.828 2.829-1.415-1.415L10.586 12 7.757 9.172l1.415-1.415L12 10.586z"/></svg></button>'
    script = `<script>
      var event = new CustomEvent("remove", { detail: "${currentOrigin}" });
      document.getElementById("forem-action-button").onclick = function() { window.parent.document.dispatchEvent(event) }
    </script>`
  }

  var dragScript = `<script>
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
                    </script>`

  var foremHTML = `<style>${styleCss}</style><div id="forem-sidecar" class="forem-expanded"><base target="_parent">${homeLink+navHTML+actionButton+script+dragScript}</div>`;

  
  var constructedSidecarIframe = document.getElementById("forem-sidecar") || document.createElement ("IFRAME");
  constructedSidecarIframe.id="forem-sidecar";
  constructedSidecarIframe.srcdoc = foremHTML;
  constructedSidecarIframe.style.top = "0"
  constructedSidecarIframe.style.left = "0"
  constructedSidecarIframe.style.bottom = "0"
  constructedSidecarIframe.style.height = "100vh"
  constructedSidecarIframe.style.width = "60px"
  constructedSidecarIframe.style.position = "fixed"
  constructedSidecarIframe.style.border = "0"
  constructedSidecarIframe.style.border = "0"
  constructedSidecarIframe.style.zIndex = "100000"
  document.documentElement.appendChild (constructedSidecarIframe);  

}

function handleAdd(event) {
  chrome.storage.sync.get(['subscribedForems'], function(result) {
    var forems = result.subscribedForems;
    var newForem = allForems().filter(function(f) { 
      return f.homePageUrl === currentOrigin;
     })
    forems.push(newForem[0])
    chrome.storage.sync.set({subscribedForems: forems}, function() {
      loadForemHTML(result.subscribedForems);
    });
    
  });
}

function handleRemove(event) {
  chrome.storage.sync.get(['subscribedForems'], function(result) {
    var forems = result.subscribedForems;
    var currentForem = forems.filter(function(f) { 
      return f.homePageUrl === currentOrigin;
     })

    const index = forems.indexOf(currentForem[0]);
    if (index > -1) {
      forems.splice(index, 1);
    }
    chrome.storage.sync.set({subscribedForems: forems}, function() {
      loadForemHTML(result.subscribedForems);
    });
  });
}

function handleReorder(event) {
  var startIndex = event.detail.startIndex;
  var endIndex = event.detail.endIndex;
  chrome.storage.sync.get(['subscribedForems'], function(result) {
    var forems = result.subscribedForems;
    forems = arrayMove(forems, startIndex, endIndex);
    chrome.storage.sync.set({subscribedForems: forems});
    loadForemHTML(forems);
  });
}


function validOrigins() {
  return allForems().map(function(f){ return f.homePageUrl })
}

function myOrigins(myForems) {
  return myForems.map(function(f){ return f.homePageUrl })
}


function allForems() {
  // Hardcoded for now. Replace this with something like a forem.com/valid_forems.json call
  // Basically we want to check against valid forems and grow over time.
  return [
    {
      name: "DEV",
      logo: "https://res.cloudinary.com/practicaldev/image/fetch/c_scale,fl_progressive,q_auto,w_180/f_auto/https://practicaldev-herokuapp-com.freetls.fastly.net/assets/devlogo-pwa-512.png",
      homePageUrl: "https://dev.to"
    },
    {
      name: "ThisMMALife",
      logo: "https://res.cloudinary.com/hkyugldxm/image/fetch/c_scale,fl_progressive,q_auto,w_180/f_auto/https://thismmalife-images.s3-us-west-2.amazonaws.com/social/primary-sticker-image-url.png",
      homePageUrl: "https://www.thismmalife.com"
    },
    {
      name: "Ben Halpern",
      logo: "https://res.cloudinary.com/hatyrxu64/image/fetch/c_scale,fl_progressive,q_auto,w_180/f_auto/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/1/f451a206-11c8-4e3d-8936-143d0a7e65bb.png",
      homePageUrl: "https://community.benhalpern.com"
    },
    {
      name: "Let's Build",
      logo: "https://res.cloudinary.com/dr4ma05jp/image/fetch/c_scale,fl_progressive,q_auto,w_180/f_auto/https://res.cloudinary.com/dr4ma05jp/image/upload/v1589859417/500x500_gvlpml.png",
      homePageUrl: "https://letsbuild.gg"
    }
  ]
}

function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};


