import express from 'express';
import {getAllUsers, creatUsers, putUsers, DeleteUsers,login} from './user.js';
import {getAllPost, creatPost, putPost, DeletePost} from './post.js';
import { auth } from './auth/middleware.js';

const app = express();
app.use(express.json());

// Rotas de usuário
app.post('/login', login);

app.get('/user', auth, getAllUsers);

app.post('/user', creatUsers);

app.put('/user/:id', auth, putUsers);

app.delete('/user/:id', auth, DeleteUsers);


// Rotas de post
app.get('/post', auth, getAllPost);

app.post('/post', auth, creatPost);

app.put('/post/:id', auth, putPost);

app.delete('/post/:id', auth, DeletePost);

//Teste de rotas
app.get('/', (req, res) => {  
  res.send('Welcome!');
});

export default app;