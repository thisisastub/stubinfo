/* Hide the page template until js/dc-runtime.js has rendered it (3s safety net). Loaded in <head>, not deferred. */
document.documentElement.classList.add("dc-pending");
setTimeout(function () { document.documentElement.classList.remove("dc-pending"); }, 3000);
