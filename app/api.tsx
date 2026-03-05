import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

interface Pokemon {
  name: string;
  url: string;
}

export default function Users() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
      const data = await response.json();

      const shuffled = data.results.sort(() => Math.random() - 0.5);
      setPokemons(shuffled.slice(0, 5));
    } catch (error) {
      console.error('erreur:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Liste des pokemons</Text>
      {/* <Button title="Refresh" onPress={fetchPokemons} /> */}
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
      />
    </View>
  );
}