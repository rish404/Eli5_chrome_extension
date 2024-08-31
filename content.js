let overlay;
let responseBox;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);

  if (request.action === "processText") {
    console.log('Processing text:', request.text);
    showOverlay("Processing...");
    chrome.runtime.sendMessage({ action: "callChatGPT", text: request.text });
  } else if (request.action === "displayResponse") {
    console.log('Displaying response:', request.response);
    showResponse(request.response);
  } else if (request.action === "displayError") {
    console.log('Displaying error:', request.error);
    showError(request.error);
  }
});

function showOverlay(message) {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div style="background-color: white; padding: 20px; border-radius: 5px;">
      <p>${message}</p>
      <div class="spinner"></div>
    </div>
  `;
  overlay.style.display = 'flex';
}

function showResponse(response) {
  if (!responseBox) {
    responseBox = document.createElement('div');
    responseBox.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      max-width: 300px;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 15px;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
    `;
    document.body.appendChild(responseBox);
  }
  responseBox.innerHTML = `
    <h3 style="color: #333; margin-top: 0; margin-bottom: 10px;">ChatGPT Response:</h3>
    <p style="color: black; line-height: 1.4; margin-bottom: 15px;">${response}</p>
    <button id="closeResponse" style="
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      color: black;
    ">Close</button>
  `;
  responseBox.style.display = 'block';
  overlay.style.display = 'none';

  document.getElementById('closeResponse').addEventListener('click', () => {
    responseBox.style.display = 'none';
  });
}

function showError(error) {
  showResponse(`Error: ${error}`);
}
