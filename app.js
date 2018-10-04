// Local Storage Controller

// Food Item Controller
const ItemCtrl = (function(){
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: [
      { id: 0, name: 'Placeholder meal', calories: 59768 },
      { id: 1, name: 'Other placeholder meal', calories: 9768 },
      { id: 2, name: 'Yet another placeholder', calories: 768 }
    ],
    // Item being currently modified
    currentItem: null,
    totalCalories: 0
  };

  // Public methods returned to make them available outside module
  return {
    getItems() {
      return data.items;
    },
    logData() {
      return data;
    }
  };
})();


// UI Controller
const UiCtrl = (function () {
  // Assigning selectors here for easier future modification
  const uiSelectors = {
    itemList: '#item-list'
  };

  return {
    populateList(items) {
      // Create <ul> html content
      let listHtml = '';
      items.forEach((item) => {
        listHtml += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a>
        </li>
        `;
      });

      // insert <li> elements
      document.querySelector(uiSelectors.itemList).innerHTML = listHtml;
    }
  };

})();


// Main Controller
const App = (function (ItemCtrl, UiCtrl) {

  return {
    init: function() {
      // Get items from data structure
      const items = ItemCtrl.getItems();
      // Populate list with items
      UiCtrl.populateList(items);
    }
  };

})(ItemCtrl, UiCtrl);


App.init();

