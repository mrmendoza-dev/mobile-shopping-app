import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import { useState, useEffect } from "react";

import "./App.css";
const appSettings = {
  databaseURL:
    "https://shopping-list-f7df4-default-rtdb.firebaseio.com/",
};
import catLogo from "./assets/cat.png";

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

function App() {
  const [inputValue, setInputValue] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const handleAddButtonClick = () => {
    push(shoppingListInDB, inputValue);
    setInputValue("");
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleItemDelete = (itemID: any) => {
    const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  };

  useEffect(() => {
    onValue(shoppingListInDB, (snapshot) => {
      if (snapshot.exists()) {
        const itemsArray: any = Object.entries(snapshot.val());
        setShoppingList(itemsArray);
      } else {
        setShoppingList([]);
      }
    });
  }, []);

  return (
    <div className="container">
      <img src={catLogo} alt="Logo" />
      <input
        type="text"
        id="input-field"
        placeholder="Bread"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button id="add-button" onClick={handleAddButtonClick}>
        Add to cart
      </button>
      <ul id="shopping-list">
        {shoppingList.length > 0 ? (
          shoppingList.map((item) => (
            <li key={item[0]} onClick={() => handleItemDelete(item[0])}>
              {item[1]}
            </li>
          ))
        ) : (
          <p>No items here... yet</p>
        )}
      </ul>
    </div>
  );
}

export default App;
