// Lesson 09.03 Cocktail API
console.log('updated')

// Given cocktail keywords for making select options:
const cocktailkKeywords = [
    "Amaretto", "Beer", "Black", "Bloody", "Bourbon", "Fizz",
    "Brandy", "Cherry", "Chocolate", "Coffee", "Coke", "Cream",
    "Gin", "Green","Iced", "Island", "Lemon", "Lime", "Liqueur", 
    "Milk", "Orange", "Red", "Rum", "Salt", "Scotch", "Soda", 
    "Sour", "Spiced", "Tea", "Tequila", "Vodka", "Whiskey", "Wine",
    "Royal", "Punch", "Peach", "Cranberry", "Russian", "Captain", 
    "Port", "Cooler", "Smash", "Cocktail", "Irish", "Jamaican",
    "Tonic", "Slammer", "Apple", "Grape", "Cider", "High", "Long",
    "Caribbean", "Hot", "Almond", "Shot", "-", "Sweet", "Old",
    "Banana", "Classic", "Electric", "Big", "Bermuda", "English",
    "Italian", "Smoothie", "Ginger", "Banana", "Papaya", "Frozen",
    "Pineapple", "Kiwi", "Rose", "Blue", "Mojito", "Martini",
    "French", "Mango", "Negroni", "Golden", "Night", "Cold", 
    "Mint", "Daiquiri", "Margarita", "Smash", "Shake", " and ", 
    "Sling", "Berry", "Champagne", "Jack", "Hawaii", "Cordial", 
    "Fruit", "Spring", "Spice", "Toddy", "Watermelon", "Lassi", "&" 
];

const letters = "ABCDEFGHIJKLMNOPQRSTVWYZ"; // for making letter buttons
// for (let l = 'A'; l <= 'Z'; l = String.fromCharCode(l.charCodeAt(0) + 1)) {

const btnBox = document.getElementById('btn-box');

letters.split("").forEach(e => {
    console.log('letters',e)
    const button = document.createElement('button');
    button.className = 'letter-btn';
    button.textContent = e; // each btn displays its letter
    button.id = e.toLowerCase(); // id='a' etc.
    button.addEventListener('click', getCocktail);
    btnBox.appendChild(button);
});
cocktailkKeywords.sort(); // sort() menu (A-Z)

const menu = document.getElementById('menu'); // Get the select menu
// Call getCocktail function when menu is changed
menu.addEventListener('change', getCocktail);

// Populate menu w options from the cocktailkKeywords array: 
// Iterate array, making a menu option for each item: 
cocktailkKeywords.forEach(e => {
    const option = document.createElement('option');
    option.value = e.toLowerCase(); // cordial not Cordial
    option.text = e;
    menu.appendChild(option);
});

// const checkbox = document.getElementById('show-all'); // Get checkbox

const search = document.getElementById('search-box'); // Get search input
// Call getCocktail function when user hits Enter from inside search box:
search.addEventListener('search', getCocktail);

// Get the Random Cocktail button:
const randBtn = document.querySelector('button');
randBtn.addEventListener('click', getCocktail);

// Get the cocktail box where cocktail(s) appear as divs,
// one div per cocktail, each div containing img and text:
const cocktailBox = document.getElementById('cocktail-box'); 

// Define the getCocktail function:
function getCocktail() {
    // Declare the url variable and set it to the "base url":
    let url = "https://thecocktaildb.com/api/json/v1/1/";
    // Check if object calling function has a value:
    // empty search box (empty string "") is falsey:
    // this.value exists only for select menu AND search box (NOT for btns)
    if(this.value) { // btns don't have values, but search box and menu do
        // obj calling function has a value (string)
        url += `search.php?s=${this.value}`;
        console.log(url)
        // so concat that string value onto end of url:
        // "s=lime" queries db for "lime" in cocktail name
    } else { // a button called the func BUT what kind of btn: Letter or Random?
        // if(this.id) { // Random Btn has no id so this.id is false for Random
            // this is a letter button:
            // "f=a" queries db for cocktails starting with "a"
        //     url += `search.php?f=${this.id}`; // f= search by starts with letter
        // } else { // btn has no id so must be the Rand Btn
        //     url += `random.php`;
        // }
        // OR: a ternary instead of above if-else:
        url += this.id ? `search.php?f=${this.id}` : `random.php`;
    }

    // If it's not the search box calling, clear search box:
    if(this.id != 'search-box') search.value = "";

    // If it's not the menu calling, reset select menu to index 0
    if(this.id != 'menu') menu.selectedIndex = 0;

    // Send fetch() request with url and GET method:
    fetch(url, {method:"GET"})
        console.log(url)
      
    // .then() No. 1: Handle the response by parsing the json
    .then(res => res.json())
            console.log('res',res)
    // .then() No. 2: Handle the parsed object by outputting data:
    .then(obj => {

        console.log('obj.drinks:', obj.drinks); // result returns one obj called "drinks"
        // the value of which is an array, one array item per drink
        
        // Clear the cocktail box from last search:
        cocktailBox.innerHTML = '';

        // object has a drinks property, which is an array
        // Sort results by strDrink key (drink name), from A-Z.
        // To sort array of objects by string key, use sort()
        // callback algo with (a,b) (see Sortable Movies for help)
        obj.drinks.sort((a,b) => a.strDrink > b.strDrink ? 1 : -1);
    
        // Iterate the drinks array:
        obj.drinks.forEach(e => {

            // make drinkDiv to hold drink as picture and text
            const drinkDiv = document.createElement('div');
            drinkDiv.className = 'drink-div';
            cocktailBox.appendChild(drinkDiv);
            
            // make an h2 to hold drink name and append h1 in drinkDiv
            const h2 = document.createElement('h2');
            h2.textContent = e.strDrink; // ex: Long Island Iced Tea
            drinkDiv.appendChild(h2);

            // make drinkInfoP to hold drink info and append it to textDiv
            const instructionsP = document.createElement('p');
            instructionsP.textContent = e.strInstructions;
            drinkDiv.appendChild(instructionsP);

            // make a ul to hold ingredients list and appeand it to textDiv 
            const ul = document.createElement('ul');
            // display top 5 ingredients as bulleted list
            for(let i = 1; i <= 5; i++) {
                let ingrKey = "strIngredient" + i;
                let measKey = "strMeasure" + i;
                if(e[ingrKey]) { // if this ingredient is not null
                    const li = document.createElement('li');
                    li.textContent = `${e[ingrKey]} (${e[measKey]})`;
                    ul.appendChild(li);
                }
            }
            drinkDiv.appendChild(ul);

            const drinkPic = new Image();
            drinkPic.src = e.strDrinkThumb;
            drinkDiv.appendChild(drinkPic);

            //
            
            // loop the ingredients + measures array, where these are consecutive items
            // increment by += 2 each time to get pairs: ingredient + measure
            
                // make li to put in ul; each li is one ingredient
                // const li = document.createElement('li');
                // add the ingredient and its measure as the text of the list item:

            // the ingredients come in as separate properties: 
            // 'strIngredient1': 'rum', 'strIngredient2': 'ginger ale', etc.
            // all obj have same number of 'strIngredientN' properties, so some of them 
            // are null; this makes outputting ingredients list difficult
            // start by getting all the non-null ingredients into an array of strings:
      
                // if key includes 'strIngredient', it is an ingredient
                // if drink[key] is true, the key is not null (not falsey)

                // Tequila Sour lists "lemon" twice as an ingredient
                    // so only push not-yet-included ingredients into array:
           
                        // add the correspondingly numberered strMeasure to the array,
                        // getting the number from the last char of strIngredient
              
            // make a new image to hold the drink pic
            // set its source to strDrinkThumb and append to drinkDiv

        }); // end drinksArr.forEach(e => {

    }); // .then #2 end
      
    // .catch(err => console.log("Something went wrong", err))
}; 


