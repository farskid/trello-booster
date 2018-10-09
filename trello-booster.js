(function TrelloBooster(global) {
  console.log('TrelloBooster running');

  // Initialize elements
  function _initilizeElements() {
    const $board = global.getElementById('board');
    const $lists = $board.querySelectorAll('.js-list');

    return {
      $board,
      $lists
    };
  }

  function _createLoading() {
    const loading = document.createElement('div');
    loading.classList.add('trello-booster-loading');
    loading.id = 'js-trello-booster-loading';
    loading.innerHTML = `
<svg width="55" height="80" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="#FFF">
    <g transform="matrix(1 0 0 -1 0 80)">
        <rect width="10" height="20" rx="3">
            <animate attributeName="height"
                 begin="0s" dur="4.3s"
                 values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear"
                 repeatCount="indefinite" />
        </rect>
        <rect x="15" width="10" height="80" rx="3">
            <animate attributeName="height"
                 begin="0s" dur="2s"
                 values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear"
                 repeatCount="indefinite" />
        </rect>
        <rect x="30" width="10" height="50" rx="3">
            <animate attributeName="height"
                 begin="0s" dur="1.4s"
                 values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear"
                 repeatCount="indefinite" />
        </rect>
        <rect x="45" width="10" height="30" rx="3">
            <animate attributeName="height"
                 begin="0s" dur="2s"
                 values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear"
                 repeatCount="indefinite" />
        </rect>
    </g>
</svg> <p>Sorting lists</p>`;
    return loading;
  }

  // Create list object from trello list in DOM
  function _createList($listElem) {
    const listName = $listElem.querySelector('.js-list-name-input').value;
    const cardsCount = (
      $listElem.querySelectorAll('.js-list-cards > a.list-card') || []
    ).length;
    return { name: listName, cardsCount };
  }

  // Sort lists DESC from left to right based on amount of cards
  function _sortLists($board) {
    const children = Array.from($board.children);

    // remove children
    children.forEach(child => {
      $board.removeChild(child);
    });

    // sort children
    children.sort((a, b) => {
      const aName = (a.querySelector('.js-list-name-input') || {}).value;
      const aCards = a.querySelectorAll('.js-list-cards > a.list-card') || [];
      const bName = (b.querySelector('.js-list-name-input') || {}).value;
      const bCards = b.querySelectorAll('.js-list-cards > a.list-card') || [];

      return aCards.length > bCards.length
        ? -1
        : aCards.length < bCards.length
          ? 1
          : 0;
    });

    // re-append sorted children
    children.forEach(child => {
      $board.appendChild(child);
    });
  }

  // Add cards counter next to list name
  function _addCardsCounter($list) {
    const badge = document.createElement('div');
    badge.classList.add('trello-booster-badge');
    badge.innerText = (
      $list.querySelectorAll('.js-list-cards > a.list-card') || []
    ).length;

    const listHeader = $list.querySelector('.js-list-header');
    if (listHeader) {
      listHeader.insertBefore(badge, listHeader.firstChild);
    }
  }

  // Runner closure
  (function run() {
    // Inject loading
    global.body.appendChild(_createLoading());

    setTimeout(() => {
      // Define elements
      const elements = _initilizeElements();

      // Sort
      _sortLists(elements.$board);

      // Add cards counter badge
      Array.from(elements.$board.children).forEach(_addCardsCounter);

      // terminate loading
      global.body.removeChild(
        document.getElementById('js-trello-booster-loading')
      );
    }, 2000);
  })();
})(document);
