import React, { useState, useEffect } from 'react';
import Note from './components/note';
import noteService from './services/notes';
import Notification from './components/notification';

const App = (props) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState(
        'a new note...'
    );
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null)
    const notesToShow = showAll ? notes : notes.filter(note => note.important);


    const rows = notesToShow.map(note =>
        <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
        />
    );

    const hook = () => {
        noteService.getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    };

    useEffect(hook, []);

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
            id: notes.length + 1
        };
        noteService.create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
    };

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    };

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id ===id);
        const changedNote = {...note, important: !note.important};

        noteService.update(id, changedNote).then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note: returnedNote))
        })
            .catch(error => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from the server`
                );
                setTimeout(() => {
                   setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter(n => n.id !== id));
            })
    };

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {rows}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
        </div>
    )
};

export default App;