function openReultFile() {
  createModal("");
  var items = getUrls();
  let proxyConfig = generateProxyConfig(items);
  let proxyConfigStr = JSON.stringify(proxyConfig, null, 2);
  console.log(proxyConfigStr);
  document.getElementById("w3review").innerHTML = "";
  document.getElementById("w3review").innerHTML = proxyConfigStr;

  return proxyConfigStr;
}
function getUrls() {
  var items = document.getElementsByTagName("li");
  var itemsValues = [];
  for (var i = 0; i < items.length; i++) {
    itemsValues.push(items[i].innerText.replace("\u00D7", "").trim());
  }
  return itemsValues;
}

function generateProxyConfig(urls) {
  const proxyConfig = {};
  const domainPrefixMap = {};
  urls.forEach((url) => {
      const match = url.match(/^(https?:\/\/[^/]+)(\/[^/]+)(\/.*)$/);
      if (match) {
          const [, target, prefix] = match;
          if (!domainPrefixMap[prefix]) {
              domainPrefixMap[prefix] = [target];
          }
          else if (!domainPrefixMap[prefix].includes(target)) {
              domainPrefixMap[prefix].push(target);
          }
          const targetCount = domainPrefixMap[prefix].indexOf(target);
          const key = targetCount === 0 ? `${prefix}/*` : `${prefix}${targetCount}/*`;
          const pRw = targetCount === 0 ? `${prefix}` : `${prefix}${targetCount}`;
          proxyConfig[key] = {
              target,
              secure: true,
              changeOrigin: true,
              logLevel: 'debug',
              pathRewrite: {
                  [`^${pRw}`]: prefix,
              },
          };
      }
  });
  return proxyConfig;
}

function createModal(content) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "modal";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const closeButton = document.createElement("span");
  closeButton.classList.add("close");
  closeButton.textContent = "×";
  closeButton.onclick = function (event) {
    modal.style.display = "none";
  };
  modalHeader.appendChild(closeButton);

  const title = document.createElement("h3");
  title.textContent = "proxy.conf.json";
  modalHeader.appendChild(title);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  const textarea = document.createElement("textarea");
  textarea.id = "w3review";
  textarea.textContent = content;
  modalBody.appendChild(textarea);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");

  const downloadButton = document.createElement("button");
  downloadButton.id = "btn-id";
  downloadButton.classList.add("btn", "w3-button", "w3-medium");
  downloadButton.textContent = "Download proxy.conf.json";
  downloadButton.onclick = function () {
    const text = textarea.value;
    const blob = new Blob([text], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "proxy.conf.json";
    link.click();
  };
  modalFooter.appendChild(downloadButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function () {
    document.getElementById("modal").remove();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      document.getElementById("modal").remove();
    }
  };

  let butto = document.querySelector("#btn-id");
  let text = document.querySelector("#w3review");

  butto.addEventListener("click", () => {
    let valueinput = text.value;

    let blobdtMIME = new Blob([valueinput], { type: "application/json" });
    let url = URL.createObjectURL(blobdtMIME);
    let anele = document.createElement("a");
    anele.setAttribute("download", "proxy.conf.json");
    anele.href = url;
    anele.click();
    console.log(blobdtMIME);
  });
}
