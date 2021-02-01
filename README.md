# Forem Browser Extension 🌱

Do visit multiple forems  and wish there was an easier way to switch between them? Wish no more: the Forem browser plugin places a sidebar along the left side of your browser window to which you can add shortcuts to your favorite or more frequently visited forems!

To use: install the plugin for your browser of choice from the plugin stores below, and visit any forem instance to get started. Click the '+' icon to add a shortcut to the forem you're currently viewing to the sidebar. Shortcuts can be dragged to rearrange them, or clicking the '-' button will remove a forem from the sidebar.

# Installation

The easiest way is to install from the browser marketplae of your choice:

Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/forem/dnncmjdcbcccmddpebibkolaflnakklo?hl=en-US)

Firefox: [Firefox Add Ons](https://addons.mozilla.org/en-US/firefox/addon/forem/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

Safari: [Mac App Store](https://apps.apple.com/us/app/forem-for-safari/id1550146455?mt=12)

As an alternative, you can build and install the plugin locally (great for testing your own additions to the code!)
## [👉 How to install Chrome extensions from GitHub](https://dev.to/ben/how-to-install-chrome-extensions-manually-from-github-1612)

Installation is just a few clicks. Follow the guide to get started.

## [👉 Building and installing the Safari Web Extension](https://developer.apple.com/documentation/safariservices/safari_app_extensions/building_a_safari_app_extension#2957926)

Building requirements: MacOS SDK > 11.0.
Running requirements: Safari web extensions are available in macOS 11 and later, and in macOS 10.14.6 or 10.15.6 with Safari 14 installed.

Follow the linked guide sections to build and unsigned version of the Safari Web Extension and install it in Safari.

# Developing/Contributing

This is a fairly functional work-in-progress. Let's try to keep it clean and
functionally minimal as we evolve it.

- Currently the code was originally written for Chrome, but shares 99%
  of the code with Firefox and Safari.
- The Safari version uses Safari Web Extensions: a native MacOS app wraps the plugin Javascript code
- Forem logo is a placeholder.
- Link to forem.com should link to a functional page, probably with discovery of
  new forems etc.
- We should add service workers to that functional forem.com page to remove the
  "flicker" when navigating there.
- The content is placed in an iframe to preserve privacy so other forems
  couldn't read other parts of the HTML and figure out where else you've been. Forems should not be able to see what other forems you
  are subscribed to (unless for some future explicitely opted-in feature if that
  were to be relevant)
- The application fetches compatible/good standing forems from
  `forem.com/valid_forems.json`
