# Forem Browser Extension 🌱

Everyone is free to download and use this Chrome extension.

This extension will eventually be listed in the Chrome Store, but in the
meantime we are loading from this source. You will be alerted when there is a
new beta version available for download.

## About this extension

This is a fairly functional work-in-progress. Let's try to keep it clean and
functionally minimal as we evolve it.

- Currently the code is written for Chrome, but this should be able to share 99%
  of the code with Firefox as long as we take care to do that early on.
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

## Working on the extension

To install the extension for development, do the following:

- Run `yarn` to install project dependencies.
- Run `yarn dev` to build the extension (it will be running in watch mode)
- Load the `dist/` folder as an unpacked browser extension. Not sure how to load
  an unpacked Chrome extension? See the
  [Getting Started](https://developer.chrome.com/extensions/getstarted)
  documentation for Chrome extensions.

As you make changes to the code, changes will be reloaded in the browser.

Note: If you do not see changes you've made being reflected in the extension
during development, you may need to manually reload the browser extension once.
This typically occurs if you stop Parcel and restart it. After that, hot
reloading resumes.

## Building the unpacked extension

- Run `yarn` to install project dependencies.
- Run `yarn build` to build the extension
- Load the `dist/` folder as an unpacked browser extension. Not sure how to load
  an unpacked Chrome extension? See the
  [Getting Started](https://developer.chrome.com/extensions/getstarted)
  documentation for Chrome extensions.
