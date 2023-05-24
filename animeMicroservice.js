

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const animeProtoPath = 'anime.proto';
const animeProtoDefinition = protoLoader.loadSync(animeProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const animeProto = grpc.loadPackageDefinition(animeProtoDefinition).anime;

const animeService = {
  getAnime: (call, callback) => {
    
    const anime = {
      id: call.request.anime_id,
      title: 'Example TV Show',
      description: 'This is an example TV show.',
     
    };
    callback(null, {anime});
  },
  searchAnime: (call, callback) => {
    const { query } = call.request;
  
    const anime = [
      {
        id: '1',
        title: 'Example TV Show 1',
        description: 'This is the first example TV show.',
      },
      {
        id: '2',
        title: 'Example TV Show 2',
        description: 'This is the second example TV show.',
      },
    ];
    callback(null, { anime });
  },

};

const server = new grpc.Server();
server.addService(animeProto.animeService.service, animeService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`TV show microservice running on port ${port}`);
