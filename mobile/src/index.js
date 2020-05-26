import React, { useState, useEffect} from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

import api from './services/api';

export default function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('projects').then(response => {
      //console.log(response.data);
      setProjects(response.data);
    })
  });

  async function handleAddProject(){
    const response = await api.post('projects', {
      title: `Novo projeto ${Date.now()}`,
      owner: 'Marcelo Veraldo'
    })

    const project = response.data;
    setProjects([...projects, project]);
  }

  
  return ( 
      <>
        <StatusBar barStyle="light-content" backgroundColor="#7159c1"/>
        <SafeAreaView style={styles.container}>
          <FlatList 
            data={projects}
            keyExtractor={project => project.id}
            renderItem={({ item: project })=> (
              <Text style={styles.project}>{project.title}</Text>
              )}
          />

          <TouchableOpacity 
            activeOpacity={0.6} 
            style={styles.button} 
            onPress={handleAddProject}
          >
            <Text style={styles.buttonText}>Adicionar Projetos</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* <View style={styles.container}>
          {projects.map(project => (
            <Text style={styles.project} key={project.id}>{project.title}</Text>
          ))}
        </View> */}
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
//    justifyContent: 'center',
//    alignItems: 'center',
  },
  project: {
    color: '#FFF',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16
  }
})