import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import Grid from './grid';
import GestureHandler, {Direction} from './GestureHandler';

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [field, setField] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);

    const move = (direction: Direction) => {
        const updatedField = field;
        let changesMade = 0;

        switch (direction) {
            case Direction.LEFT:
                for (let i = 0; i < updatedField.length; i++) {
                    const row = updatedField[i];

                    for (let j = 1; j < row.length; j++) {
                        if (row[j] === 0) {
                            continue;
                        }

                        let merged = false;
                        let currentIndex = j;
                        let currentValue = row[j];
                        while (currentIndex > 0) {
                            if (row[currentIndex - 1] === 0 || (!merged && row[currentIndex - 1] === row [currentIndex])) {
                                row[currentIndex - 1] += row[currentIndex];
                                row[currentIndex] = 0;
                                if (row[currentIndex - 1] !== currentValue) {
                                    merged = true;
                                }
                                changesMade++;
                            }
                            currentIndex--;
                        }
                    }
                }
                break;
            case Direction.RIGHT:
                for (let i = 0; i < updatedField.length; i++) {
                    const row = updatedField[i];

                    for (let j = row.length - 2; j >= 0; j--) {
                        if (row[j] === 0) {
                            continue;
                        }

                        let merged = false;
                        let currentIndex = j;
                        let currentValue = row[j];
                        while (currentIndex < row.length - 1) {
                            if (row[currentIndex + 1] === 0 || (!merged && row[currentIndex + 1] === row[currentIndex])) {
                                row[currentIndex + 1] += row[currentIndex];
                                row[currentIndex] = 0;
                                if (row[currentIndex + 1] !== currentValue) {
                                    merged = true;
                                }
                                changesMade++;
                            }
                            currentIndex++;
                        }
                    }
                }
                break;
            case Direction.DOWN:
                for (let i = updatedField.length - 2; i >= 0; i--) {
                    const row = updatedField[i];

                    for (let j = 0; j < row.length; j++) {
                        if (row[j] === 0) {
                            continue;
                        }

                        let merged = false;
                        let currentIndex = i;
                        let currentValue = row[j];
                        while (currentIndex < updatedField.length - 1) {
                            if (updatedField[currentIndex + 1][j] === 0 || (!merged && updatedField[currentIndex + 1][j] === updatedField[currentIndex][j])) {
                                updatedField[currentIndex + 1][j] += updatedField[currentIndex][j];
                                updatedField[currentIndex][j] = 0;
                                if (updatedField[currentIndex + 1][j] !== currentValue) {
                                    merged = true;
                                }
                                changesMade++;
                            }
                            currentIndex++;
                        }
                    }
                }
                break;
            case Direction.UP:
                for (let i = 1; i < updatedField.length; i++) {
                    const row = updatedField[i];

                    for (let j = 0; j < row.length; j++) {
                        if (row[j] === 0) {
                            continue;
                        }

                        let merged = false;
                        let currentIndex = i;
                        let currentValue = row[j];
                        while (currentIndex > 0) {
                            if (updatedField[currentIndex - 1][j] === 0 || (!merged && updatedField[currentIndex - 1][j] === updatedField[currentIndex][j])) {
                                updatedField[currentIndex - 1][j] += updatedField[currentIndex][j];
                                updatedField[currentIndex][j] = 0;
                                if (updatedField[currentIndex - 1][j] !== currentValue) {
                                    merged = true;
                                }
                                changesMade++;
                            }
                            currentIndex--;
                        }
                    }
                }
                break;
        }

        if (changesMade > 0) {
            setField([...updatedField]);
            spawnRandomTile(updatedField, 1);
        }
    };

    const attemptToFillTile = (currentField: Array<Array<number>>): Array<Array<number>> => {
        const updatedField = currentField;

        const row = Math.floor(Math.random() * 100) % 3;
        const cell = Math.floor(Math.random() * 100) % 3;

        if (updatedField[row][cell] === 0) {
            updatedField[row][cell] = (Math.random() * 100) > 90 ? 4 : 2;
            return updatedField;
        } else {
            return attemptToFillTile(updatedField);
        }
    };

    const spawnRandomTile = (currentField: Array<Array<number>>, amount: number) => {
        let updatedField = currentField;

        for (let i = 0; i < amount; i++) {
            updatedField = attemptToFillTile(updatedField);
        }
    };

    useEffect(() => {
        if (!gameStarted) {
            spawnRandomTile(field, 2);
            setGameStarted(true);
        }
    }, []);

    return (
        <>
            <StatusBar barStyle={'dark-content'}/>
            <SafeAreaView style={{flex: 1}}>
                <GestureHandler move={(direction: Direction) => move(direction)} containerStyle={styles.mainContainer}>
                    <Text>2048</Text>
                    <Grid state={field}/>
                </GestureHandler>
            </SafeAreaView>
        </>
    );
};

export default App;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
