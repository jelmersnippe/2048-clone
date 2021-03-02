import React, {useEffect, useState} from 'react';
import {Animated, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Grid from './grid';
import GestureHandler, {Direction} from './GestureHandler';
import {TileData} from './grid/TileData';

export const TILE_SIZE = 50;

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [field, setField] = useState<Array<Array<TileData | null>>>([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
    ]);

    const debugLog = () => {
        for (let row = 0; row < field.length; row++) {
            let rowString = '';
            for (let cell = 0; cell < field[row].length; cell++) {
                rowString += field[row][cell]?.value ?? 0;
            }
            console.log(rowString);
        }
    };

    useEffect(() => {
        debugLog();
    }, [field]);

    const move = (direction: Direction) => {
        const updatedField = field;
        let changesMade = 0;

        switch (direction) {
            case Direction.LEFT:
                for (let i = 0; i < updatedField.length; i++) {
                    const row = updatedField[i];

                    for (let j = 1; j < row.length; j++) {
                        if (!row[j]) {
                            continue;
                        }

                        let currentIndex = j;
                        let merged = false;
                        let moveAmount = 0;
                        while (currentIndex > 0 && !merged) {
                            if (row[currentIndex - 1] === null || (row[currentIndex - 1]?.value && row[j]?.value && row[currentIndex - 1]?.value === row[j]?.value)) {
                                if (row[currentIndex - 1] !== null) {
                                    row[j]?.doubleValue();
                                    merged = true;
                                }
                                moveAmount++;
                                changesMade++;
                            }
                            currentIndex--;
                        }
                        if (moveAmount > 0) {
                            row[j - moveAmount] = row[j];
                            row[j] = null;
                        }
                    }
                }
                break;
            case Direction.RIGHT:
                for (let i = 0; i < updatedField.length; i++) {
                    const row = updatedField[i];

                    for (let j = row.length - 2; j >= 0; j--) {
                        if (!row[j]) {
                            continue;
                        }

                        let currentIndex = j;
                        let merged = false;
                        let moveAmount = 0;
                        while (currentIndex < row.length - 1 && !merged) {
                            if (row[currentIndex + 1] === null || (row[currentIndex + 1]?.value && row[j]?.value && row[currentIndex + 1]?.value === row[j]?.value)) {
                                if (row[currentIndex + 1] !== null) {
                                    row[j]?.doubleValue();
                                    merged = true;
                                }
                                moveAmount++;
                                changesMade++;
                            }
                            currentIndex++;
                        }
                        if (moveAmount > 0) {
                            row[j + moveAmount] = row[j];
                            row[j] = null;
                        }
                    }
                }
                break;
            case Direction.DOWN:
                for (let i = updatedField.length - 2; i >= 0; i--) {
                    const row = updatedField[i];

                    for (let j = 0; j < row.length; j++) {
                        if (!row[j]) {
                            continue;
                        }

                        let merged = false;
                        let currentIndex = i;
                        let moveAmount = 0;
                        while (currentIndex < updatedField.length - 1 && !merged) {
                            if (!updatedField[currentIndex + 1][j] || (updatedField[currentIndex + 1][j]?.value && updatedField[i][j]?.value && updatedField[currentIndex + 1][j]?.value === updatedField[i][j]?.value)) {
                                if (updatedField[currentIndex + 1][j] !== null) {
                                    updatedField[i][j]?.doubleValue();
                                    merged = true;
                                }
                                moveAmount++;
                                changesMade++;
                            }
                            currentIndex++;
                        }
                        if (moveAmount > 0) {
                            updatedField[i + moveAmount][j] = updatedField[i][j];
                            updatedField[i][j] = null;
                        }
                    }
                }
                break;
            case Direction.UP:
                for (let i = 1; i < updatedField.length; i++) {
                    const row = updatedField[i];

                    for (let j = 0; j < row.length; j++) {
                        if (!row[j]) {
                            continue;
                        }

                        let merged = false;
                        let currentIndex = i;
                        let moveAmount = 0;
                        while (currentIndex > 0 && !merged) {
                            if (!updatedField[currentIndex - 1][j] || (updatedField[currentIndex - 1][j]?.value && updatedField[i][j]?.value && updatedField[currentIndex - 1][j]?.value === updatedField[i][j]?.value)) {
                                if (updatedField[currentIndex - 1][j] !== null) {
                                    updatedField[i][j]?.doubleValue();
                                    merged = true;
                                }
                                moveAmount++;
                                changesMade++;
                            }
                            currentIndex--;
                        }
                        if (moveAmount > 0) {
                            updatedField[i - moveAmount][j] = updatedField[i][j];
                            updatedField[i][j] = null;
                        }
                    }
                }
                break;
        }

        if (changesMade > 0) {
            setField([...updatedField]);
            setTimeout(() => {
                spawnRandomTile(updatedField, 1);
            }, 250);
        }
    };

    const attemptToFillTile = (currentField: Array<Array<TileData | null>>): Array<Array<TileData | null>> => {
        const updatedField = currentField;

        const row = Math.floor(Math.random() * 100) % 3;
        const cell = Math.floor(Math.random() * 100) % 3;

        if (!updatedField[row][cell]) {
            updatedField[row][cell] = new TileData();
            updatedField[row][cell]?.location.setValue({x: cell * TILE_SIZE, y: row * TILE_SIZE});
            return updatedField;
        } else {
            return attemptToFillTile(updatedField);
        }
    };

    useEffect(() => {
        field.forEach((row, i) => {
            row.forEach((e, j) => {
                if (e) {
                    Animated.timing(e.location, {
                        toValue: { x: TILE_SIZE * j, y: TILE_SIZE * i},
                        duration: 250,
                        useNativeDriver: true
                    }).start();
                }
            });
        });
    }, [field]);

    const spawnRandomTile = (currentField: Array<Array<TileData | null>>, amount: number) => {
        let updatedField = currentField;

        for (let i = 0; i < amount; i++) {
            updatedField = attemptToFillTile(updatedField);
        }

        setField([...updatedField]);
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
    },
    box: {
        height: 100,
        width: 100,
        borderRadius: 5,
        marginVertical: 40,
        backgroundColor: '#61dafb',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 8,
        color: '#000',
        textAlign: 'center'
    }
});
