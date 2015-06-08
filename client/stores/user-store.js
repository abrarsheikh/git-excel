var Biff = require("../biff");
var _ = require("lodash");

// Creates a DataStore
var UserStore = Biff.createStore({
  // Initial setup
  token: null,
  github: null,
  tokenValid: false,

  updateRecipeIngredientList: function (_id, index) {
    var recipe = this.getRecipe(_id);
    if (index || index === 0) {
      // Delete operation
      recipe.ingredients.splice(index, 1);
    } else {
      // Create operation
      recipe.ingredients.push(
        {
          ingredient: "",
          quantity: "",
          measurement: "",
          modifier: ""
        }
      );
    }
  },

  updateRecipe: function (data) {
    var recipe = this.getRecipe(data._id);
    if (data.index || data.index === 0) {
      recipe.ingredients[data.index][data.accessor] = data.value;
    } else {
      recipe[data.accessor] = data.value;
    }
  },

  updatePortions: function (data) {
    // TODO: validate data
    var recipe = this.getRecipe(data._id);

    if (recipe.portions !== data.portions) {
      var multiplier = data.portions / recipe.portions;
      recipe.ingredients.map(function (ing) {
        ing.quantity = ing.quantity * multiplier;
      });

      recipe.portions = data.portions;
    }
  },

  loadRecipes: function (recipes) {
    this._recipes = recipes;
  },

  createRecipe: function (recipe) {
    this._recipes.push(recipe);
  },

  createIngredient: function () {},

  deleteRecipe: function (_id) {
    _.remove(this._recipes, { _id: _id });
  },

  getRecipe: function (_id) {
    return _.find(this._recipes, { _id: _id });
  },

  getRecipes: function () {
    return this._recipes;
  }
}, function (payload) {
  if (payload.actionType === "SIGNIN_FAILED") {
    this.tokenValid = false;
    this.emitChange();
  }
  if (payload.actionType === "SIGNIN_SUCCESS") {
    this.tokenValid = true;
    this.token = payload.token;
    this.github = payload.github;
    this.emitChange();
  }
});

module.exports = UserStore;
