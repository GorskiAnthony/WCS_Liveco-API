import { useState, useEffect } from "react";
import instance from "./services/axios";
import "./App.css";

function App() {
  /**
   * Nous allons utiliser tous les states suivant pour gérer les données
   */
  // items nous sert pour le GET ALL
  const [items, setItems] = useState([]);
  // item nous sert pour le GET ONE
  const [item, setItem] = useState({});
  // title nous sert pour le POST
  const [title, setTitle] = useState("");
  // deleteItem nous sert pour le DELETE
  const [deleteItem, setDeleteItem] = useState("");
  // putItem nous sert pour le PUT
  const [putItem, setPutItem] = useState("");
  // getId nous sert pour le PUT (Et surtout pour l'affichage du bouton)
  const [getId, setGetId] = useState(0);

  /**
   * GET ALL DATA
   */
  async function getData() {
    try {
      // J'importe `instance` depuis le fichier axios.js
      // Ça me permet de créer une instance de axios avec une URL de base `import.meta.env.VITE_BACKEND_URL` par exemple
      // doc: https://axios-http.com/docs/instance
      const result = await instance.get();
      setItems(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * GET ONE DATA
   */
  async function getOneData() {
    try {
      // J'importe `instance` depuis le fichier axios.js
      // Vu qu'instance a pour base url `import.meta.env.VITE_BACKEND_URL`
      // je peux ajouter un paramètre à la fin de l'URL, ici 7
      const result = await instance.get("/7");
      setItem(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * POST DATA
   */
  function postItem() {
    instance
      // Pour le post, je peux faire juste `title` car JS comprend que c'est un raccourci pour `title: title`
      .post("/", { title })
      .then((res) => {
        if (res.status === 201) {
          document.querySelector("#addItem").value = "";
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  /**
   * DELETE DATA
   */
  const deleteItemBack = (e) => {
    instance.delete(`${deleteItem}`).catch((err) => {
      console.log(err.message);
    });
  };

  /**
   * PUT DATA
   */
  async function putOneData() {
    try {
      await instance.put(`/${getId}`, { title: putItem });
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postItem();
  };

  const handleSelect = (e) => {
    setGetId(e.target.value);
  };

  useEffect(() => {
    getData();
    getOneData();
  }, [postItem, deleteItemBack, putOneData]);

  return (
    <div className="App">
      <div className="container">
        <div className="crud">
          <h2>GET ALL</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.title} <span className="hastag">(#{item.id})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="crud">
          <h2>GET ONE</h2>
          <ul>
            <li>
              {item.title} <span className="hastag">(#{item.id})</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="crud">
          <h2>POST</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="addItem"
              id="addItem"
              onChange={handleChange}
            />
            <button type="submit">Go go go 🚀</button>
          </form>
        </div>

        <div className="crud">
          <h2>DELETE ONE</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deleteItemBack();
            }}
          >
            <input
              type="number"
              name="deleteItem"
              id="deleteItem"
              onChange={(e) => setDeleteItem(e.target.value)}
            />
            <button type="submit">Oh nooo 😭</button>
          </form>
        </div>

        <div className="crud">
          <h2>PUT ONE</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              putOneData();
            }}
          >
            <select name="selectItem" id="selectItem" onChange={handleSelect}>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}
                </option>
              ))}
            </select>
            <input
              type="text"
              id="putDataName"
              name="putDataName"
              onChange={(e) => setPutItem(e.target.value)}
            />
            <button type="submit">Update l'id {getId}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
