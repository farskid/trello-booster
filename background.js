// browser polyfill
const browser = chrome || browser;

function errorHandler(err) {
  console.error(err);
}

function isBoardPage(url) {
  return url.match('https://trello.com/b/*');
}

function readFileContent(fileName) {
  return new Promise((resolve, reject) => {
    browser.runtime.getPackageDirectoryEntry(function(root) {
      root.getFile(
        fileName,
        {},
        function(fileEntry) {
          fileEntry.file(function(file) {
            const reader = new FileReader();
            reader.onloadend = function(e) {
              // contents are in this.result
              resolve(this.result);
            };
            reader.readAsText(file);
          }, reject);
        },
        reject
      );
    });
  });
}

// Definitions
let lastTabUrl = '';

// Listeners
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Tab changes
  if (tab.url !== lastTabUrl) {
    // set lastTabUrl
    lastTabUrl = tab.url;
    console.log('Tab Changed');

    // Run extension only on board page
    if (isBoardPage(tab.url)) {
      // Read trello-booster.js and execute it
      readFileContent('trello-booster.js')
        .then(content => {
          browser.tabs.executeScript({
            code: `${content}`
          });
        })
        .catch(console.error);
    }
  }
});
