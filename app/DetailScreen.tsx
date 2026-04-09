import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Text, View } from 'react-native';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

export default function DetailScreen() {
  const { pokemonId } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (pokemonId) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then((res) => res.json())
        .then((data) => setPokemon(data))
        .catch((err) => console.error('Erreur:', err));
    }
  }, [pokemonId]);

  if (!pokemon) return <ActivityIndicator />;

  return (
    <View>
      <Text>{pokemon.name}</Text>
      <Text>Types : {pokemon.types.map(t => t.type.name).join(', ')}</Text>
      <Image source={{ uri: pokemon.sprites.front_default }} style={{ width: 150, height: 150 }} />
      <Text>ID : {pokemon.id}</Text>
      <Text>Taille : {pokemon.height / 10} m</Text>
      <Text>Poids : {pokemon.weight / 10} kg</Text>

      <Button title="Retour" onPress={() => router.back()} />
    </View>
  );
}