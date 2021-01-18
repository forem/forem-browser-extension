# Forem Browser Extension 🌱

Everyone is free to download and use this Chrome extension.

This extension will eventually be listed in the Chrome Store, but in the
meantime we are loading from this source. You will be alerted when there is a
new beta version available for download.

## [👉 How to install Chrome extensions from GitHub](https://dev.to/ben/how-to-install-chrome-extensions-manually-from-github-1612)

Installation is just a few clicks. Follow the guide to get started.

## [👉 Building and installing the Safari Web Extension](https://developer.apple.com/documentation/safariservices/safari_app_extensions/building_a_safari_app_extension#2957926)

Follow the linked guide sections to build and unsigned version of the Safari Web Extension and install it in Safari.

## About this extension

This is a fairly functional work-in-progress. Let's try to keep it clean and
functionally minimal as we evolve it.

- Currently the code is written for Chrome, but this should be able to share 99%
  of the code with Firefox as long as we take care to do that early on.
- The Safari version uses Safari Web Extensions: a native MacOS app wraps the plugin Javascript code
- Forem logo is a placeholder.
- Link to forem.com should link to a functional page, probably with discovery of
  new forems etc.
- We should add service workers to that functional forem.com page to remove the
  "flicker" when navigating there.
- The content is placed in an iframe to preserve privacy so other forems
  couldn't read other parts of the HTML and figure out where else you've been. I
  _think_ this is generally private in terms of chrome storage, but let's be
  really sure about that. Forems should not be able to see what other forems you
  are subscribed to (unless for some future explicitely opted-in feature if that
  were to be relevant)
- The application fetches compatible/good standing forems from
  `forem.com/valid_forems.json`
