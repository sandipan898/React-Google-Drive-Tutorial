export const loadGoogleScript = () => {
  // Loads the Google JavaScript Library
  (function () {
    const id = 'google-js';
    const src = 'https://apis.google.com/js/api.js'; // (Ref. 1)

    // We have at least one script (React)
    const firstScript = document.getElementsByTagName('script')[0]; // (Ref. 2)

    // Prevent script from loading twice
    if (document.getElementById(id)) {
      return;
    } // (Ref. 3)
    const gScript = document.createElement('script'); // (Ref. 4)
    gScript.id = id;
    gScript.src = src;
    gScript.onload = window.onGoogleScriptLoad; // (Ref. 5)
    firstScript.parentNode.insertBefore(gScript, firstScript);
  })();
};
