//
// ─── LOCAL STORAGE CONTROLLER ───────────────────────────────────────────────────
//

  

//
// ─── ITEM CONTROLLER ────────────────────────────────────────────────────────────
//


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
      // No longer need placeholder data
      // { id: 0, name: 'Placeholder meal', calories: 59768 },
      // { id: 1, name: 'Other placeholder meal', calories: 9768 },
      // { id: 2, name: 'Yet another placeholder', calories: 768 }
    ],

    // Item currently being modified
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

    getItemById(id) {
      let result = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          result = item;
        }
      });
      return result;
    },

    updateItem(name, calories) {
      // Calories coming from form, parse first
      calories = parseInt(calories);
      let result = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          result = item;
        }
      });
      return result;
    },

    setCurrentItem(item) {
      data.currentItem = item;
    },

    getCurrentItem() {
      return data.currentItem;
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


//
// ─── UI CONTROLLER ──────────────────────────────────────────────────────────────
//


const UiCtrl = (function () {
  // Assigning selectors here for easier future modification
  const uiSelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
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
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
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

    // ? Could just use populateList() instead of add and update below ?
    // ? but are there any performance gains from only changing one li ?
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
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;

      // Insert item to DOM - can use insertAdjacentElement instead of appendChild
      document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', liEl);
    },

    updateListItem(updatedItem) {
      //// let listItems = document.querySelectorAll(uiSelectors.listItems);
      //// Turn node list into array
      //// listItems = Array.from(listItems);
      // Node lists support forEach!
      const listItems = document.querySelectorAll(uiSelectors.listItems);
      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute('id');
        if (itemId === `item-${updatedItem.id}`) {
          document.getElementById(itemId).innerHTML = `
        <strong>${updatedItem.name}: </strong><em>${updatedItem.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;
        }
      });
    },

    clearInput() {
      document.querySelector(uiSelectors.itemNameInput).value = '';
      document.querySelector(uiSelectors.itemCalsInput).value = '';
    },

    populateEditForm() {
      document.querySelector(uiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(uiSelectors.itemCalsInput).value = ItemCtrl.getCurrentItem().calories;
    },

    hideList() {
      document.querySelector(uiSelectors.itemList).style.display = 'none';
    },

    showTotalCals(total) {
      document.querySelector(uiSelectors.totalCals).textContent = total;
    },

    showDefaultState() {
      UiCtrl.clearInput();
      document.querySelector(uiSelectors.updateBtn).style.display = 'none';
      document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(uiSelectors.backBtn).style.display = 'none';
      document.querySelector(uiSelectors.addBtn).style.display = 'inline';
    },

    showEditState() {
      UiCtrl.populateEditForm();
      document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(uiSelectors.backBtn).style.display = 'inline';
      document.querySelector(uiSelectors.addBtn).style.display = 'none';
    },

    getSelectors() {
      return uiSelectors;
    }

  };

})();


//
// ─── MAIN CONTROLLER ────────────────────────────────────────────────────────────
//

  
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

  const itemEditClick = (e) => {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id from <li> (parent of parent of event target icon)
      const elemId = e.target.parentNode.parentNode.id;

      //// Split "item-n" format html id by - in between
      //// const elemIdArr = elemId.split('-');
      //// Get actual id number, parse as number
      //// const id = parseInt(elemIdArr[1]);
      
      // ? Why not get id number straight out of html id string instead ?
      // const id = parseInt(elemId.slice(-1));
      // > Would only support 1 digit
      // >> Regex solution no doubt possible
      const id = parseInt(elemId.match(/\d+/));
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item in ItemCtrl data
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UiCtrl.showEditState();
    }
    e.preventDefault;
  };

  const itemUpdateSubmit = (e) => {
    const input = UiCtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UiCtrl.updateListItem(updatedItem);

    // Calculate and show total calories
    const totalCals = ItemCtrl.calcTotalCals();
    UiCtrl.showTotalCals(totalCals);

    // Go back to default state after update is complete
    UiCtrl.showDefaultState();
    e.preventDefault();
  };

  const loadEventListeners = () => {
    const uiSelectors = UiCtrl.getSelectors();

    // Add meal event
    document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter - otherwise users can add copy of item while in edit state
    document.addEventListener('keypress', (e) => {
      // Some browsers don't appear to support keycode
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit meal event - <li> not present on DOM load, delegating event
    document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick);

    document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
  };

  return {
    init: function() {
      UiCtrl.showDefaultState();

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

// ────────────────────────────────────────────────────────────────────────────────

App.init();
