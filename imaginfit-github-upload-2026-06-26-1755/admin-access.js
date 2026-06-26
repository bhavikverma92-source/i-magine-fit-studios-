(function () {
  const localHosts = new Set(["", "localhost", "127.0.0.1", "::1", "0.0.0.0"]);
  const host = window.location.hostname;
  const isLocalAccess = window.location.protocol === "file:" || localHosts.has(host);

  window.IMAGINFIT_OPERATOR_ALLOWED = isLocalAccess;

  if (isLocalAccess) return;

  document.documentElement.style.display = "none";
  window.addEventListener("DOMContentLoaded", () => {
    window.location.replace("./index.html");
  });
})();
