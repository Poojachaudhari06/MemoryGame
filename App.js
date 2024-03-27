import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet,
  TouchableOpacity, Animated, Easing
} from 'react-native';
import Icon
  from 'react-native-vector-icons/FontAwesome';

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j =
      Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const gameCardsFunction = () => {
  const icons = alphabets.concat(alphabets); // Duplicate alphabets to create pairs
  const randomIcons =
    randomArrFunction(icons);
  return randomIcons.map(
    (icon, index) => ({
      id: index,
      symbol: icon,
      isFlipped: false,
    }));
};

const App = () => {
  const [cards, setCards] =
    useState(gameCardsFunction());
  const [selectedCards, setSelectedCards] =
    useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] =
    useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);

  const cardClickFunction = (card) => {
    if (!gameWon && selectedCards.length < 2
      && !card.isFlipped) {
      const updatedSelectedCards =
        [...selectedCards, card];
      const updatedCards =
        cards.map((c) =>
          c.id ===
          card.id ?
            { ...c, isFlipped: true } : c
        );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);
      if (updatedSelectedCards.length === 2) {
        if (updatedSelectedCards[0].symbol ===
          updatedSelectedCards[1].symbol) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
        WinGameFunction();
            setGameWon(true);
          }
        } else {
          setTimeout(() => {
            const flippedCards =
              updatedCards.map((c) =>
                updatedSelectedCards.some((s) =>
                  s.id === c.id) ?
                  { ...c, isFlipped: false } : c
              );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 1000);
        }
      }
    }
  };

  const WinGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (matches === cards.length / 2) {
      geekWinGameFunction();
      setGameWon(true);
    }
  }, [matches]);

  const msg =
    `Matches: ${matches} / ${cards.length / 2}`;

  return (
    <View style={styles.container}>
      <Text style={styles.header1}>
        MemoryGame
      </Text>
      <Text style={styles.header2}>
        Memory Pair Game using React-Native
      </Text>
      <Text style={styles.matchText}>{msg}</Text>
      {gameWon ? (
        <View style={styles.winMessage}>
          <View style={styles.winMessageContent}>
            <Text style={styles.winText}>
              Congratulations
            </Text>
            <Text style={styles.winText}>You Won!</Text>
          </View>
          <Button
            title="Restart"
            onPress={() => {
              setCards(gameCardsFunction());
              setSelectedCards([]);
              setMatches(0);
              setWinMessage(new Animated.Value(0));
              setGameWon(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={
                [styles.card,
                card.isFlipped && styles.cardFlipped]}
              onPress={() => cardClickFunction(card)}
            >
              {card.isFlipped ?
                <Text style={styles.cardText}>{card.symbol}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  header1: {
    fontSize: 36,
    marginBottom: 10,
    color: 'Blue',
  },
  header2: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  matchText: {
    fontSize: 18,
    color: 'black',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '40%',
  },
  card: {
    width: '22%',
    aspectRatio: 1,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(127, 0, 255)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  cardFlipped: {
    backgroundColor: 'white',
  },
  cardText: {
    fontSize: 24,
  },
  winMessage: {
    position: 'absolute',
    backgroundColor: 'blue',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  winMessageContent: {
    backgroundColor: 'rgba(255, 215, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  winText: {
    fontSize: 36,
    color: 'white',
  },
});

export default App;
