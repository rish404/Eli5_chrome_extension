document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const statusElement = document.getElementById('status');

  chrome.storage.sync.get('apiKey', (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  });

  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      statusElement.textContent = 'API key saved!';
      setTimeout(() => {
        statusElement.textContent = '';
      }, 2000);
    });
  });
});
