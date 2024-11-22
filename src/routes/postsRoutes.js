// Importa o express para criar a aplicação web
import express from 'express';

// Importa o multer para lidar com uploads de arquivos
import multer from 'multer';
import cors from "cors";

const corsOptions = {
  origin: 'http://localhost:8000',
  optionSuccessStatus: 200
}

// Importa as funções controladoras para posts do arquivo postsController.js
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from '../controllers/postsController.js';

// Configura o armazenamento de arquivos em disco
const storage = multer.diskStorage({
  // Define a pasta de destino para os uploads (no caso, 'uploads/')
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Define o nome do arquivo como o nome original enviado
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Cria um middleware Multer com o armazenamento configurado
const upload = multer({ dest: "./uploads", storage }); // Opcional: define a pasta de destino temporária (pode ser removido)

// Define uma função para configurar as rotas da aplicação
const routes = (app) => {
  // Habilita o parser JSON para lidar com requisições que enviam dados no formato JSON
  app.use(express.json());
  app.use(cors(corsOptions));

  // Rota GET para listar todos os posts (delega a operação para a função listarPosts)
  app.get('/posts', listarPosts);

  // Rota POST para criar um novo post (delega a operação para a função postarNovoPost)
  app.post('/posts', postarNovoPost);

  // Rota POST para upload de imagem utilizando o middleware multer (delega a operação para a função uploadImagem)
  // O middleware 'upload.single('imagem')' processa um único arquivo chamado 'imagem'
  app.post('/upload', upload.single('imagem'), uploadImagem);

  app.put('/upload/:id', atualizarNovoPost);
};

// Exporta a função routes para ser utilizada em outros arquivos do projeto
export default routes;

