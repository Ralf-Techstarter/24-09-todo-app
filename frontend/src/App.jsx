import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("")

  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
    .then((res) => res.json())
    .then(setTasks)
  }, []);

  const itemHinzufuegen = () => {

    //Option 1 für Eingabecheck: falls Eingabefeld leer ist, mach nicht weiter

    if (!title) {
      return;
    }

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title}),
    })       
    // hier möchte ich, dass die Liste in der App auch aktualisiert wird
    .then((res) => res.json())
    .then((neueAufgabe) => {
      console.log("Server-Antwort:", neueAufgabe);
      if (Array.isArray(neueAufgabe) && neueAufgabe.length > 0) {
        setTasks((prevTasks) => [...prevTasks, neueAufgabe[0]]);
      }
    })
  
    setTitle("");
  };
  
  const itemLoeschen = (id_nummer) => {
    fetch(`http://localhost:3050/delete/${id_nummer}`, {
      method: "DELETE",
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.message) {
        setTasks(tasks.filter((task) => task.id !== id_nummer));
      }
    });
  };

  const itemAktualisieren = (id_nummer, completed) => {
    fetch(`http://localhost:3050/update/${id_nummer}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.message) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id_nummer ? { ...task, completed } : task
          )
        );
      }
    });
  };
  
  


  return (
    <>
      <h1>To-Do List</h1>
      <input value={title}  onChange={(e)=>setTitle(e.target.value)} />
      <button disabled={!title.trim()} onClick={itemHinzufuegen}>Add</button> {/* Option 2 für Eingabecheck: Button wird disabled bleiben wenn das Eingabefeld leer ist*/}

      <ul>
        {// hier gehört der Code, um die To-Do Liste dynamisch zu gestalten
        tasks.map(({ id, title, completed }) => (
          <li key={id}>
            <input
              type='checkbox'
              checked={completed}
              onChange={(e) => itemAktualisieren(id, e.target.checked)}
            />
            {title}
            <button onClick={() => itemLoeschen(id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
 