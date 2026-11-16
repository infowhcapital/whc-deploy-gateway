"use strict";
(async function openSecureWHCDeploy() {
  const status = document.getElementById("status");
  const open = document.getElementById("open");
  try {
    const api = "https://api.github.com/repos/infowhcapital/whc-deploy-gateway/contents/current.json?ref=main&fresh=" + Date.now();
    const response = await fetch(api, {
      cache: "no-store", mode: "cors", redirect: "error",
      headers: { "Accept": "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GATEWAY_CONFIG_UNAVAILABLE");
    const file = await response.json();
    if (file.type !== "file" || file.encoding !== "base64" ||
        typeof file.content !== "string" ||
        file.size <= 0 || file.size > 1024) {
      throw new Error("GATEWAY_CONFIG_INVALID");
    }
    const contents = atob(file.content.replace(/\s/g, ""));
    const data = JSON.parse(contents);
    if (!data || typeof data.url !== "string") {
      throw new Error("GATEWAY_URL_MISSING");
    }
    const url = new URL(data.url);
    if (url.protocol !== "https:" ||
        !/^[a-z0-9-]{5,80}\.trycloudflare\.com$/.test(url.hostname) ||
        url.port || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) {
      throw new Error("GATEWAY_URL_UNTRUSTED");
    }
    status.textContent = "De beveiligde toegang wordt geopend…";
    open.href = url.href;
    open.hidden = false;
    window.location.replace(url.href);
  } catch {
    status.textContent = "De beveiligde verbinding is tijdelijk niet beschikbaar. Probeer de pagina opnieuw.";
  }
})();
