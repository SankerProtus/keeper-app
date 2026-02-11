import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import CreateNote from "./components/CreateNote";
import Footer from "./components/Footer";
import Note from "./components/Note";
import "./App.css";
import axios from "axios";

function App() {
  const [currentNote, setCurrentNote] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get-notes`);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  function startAutoCollapseTimer() {
    // Clear exixting timer if any
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start new timer for 2 minutes
    timerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 120000);
  }

  // Function to clear the timer
  function clearAutoCollapseTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  // Custom setIsExpanded function that manages the timer
  function handleSetIsExpanded(value) {
    setIsExpanded(value);

    if (value === true) {
      startAutoCollapseTimer();
    } else {
      clearAutoCollapseTimer();
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCurrentNote((prev) => ({ ...prev, [name]: value }));

    // Reset timer on user activity if form is expanded
    if (isExpanded) {
      startAutoCollapseTimer();
    }
  }

  async function submitNote(e) {
    e.preventDefault();
    if (currentNote.title.trim() === "" && currentNote.content.trim() === "")
      return;

    try {
      // If currentNote has an id, perform an update (edit); otherwise create a new note
      if (currentNote.id) {
        const res = await axios.put(`${API_URL}/api/notes/${currentNote.id}`, {
          title: currentNote.title,
          content: currentNote.content,
        });

        const updatedNote = res.data;

        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
        );
      } else {
        const res = await axios.post(`${API_URL}/api/add/note`, {
          title: currentNote.title,
          content: currentNote.content,
        });
        const newNote = res.data;
        setNotes((prevNotes) => [newNote, ...prevNotes]);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }

    // Reset Form and exit edit mode
    setCurrentNote({ title: "", content: "" });
    handleSetIsExpanded(false);
  }

  async function deleteNote(id) {
    try {
      const res = await axios.delete(`${API_URL}/api/notes/${id}`);

      if (res.status === 200 || res.status === 204) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  function editNote(id) {
    const noteToEdit = notes.find((n) => n.id === id);
    if (noteToEdit) {
      setCurrentNote({
        title: noteToEdit.title,
        content: noteToEdit.content,
        id: noteToEdit.id,
      });
      handleSetIsExpanded(true);
    }
  }

  // Cancel editing
  function cancelEdit() {
    setCurrentNote({ title: "", content: "" });
    handleSetIsExpanded(false);
  }

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      clearAutoCollapseTimer();
    };
  }, []);

  function createNote(note) {
    return (
      <Note
        key={note.id}
        title={note.title}
        content={note.content}
        deleteNote={() => deleteNote(note.id)}
        editNote={() => editNote(note.id)}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Header />
        <CreateNote
          currentNote={currentNote}
          handleChange={handleChange}
          submitNote={submitNote}
          isExpanded={isExpanded}
          setIsExpanded={handleSetIsExpanded}
          cancelEdit={cancelEdit}
        />
        <div className="notes-container">{notes.map(createNote)}</div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
