import { MongoClient } from 'mongodb';

export default async function conectarAoBanco(stringConexao) {
  let client;

  try {
      client = new MongoClient(stringConexao);
      console.log('Conectando ao cluster do banco de dados...');
      await client.connect();
      console.log('Conectado ao MongoDB Atlas com sucesso!');

      return client;
  } catch (erro) {
      console.error('Falha na conexão com o banco!', erro);
      process.exit();
  }
}