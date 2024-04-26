const express=require('express')
const cors=require('cors')
const {MongoClient} = require('mongodb');
const crypto=require('crypto')

const app=express()
app.use(cors())
app.use(express.json())

const port = 3001
let db;

MongoClient.connect('mongodb://localhost:27017/NoteTodo')
.then((res)=>{
    db=res.db()
})
.catch((err)=>{
    console.log("Error in Connection")
})

app.get('/note/api/get',(req,res)=>{
    let note=[]
    db.collection('Note')
    .find()
    .forEach(e => {
        note.push(e)
    })
    .then(()=>{
        res.json(note)
    })
    .catch((err)=>{
        console.log("Error on Get")
    })
})

app.post('/note/api/post',(req,res)=>{
    const newData={
        id:crypto.randomBytes(2).toString('hex'),
        title: req.body.title,
        note:req.body.note
    }
    db.collection('Note').insertOne(newData)
    .then(()=>{
        console.log(newData)
    })
    .catch(()=>{
        console.log("Error on Express Post")
    })
})

app.put('/note/api/put/:id',(req,res)=>{
    const putid=req.params.id;
    const notes=req.body;
    const putData={
        id:putid,
        title: notes.title,
        note:notes.note
    }
    db.collection('Note').updateOne({"id":putid},{$set:putData})
    .then(()=>{
        console.log(putData)
    })
    .catch(()=>{
        console.log("Error on Express Put")
    })
})

app.delete(`/note/api/delete/:delid`,(req,res)=>{
    const delid=req.params.delid;
    // console.log(delid);
    db.collection('Note').deleteOne({id:delid})
    .then(()=>{
        console.log("Data Deleted")
    })
    .catch(()=>{
        console.log("Error on Express Delete")
    })
})

app.get('/todo/api/get',(req,res)=>{
    let todo=[]
    db.collection('Todo')
    .find()
    .forEach(e => {
        todo.push(e)
    })
    .then(()=>{
        // console.log(todo)
        res.json(todo)
    })
    .catch((err)=>{
        console.log("Error on Get")
    })
})

app.post('/todo/api/post',(req,res)=>{
    const newData={
        id:crypto.randomBytes(2).toString('hex'),
        todo: req.body.todo,
        checked:req.body.checked
    }
    db.collection('Todo').insertOne(newData)
    .then(()=>{
        console.log(newData)
    })
    .catch(()=>{
        console.log("Error on Express Post")
    })
})

app.put('/todo/api/put/:id',(req,res)=>{
    const putid=req.params.id;
    const todos=req.body;
    const putData={
        id:putid,
        todo: todos.todo,
        checked:todos.checked
    }
    db.collection('Todo').updateOne({"id":putid},{$set:putData})
    .then(()=>{
        console.log(putData)
    })
    .catch(()=>{
        console.log("Error on Express Put")
    })
})

app.delete(`/todo/api/delete/:delid`,(req,res)=>{
    const delid=req.params.delid;
    // console.log(delid);
    db.collection('Todo').deleteOne({id:delid})
    .then(()=>{
        console.log("Data Deleted")
    })
    .catch(()=>{
        console.log("Error on Express Delete")
    })
})

app.listen(port,()=>{
    console.log("Running in port 3001")
})
