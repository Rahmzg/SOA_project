

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const mangaProtoPath = 'manga.proto';
const animeProtoPath = 'anime.proto';
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


const resolvers = {
  Query: {
    manga: (_, { id }) => {

      return new Promise((resolve, reject) => {
        clientManga.getManga({ mangaId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.manga);
          }
        });
      });
    },
    manga: () => {


      return new Promise((resolve, reject) => {
        clientManga.searchManga({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.manga);
          }
        });
      });
    },
    anime: (_, { id }) => {
   
      return new Promise((resolve, reject) => {
        clientAnime.getAnime({ animeId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_show);
          }
        });
      });
    },
    anime: () => {
    
      return new Promise((resolve, reject) => {
        clientAnime.searchAnime({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_shows);
          }
        });
      });
    },
   
  },
  Mutation: {
    createManga: (_, {id, title, description} ) => {
      return new Promise((resolve, reject) => {
        clientManga.createManga({manga_id: id, title: title, description: description}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.manga);
          }
        });
      });
    },
  }
};

module.exports = resolvers;
