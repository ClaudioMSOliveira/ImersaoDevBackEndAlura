import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from 'fs';
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    // Busca todos os posts usando a função getTodosPosts
    const posts = await getTodosPosts();
    // Envia os posts como resposta JSON com status 200 (OK)
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    // Exporta uma função assíncrona para criar um novo post
    const novoPost = req.body; // Obtém os dados do novo post enviados no corpo da requisição
    try {
      // Tenta executar o código dentro do bloco try
      const postCriado = await criarPost(novoPost); // Chama a função criarPost (não mostrada) para criar o post no banco de dados e aguarda a conclusão
      res.status(200).json(postCriado); // Retorna o post criado com status 200 (sucesso)
    } catch(erro) {
      // Captura qualquer erro que possa ocorrer durante a criação do post
      console.error(erro.message); // Imprime a mensagem de erro no console para depuração
      res.status(500).json({'Erro':'Falha na requisição'}); // Retorna uma mensagem de erro genérica ao cliente com status 500 (erro do servidor)
    }
}
  
export async function uploadImagem(req, res) {
    // Exporta uma função assíncrona para criar um novo post com upload de imagem
    const novoPost = {
      descricao: "", // Inicializa a descrição como uma string vazia
      imgUrl: req.file.originalname, // Define o caminho da imagem como o nome original do arquivo enviado
      alt: "" // Inicializa a tag alt como uma string vazia
    };
    try {
      // Tenta executar o código dentro do bloco try
      const postCriado = await criarPost(novoPost); // Cria o post no banco de dados
      const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Gera um novo nome para a imagem usando o ID do post criado
      fs.renameSync(req.file.path, imagemAtualizada); // Renomeia o arquivo da imagem para o novo nome, movendo-o para a pasta "uploads"
      res.status(200).json(postCriado); // Retorna o post criado com status 200 (sucesso)
    } catch(erro) {
      // Captura qualquer erro que possa ocorrer durante o processo de upload
      console.error(erro.message); // Imprime a mensagem de erro no console para depuração
      res.status(500).json({'Erro':'Falha na requisição'}); // Retorna uma mensagem de erro genérica ao cliente com status 500 (erro do servidor)
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    
    try {
      const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
      const descricao = await gerarDescricaoComGemini(imgBuffer);

      const post = {
        descricao: descricao,
        imgUrl: urlImagem,
        alt: req.body.alt
    }

      const postCriado = await atualizarPost(id, post); 
      res.status(200).json(postCriado); 
    } catch(erro) {
      console.error(erro.message);
      res.status(500).json({'Erro':'Falha na requisição'});
    }
}