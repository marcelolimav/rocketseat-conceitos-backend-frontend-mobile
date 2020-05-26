import React, { useState,useEffect } from 'react';
import api from './services/api';

import './App.css'

import Header from './components/Header'

function App() {
  const [ projects, setProjects ] = useState([]);
  //use State retorna um array com 2 posições 
  //
  // 1. Variável com o seu valor inicial
  // 2. Função para atualizar esse valor

  useEffect(() =>{
    api.get('/projects').then(response => {
      setProjects(response.data)
    })
  }, []);


  async function handleAddProject() {
    //1 projects.push(`Novo project ${Date.now()}`);
    //2 setProjects([...projects, `Novo project ${Date.now()}`]);
    
    const response = await api.post('projects',{
      title: `Novo project ${Date.now()}`,
      owner: 'Marcelo Veraldo'
    });

    const project = response.data;

    setProjects([...projects, project])
  }
  return (
    <>
      <Header title="Homepage"/>
      

      <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
      <ul>
        {projects.map(project => <li key={project.id}>{project.title}</li> )} 
      </ul>

    </>
  );
}

export default App;