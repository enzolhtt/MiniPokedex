import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native';

interface Pokemon {
  id: number;
  name: string;
}

export default function ListScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPokemons();
  }, []);

  


  const loadPokemons = async () => {
    try {
      const cached = await AsyncStorage.getItem('pokemons');

      if (cached !== null) {
        setPokemons(JSON.parse(cached));
      } else {
        await fetchPokemons();
      }
    } catch (error) {
      console.error('Erreur lecture cache:', error);
    } finally {
      setLoading(false);
    }
  };



  


  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
      const data = await response.json();
      const total: number = data.count;

      const ids: number[] = [];
      while (ids.length < 5) {
        const randomId = Math.floor(Math.random() * total) + 1;
        if (!ids.includes(randomId)) ids.push(randomId);
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const p = await res.json();
          return { id: p.id, name: p.name } as Pokemon;
        })
      );

      await AsyncStorage.setItem('pokemons', JSON.stringify(results));
      setPokemons(results);
    } catch (error) {
      console.error('Erreur fetch:', error);
    }
  };

  if (loading) return <ActivityIndicator />;

  

  
  return (
    <View style={{ flex: 1 }}>
      <Text>Liste des Pokémon</Text>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() =>
              router.push({
                pathname: '/DetailScreen',
                params: { pokemonId: item.id },
              })
            }
          />
        )}
      />
    </View>
  );
}