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
      // { id: 0, name: 'Placeholder meal', calories: 59768 },
      // { id: 1, name: 'Other placeholder meal', calories: 9768 },
      // { id: 2, name: 'Yet another placeholder', calories: 768 }
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

    addItem(name, calories) {
      // Create item ID
      let itemId;
      if (data.items.length > 0) {
        // If items already exist in data, add 1 to the last item's id
        // Which we will then assign as the new item's id
        itemId = data.items[data.items.length -1].id +1;
      } else {
        itemId = 0; 
      }

      // Parse calories as number for addition
      calories = parseInt(calories);
      // Create new item with constructor and add it to data.items array
      const newItem = new Item(itemId, name, calories);
      data.items.push(newItem);

      return newItem;
    },

    calcTotalCals() {
      let total = 0;
      // ? Could .reduce an array of all items[n].calories instead ?
      data.items.forEach((item) => {
        total += item.calories;
      });
      // Update data with result
      data.totalCalories = total;
      return data.totalCalories;
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
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCalsInput: '#item-calories',
    totalCals: '.total-calories'
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
    },

    getItemInput() {
      return {
        name: document.querySelector(uiSelectors.itemNameInput).value,
        calories: document.querySelector(uiSelectors.itemCalsInput).value
      };
    },

    addListItem(item) {
      // Show <ul> in case it was empty and hidden
      document.querySelector(uiSelectors.itemList).style.display = 'block';
      // Create <li> element, add class, append 'item-' to the item.id being passed in
      const liEl = document.createElement('li');
      liEl.className = 'collection-item';
      liEl.id = `item-${item.id}`;
      
      // Add inner html to <li> which has already been created
      liEl.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a>
        `;

      // Insert item to DOM - can use insertAdjacentElement instead of appendChild
      document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', liEl);
    },

    clearInput() {
      document.querySelector(uiSelectors.itemNameInput).value = '';
      document.querySelector(uiSelectors.itemCalsInput).value = '';
    },

    hideList() {
      document.querySelector(uiSelectors.itemList).style.display = 'none';
    },

    showTotalCals(total) {
      document.querySelector(uiSelectors.totalCals).textContent = total;
    },

    getSelectors() {
      return uiSelectors;
    }

  };

})();


// Main Controller
const App = (function (ItemCtrl, UiCtrl) {
  const itemAddSubmit = (e) => {
    // Get form input from UI Controller
    const input = UiCtrl.getItemInput();
    // Check for valid input
    if (!input.name || !input.calories) {
      M.toast({
        html: 'Enter meal name and calories.',
      });
    } else {
      // Add item to UI
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UiCtrl.addListItem(newItem);

      // Calculate total calories
      const totalCals = ItemCtrl.calcTotalCals();
      
      // Update ui with total calories
      UiCtrl.showTotalCals(totalCals);

      // Clear input fields
      UiCtrl.clearInput();
    }
    e.preventDefault();
  };

  const loadEventListeners = () => {
    const uiSelectors = UiCtrl.getSelectors();
    document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);
  };

  return {
    init: function() {
      // Get items from data structure
      const items = ItemCtrl.getItems();

      // Hide empty <ul> - use falsy instead of === 0?
      if (!items.length) {
        UiCtrl.hideList();
      } else {
        // Populate list with items from local storage
        UiCtrl.populateList(items);

        // Calculate total calories
        // ? Store separate total and fetch that instead of calculating on each load ?
        const totalCals = ItemCtrl.calcTotalCals();

        // Update ui with total calories
        UiCtrl.showTotalCals(totalCals);
      }
      loadEventListeners();
    }
  };

})(ItemCtrl, UiCtrl);


App.init();

