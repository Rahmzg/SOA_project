

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const mangaProtoPath = 'manga.proto';
const animeProtoPath = 'anime.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');


const app = express();
app.use(bodyParser.json());

const mangaProtoDefinition = protoLoader.loadSync(mangaProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const animeProtoDefinition = protoLoader.loadSync(animeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const mangaProto = grpc.loadPackageDefinition(mangaProtoDefinition).manga;
  const animeProto = grpc.loadPackageDefinition(animeProtoDefinition).anime;
  const clientManga = new mangaProto.MangaService('localhost:50051', grpc.credentials.createInsecure());
  const clientAnime = new animeProto.AnimeService('localhost:50052', grpc.credentials.createInsecure());

  


const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
      );
  });


app.get('/manga', (req, res) => {
  clientManga.searchManga({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.manga);
      }
    });
  });

  app.post('/manga', (req, res) => {
    const {id, title, description} = req.body;    
    clientManga.createManga({manga_id: id, title: title, description: description}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.manga);
      }
    });
  })
  
  app.get('/manga/:id', (req, res) => {
    const id = req.params.id;
    clientManga.getManga({ mangaId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.manga);
      }
    });
  });


  
  app.get('/anime', (req, res) => {
    clientAnime.searchAnime({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tv_shows);
      }
    });
  });
  
  app.get('/anime/:id', (req, res) => {
    const id = req.params.id;
    clientAnime.getAnime({ animeId: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tv_show);
      }
    });
  });


const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
