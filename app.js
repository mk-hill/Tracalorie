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
      { id: 0, name: 'Other placeholder meal', calories: 9768 },
      { id: 0, name: 'Yet another placeholder', calories: 768 }
    ],
    // Item being currently modified
    currentItem: null,
    totalCalories: 0
  };

  // Public methods returned to make them available outside module
  return {
    logData: function() {
      return data;
    }
  };
})();


// UI Controller
const UiCtrl = (function () {

  return {

  };

})();


// Main Controller
const App = (function (ItemCtrl, UiCtrl) {

  return {
    init: function() {
      console.log('init app');
    }
  };

})(ItemCtrl, UiCtrl);


App.init();
