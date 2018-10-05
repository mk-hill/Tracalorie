//
// ─── LOCAL STORAGE CONTROLLER ───────────────────────────────────────────────────
//


const StorageCtrl = (function () {
  // Public methods
  return {
    getStoredItems() {
      // Check storage, return parsed data or empty array if none
      const storedItems = localStorage.getItem('items');
      return storedItems ? JSON.parse(storedItems) : [];
    },

    setStoredItems(items) {
      // Local storage stores strings by default
      localStorage.setItem('items', JSON.stringify(items));
    },

    storeItem(item) {
      const items = this.getStoredItems();
      items.push(item);
      this.setStoredItems(items);
    },

    updateStoredItem(updatedItem) {
      const items = this.getStoredItems();
      items.forEach((item, index) => {
        // Replace item with matching id
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      this.setStoredItems(items);
    },

    deleteStoredItem(id) {
      const items = this.getStoredItems();
      items.forEach((item, index) => {
        // Delete item with matching id
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      this.setStoredItems(items);
    },

    clearStorage() {
      localStorage.clear();
    }
  };
})();
  

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
    // items: [
    //   // No longer need placeholder data
    //   // { id: 0, name: 'Placeholder meal', calories: 59768 },
    //   // { id: 1, name: 'Other placeholder meal', calories: 9768 },
    //   // { id: 2, name: 'Yet another placeholder', calories: 768 }
    // ],
    items: StorageCtrl.getStoredItems(),

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

    deleteItem(id) {
      // Map ids into an array
      const idsArr = data.items.map(item => item.id);
      
      // Get index - may not always be equal to id if there was deletion earlier
      const index = idsArr.indexOf(id);
      
      // Remove item
      data.items.splice(index, 1);
      // Probably a good idea to reset currentItem as well
      data.currentItem = null;
    },

    clearAll() {
      data.items =[];
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
    cardTitle: '.card-title',
    itemList: '#item-list',
    listItems: '#item-list li',
    clearBtn: '.clear-btn',
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

    // ? Could just use populateList() instead of add/update/del below ?
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

    deleteListItem(id) {
      const itemId = `item-${id}`;
      const item = document.getElementById(itemId);
      item.remove();
      // Hide empty <ul> if the last item was removed
      const itemsLeft = ItemCtrl.getItems().length;
      if (!itemsLeft) {
        this.hideList();
      }
    },

    clearList() {
      // Inner html clear appears to perform faster
      let itemList = document.querySelector(uiSelectors.itemList);
      itemList.innerHTML = '';
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

    showDefaultTitle() {
      const cardTitle = document.querySelector(uiSelectors.cardTitle);
      cardTitle.textContent = 'Add Meal / Food Item';
    },

    showDefaultState() {
      UiCtrl.clearInput();
      UiCtrl.showDefaultTitle();
      document.querySelector(uiSelectors.updateBtn).style.display = 'none';
      document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(uiSelectors.backBtn).style.display = 'none';
      document.querySelector(uiSelectors.addBtn).style.display = 'inline';
    },

    showEditTitle() {
      const currentItem = ItemCtrl.getCurrentItem();
      const cardTitle = document.querySelector(uiSelectors.cardTitle);
      cardTitle.textContent = `Edit ${currentItem.name}`;
    },

    showEditState() {
      UiCtrl.showEditTitle();
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

  
const App = (function (ItemCtrl, UiCtrl, StorageCtrl) {
  const updateTotalCals = () => {
    // Calculate and show total calories
    const totalCals = ItemCtrl.calcTotalCals();
    UiCtrl.showTotalCals(totalCals);
  };

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

      updateTotalCals();
      
      // Add to local storage
      StorageCtrl.storeItem(newItem);
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
    updateTotalCals();

    // Update local storage
    StorageCtrl.updateStoredItem(updatedItem);

    // Go back to default state after update is complete
    UiCtrl.showDefaultState();
    e.preventDefault();
  };

  const itemDeleteSubmit = (e) => {
    const currentItem = ItemCtrl.getCurrentItem();
    // Send id to ItemCtrl for deletion
    ItemCtrl.deleteItem(currentItem.id);
    
    // Same with ui so its removed from the render
    UiCtrl.deleteListItem(currentItem.id);

    // From storage as well
    StorageCtrl.deleteStoredItem(currentItem.id);

    // Revert ui state
    UiCtrl.showDefaultState();

    updateTotalCals();
    e.preventDefault();
  };

  const clearAllClick = (e) => {
    // Delete all items from data structure
    ItemCtrl.clearAll();
    
    // Update total calcs and hide empty <ul>
    updateTotalCals();
    UiCtrl.hideList();
    
    // Wipe all items from ui
    UiCtrl.clearList();

    // Clear inputs and revert to default state
    // In case they were editing an item which no longer exists
    UiCtrl.showDefaultState();
    
    // Clear local storage
    StorageCtrl.clearStorage();
    e.preventDefault();
  };

  const loadEventListeners = () => {
    const uiSelectors = UiCtrl.getSelectors();

    // Disable submit on enter - otherwise users can add copy of item while in edit state
    document.addEventListener('keypress', (e) => {
      // Some browsers don't appear to support keycode
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Add item event
    document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit item event - <li> not present on DOM load, delegating event
    document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button event
    document.querySelector(uiSelectors.backBtn).addEventListener('click', UiCtrl.showDefaultState);

    // Delete item event
    document.querySelector(uiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear all items event
    document.querySelector(uiSelectors.clearBtn).addEventListener('click', clearAllClick);
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
        updateTotalCals();
      }
      loadEventListeners();
    }
  };

})(ItemCtrl, UiCtrl, StorageCtrl);

// ────────────────────────────────────────────────────────────────────────────────

App.init();
