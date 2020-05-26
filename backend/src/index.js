const express = require('express');
const cors = require('cors');
const { uuid , isUuid } = require('uuidv4');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET: Buscar informações do back-end
 * POST: Criar uma informação do back-end
 * PUT / PATCH: Alterr uma informação no back-end ( O PUT é quando queremos alterar varias informações e o PATCH quando queremos alterar algo especifico como por exemplo um avatar)
 * DELETE: Deletar uma informação do back-end
 */

/**
 * Tipos de parâmetros
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos ( Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * Middleware: 
 * 
 * Interceptado de requisições que pode interromper totalmente a requisição ou alterar dados da requisição.
 * 
 * Toda rota é um middleware
 * 
 * O formato de um middleware é como se fosse uma função, pois ela intecpta uma requisição e utiliza a requisição e pode dar uma resposta
 * 
 * Quando usamos um middleware? Quando quisermos que uma função seja executada de modo automatico em uma ou mais rotas 
 * 
 * Voce pode colocar um middleware específico em um rota específica "app.get('/projects', <nome do middleware >, (request, response) => {" ou ainda fora das roras mas de uma maneira que indique o caminho das rotas "app.use('/projects/:id', validateProjectId);" 

 * 
 */

const projects = [];

function logRequests(request, response, next ){
  const { method, url } = request;
  
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  
  next(); // chamada para o próximo middleware, se isso não existir ele para por aqui. Se colocar algo após o next() sem o return ele será executado após o que o next executar ( Fica sincrono )
  
  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid project ID.'})
  }

  return next();
}

//app.use(logRequests);
app.use('/projects/:id', validateProjectId);

//Buscar informações
app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title 
  ? projects.filter( project => project.title.includes(title))
  : projects;
  
  return response.json(results);
});

//Criar informação
app.post('/projects',(request, response) => {
  const { title, owner} = request.body;
  const project = { id: uuid(),  title, owner };
  projects.push(project);
  return response.json(project);
});

//Alterar uma informação
app.put('/projects/:id',(request, response) => {
  const { title, owner} = request.body;
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if ( projectIndex < 0 ) {
    return response.status(404).send({
      error: 'Project not found!' 
    })
  };

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project;

  return response.json(project);
});

//Deletar uma informação
app.delete('/projects/:id',(request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex( project => project.id === id);

  if ( projectIndex < 0 ) {
    return response.status(404).send({error: 'Project not found!'})
  }

  projects.slice(projectIndex, 1);

  return response.status(204).send();
});


app.listen(3333, () => {
  console.log('🎯 Back-end started!')
});
