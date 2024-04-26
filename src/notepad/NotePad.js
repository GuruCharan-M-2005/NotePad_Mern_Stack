import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cross from './cross.png' 
import tick from './tick.png' 
import plus from './plus.png';
import pen from './pen.png';
import bin from './bin.png';
import './NotePad.css';

export default function NotePad() {

  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedNote, setEditedNote] = useState('');
  const [newTitle,setNewTitle]=useState("")
  const [newNote,setNewNote]=useState("")
  const [newCard,setNewCard]=useState(false)

  const [todos, setTodos] = useState([]);
  const [todofilter, setTodoFilter] = useState('');
  const [newTodo,setNewTodo]=useState("")
  const [newTodoChecked,setNewTodoChecked]=useState("")
  // const [newNote,setNewNote]=useState("")
  const [newTodoCard,setNewTodoCard]=useState(false)

  const timeout=100;

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  

  const fetchData = async () => {
    const res = await axios.get('http://localhost:3001/note/api/get');
    setNotes(res.data);
  };

  const fetchData2 = async () => {
    const res = await axios.get('http://localhost:3001/todo/api/get');
    setTodos(res.data);
  };

  const deleteData = (delid) => {
    axios.delete(`http://localhost:3001/note/api/delete/${delid}`);
    console.log('Deleted');
    setTimeout(() => {
      fetchData()
    }, timeout); 
  };

  const AddButton=  ()=>{
      if(newTitle!=="" && newNote!==""){
        axios.post('http://localhost:3001/note/api/post',{title : newTitle , note : newNote});
        setNewTitle("")
        setNewNote("")
        setNewCard(!newCard)
        console.log("Note Added")
        setTimeout(() => {
          fetchData()
        }, timeout);
      }
  }
  
  const CancelButton=()=>{
    setEditingNote(null);
      setEditedTitle('');
      setEditedNote('');
      setNewTodoCard(false)
      setNewCard(false)
      setTimeout(() => {
        fetchData()
      }, timeout); 
  }

  const editData=(note)=>{
    setEditingNote(note)
    setEditedNote(note.note)
    setEditedTitle(note.title)
  }

  const saveEditedNote = () => {
    if (editedTitle !== '' && editedNote !== '') {
      axios.put(`http://localhost:3001/note/api/put/${editingNote.id}`, {
        title: editedTitle,
        note: editedNote,
      });
      console.log('Note Updated');
      setEditingNote(null);
      setEditedTitle('');
      setEditedNote('');
      setTimeout(() => {
        fetchData()
      }, timeout); 
    }
  };

  const createTodoData=()=>{
    if(newTodo!==""){
      axios.post('http://localhost:3001/todo/api/post',{todo : newTodo , checked : false});
      setNewTodo("")
      setNewTodoCard(!newTodoCard)
      console.log("Todo Added")
      setTimeout(() => {
        fetchData2()
      }, timeout);
    }
  }

  const deleteTodoData=(delid)=>{
    axios.delete(`http://localhost:3001/todo/api/delete/${delid}`);
    console.log('Deleted');
    setTimeout(() => {
      fetchData2()
    }, timeout); 
  }

  const updateTodochecked=(i)=>{
    axios.put(`http://localhost:3001/todo/api/put/${i.id}`, {
      todo: i.todo,
      checked: !i.checked,
    });
    console.log('Todo Updated');
    setTimeout(() => {
      fetchData2()
    }, timeout); 
  }

  return (  
    <div className='main-container'>
        <div className='todo-container'>
            <div className='head3'>
            <h1 className='head3-text'>Todos</h1>
            </div>
            <div className='head4'>
              <input
                type='text'
                value={todofilter}
                placeholder='Search....'
                maxLength='50'
                className='head4-text'
                onChange={(e) => setTodoFilter(e.target.value)}
              />
              <button className='head4-button' onClick={() => setNewTodoCard(!newTodoCard)}>
                <img src={plus} alt='' className='head4-image' />
              </button>
            </div>

            <div className='todo-body'>
              {todos
                .filter((i) => i.todo.toLowerCase().includes(todofilter.toLowerCase())  && i.todo!=='')
                .map((i) => (
                  <div style={{ backgroundColor: i.checked ? 'lightpink' : 'lightgreen',borderColor: i.checked ? 'red' : 'green' }}
                  className='todo-body-card' key={i.id}>
                    <input type='checkbox' checked={i.checked} onClick={()=>updateTodochecked(i)} className='todo-body-checkbox'></input>
                    <div><p className='todo-body-title'>{i.todo}</p></div>
                    <button style={{ backgroundColor: i.checked ? 'lightpink' : 'lightgreen' }} className='todo-body-button' onClick={() => deleteTodoData(i.id)}>
                      <img src={bin} alt='' className='todo-body-image' />
                    </button>                    
                  </div>
                ))}
                {newTodoCard && (
                <div className='new2-container'>
                  <div><input type="text" value={newTodo} onChange={(e)=>setNewTodo(e.target.value)} className='new2-text-title' maxLength='50' placeholder="Enter your Todo here..." /><br/></div>
                  <div><button className='new2-button' onClick={()=>createTodoData()}><img src={tick} alt='' className='new2-button-image'></img></button></div>
                  <div><button className='new2-button' onClick={()=>CancelButton()}><img src={cross} alt='' className='new2-button-image'></img></button></div>
                </div>
                )}
            </div>
        </div>
        <div className='notepad-container' >
          <div className='head1'>
            <h1 className='head1-text'>Notes</h1>
          </div>
          <div className='head2'>
            <input
              type='text'
              value={filter}
              placeholder='Search....'
              maxLength='50'
              className='head2-text'
              onChange={(e) => setFilter(e.target.value)}
            />
            <button className='head2-button' onClick={() => setNewCard(!newCard)}>
              <img src={plus} alt='' className='head2-image' />
            </button>
          </div>

          <div className='note-body'>
            {notes
              .filter((note) => note.title.toLowerCase().includes(filter.toLowerCase()) && note.title !== '')
              .map((note) => (
                <div className='note-body-card' key={note.id}>
                  {editingNote && editingNote.id === note.id ? (
                    <div>
                      <input placeholder='Your Title...' type='text' className='update-text-title'  value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} maxLength='50'/>
                      <textarea placeholder='Your Note...' className='update-text-note'  value={editedNote} onChange={(e) => setEditedNote(e.target.value)} />
                      <button className='update-button' onClick={()=>saveEditedNote()}><img src={tick} alt='' className='update-button-image'></img></button>
                      <button className='update-button' onClick={()=>CancelButton()}><img src={cross} alt='' className='update-button-image'></img></button>
                    </div>
                  ) : (
                    <div>
                      <p className='note-body-title'>{note.title}</p>
                      <p className='note-body-note'>{note.note}</p>
                      <button  className='note-body-button' onClick={() => editData(note)}>
                        <img src={pen} alt='' className='note-body-image' />
                      </button>
                      <button className='note-body-button' onClick={() => deleteData(note.id)}>
                        <img src={bin} alt='' className='note-body-image' />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {newCard && (
              <div className='new-container'>
                <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} className='new-text-title' maxLength='50' placeholder="Enter your Title here..." /><br/>
                <textarea className='new-text-note' value={newNote}onChange={(e)=>setNewNote(e.target.value)}  placeholder="Enter your note here..." /><br/>
                <button className='new-button' onClick={()=>AddButton()}><img src={tick} alt='' className='new-button-image'></img></button>
                <button className='new-button' onClick={()=>CancelButton()}><img src={cross} alt='' className='new-button-image'></img></button>
              </div>
              )}
          </div>
        </div>
    </div>
  );
}
