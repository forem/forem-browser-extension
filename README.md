# Forem Browser Extension

This is a fairly functional work-in-progress. Let's try to keep it clean and functionally minimal as we evolve it.

- Currently the code is written for Chrome, but I _think_ this should be able to share 99% of the code with Firefox as long as we take care to do that early on.
- Forem logo is a placeholder.
- Link to forem.com should link to a functional page, probably with discovery of new forems etc.
- We should add service workers to that functional forem page to remove the "flicker" when navigating there.
- The content is placed in an iframe to preserve privacy so other forems couldn't read other parts of the HTML and figure out where else you've been. I *think* this is generally private in terms of chrome storage, but let's be really sure about that. Forems should not be able to see what other forems you are subscribed to (unless for some future explicitely opted-in feature if that were to be relevant)

[How to install locally in Chrome](https://medium.com/@FGrante/how-to-install-a-chrome-extension-without-using-the-chrome-web-store-31902c780034)