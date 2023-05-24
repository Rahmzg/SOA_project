//Importing required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

//Loading the Protocol Buffer definition file (manga.proto)
const mangaProtoPath = 'manga.proto';
const mangaProtoDefinition = protoLoader.loadSync(mangaProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

//Loading the defined service
const mangaProto = grpc.loadPackageDefinition(mangaProtoDefinition).manga;

//Implementing the service methods
const mangaService = {
  getManga: (call, callback) => {

    const manga = {
      id: call.request.manga_id,
      title: 'Example Manga',
      description: 'This is an example manga.',
  
    };
    callback(null, {manga});
  },
  searchManga: (call, callback) => {
    const { query } = call.request;

    const manga = [
      {
        id: '1',
        title: 'Example Manga 1',
        description: 'This is the first example manga.',
      },
      {
        id: '2',
        title: 'Example Manga 2',
        description: 'This is the second example manga.',
      },

    ];
    callback(null, { manga });
  },
  createManga: (call, callback) => {
    const { query } = call.request;
    const manga = {
      id: call.request.manga_id,
      title: call.request.title,
      description: call.request.description,

    };
    callback(null, {manga});
  }

};

//Creating the gRPC server
const server = new grpc.Server();
server.addService(mangaProto.mangaService.service, mangaService);

//Binding and starting the server
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });

  //Logging information
console.log(`Manga microservice running on port ${port}`);



//This code sets up a gRPC server, loads the ProtoBuf definition, 
//implements the service methods, binds the server to a port,
// and starts the server to listen for incoming requests.
// It's a basic example of how to create a gRPC server in Node.js.