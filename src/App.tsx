import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Grid from './components/Grid';
import GestureHandler, {Direction} from './components/GestureHandler';
import {CellData} from './components/Grid/Cell/CellData';
import {theme} from './config/theme';
import {getCurrentField, getCurrentScore, getHighScore, saveCurrentField, saveCurrentScore, saveHighScore} from './config/store';
import Header from './components/Header';
import emptyField from './config/emptyField';

const App = () => {
    const [field, setField] = useState<Array<Array<CellData | null>>>(emptyField());
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            const currentField = await getCurrentField();
            const currentScore = await getCurrentScore();
            const currentHighScore = await getHighScore();
            if (currentHighScore) {
                setHighScore(currentHighScore);
            }

            if (currentField && currentScore) {
                setField([...currentField]);
                setScore(currentScore);
            } else {
                spawnRandomCell(field, 2);
            }
            setLoaded(true);
        })();
    }, []);

    useEffect(() => {
        if (loaded) {
            (async () => {
                await saveCurrentScore(score);
            })();
        }
    }, [score, loaded]);

    useEffect(() => {
        if (loaded) {
            (async () => {
                await saveHighScore(score);
            })();
        }
    }, [highScore, loaded]);

    useEffect(() => {
        if (loaded) {
            (async () => {
                await saveCurrentField(field);
            })();
        }
    }, [field, loaded]);

    const updateAllCells = (axis: 'horizontal' | 'vertical', start: number, end: number): boolean => {
        if (start === end) {
            return false;
        }

        const updatedField = field;
        let changesMade = 0;

        const horizontalMovement = axis === 'horizontal';

        const rowStart = !horizontalMovement ? start : 0;
        const rowEnd = !horizontalMovement ? end : field.length - 1;

        const cellStart = horizontalMovement ? start : 0;
        const cellEnd = horizontalMovement ? end : field.length - 1;

        const inverse = start > end;

        for (
            let rowIndex = rowStart;
            rowEnd > rowStart ? rowIndex <= rowEnd : rowIndex >= rowEnd;
            rowEnd > rowStart ? rowIndex++ : rowIndex--
        ) {

            for (
                let cellIndex = cellStart;
                cellEnd > cellStart ? cellIndex <= cellEnd : cellIndex >= cellEnd;
                cellEnd > cellStart ? cellIndex++ : cellIndex--
            ) {

                if (!updatedField[rowIndex][cellIndex]) {
                    continue;
                }

                let currentIndex = horizontalMovement ? cellIndex : rowIndex;
                const currentCell = updatedField[rowIndex][cellIndex];

                let merged = false;
                let moveAmount = 0;
                while ((inverse ? currentIndex > end : currentIndex < end) || !merged) {
                    const nextIndex = inverse ? currentIndex + 1 : currentIndex - 1;
                    const rowIndexToCheck = horizontalMovement ? rowIndex : nextIndex;
                    const cellIndexToCheck = horizontalMovement ? nextIndex : cellIndex;

                    if (inverse ? nextIndex > start : nextIndex < start) {
                        break;
                    }

                    if (updatedField[rowIndexToCheck][cellIndexToCheck] !== null && updatedField[rowIndexToCheck][cellIndexToCheck]?.value === currentCell?.value) {
                        updatedField[rowIndexToCheck][cellIndexToCheck] = null;
                        merged = true;
                    }
                    if (updatedField[rowIndexToCheck][cellIndexToCheck] === null) {
                        inverse ? moveAmount++ : moveAmount--;
                        inverse ? currentIndex++ : currentIndex--;
                        changesMade++;
                    } else {
                        break;
                    }
                }
                if (moveAmount !== 0) {
                    if (merged && currentCell) {
                        currentCell.doubleValue();
                        const newScore = score + currentCell.value;
                        setScore(newScore);

                        if (newScore > highScore) {
                            setHighScore(newScore);
                        }
                    }
                    updatedField[horizontalMovement ? rowIndex : rowIndex + moveAmount][horizontalMovement ? cellIndex + moveAmount : cellIndex] = currentCell;
                    updatedField[rowIndex][cellIndex] = null;
                }
            }
        }

        setField([...updatedField]);

        return changesMade > 0;
    };

    const move = (direction: Direction) => {
        const updatedField = field;

        const filledCellCount = updatedField.reduce((acc, cur) => {
            return acc + cur.reduce((acc, cur) => acc + (cur !== null ? 1 : 0), 0);
        }, 0);

        if (filledCellCount >= 16) {
            return;
        }

        let changed = false;

        switch (direction) {
            case Direction.LEFT:
                changed = updateAllCells('horizontal', 0, theme.ROW_LENGTH - 1);
                break;
            case Direction.RIGHT:
                changed = updateAllCells('horizontal', theme.ROW_LENGTH - 1, 0);
                break;
            case Direction.UP:
                changed = updateAllCells('vertical', 0, theme.ROW_LENGTH - 1);
                break;
            case Direction.DOWN:
                changed = updateAllCells('vertical', theme.ROW_LENGTH - 1, 0);
                break;
        }

        if (changed) {
            setTimeout(() => {
                spawnRandomCell(updatedField, 1);
            }, 250);
        }
    };

    const attemptToFillCell = (currentField: Array<Array<CellData | null>>): Array<Array<CellData | null>> => {
        const updatedField = currentField;

        const row = Math.floor(Math.random() * 100) % theme.ROW_LENGTH;
        const cell = Math.floor(Math.random() * 100) % theme.ROW_LENGTH;

        if (!updatedField[row][cell]) {
            updatedField[row][cell] = new CellData();
            updatedField[row][cell]?.location.setValue({x: cell * theme.CELL_SIZE, y: row * theme.CELL_SIZE});
            return updatedField;
        } else {
            return attemptToFillCell(updatedField);
        }
    };

    const spawnRandomCell = (currentField: Array<Array<CellData | null>>, amount: number) => {
        let updatedField = currentField;

        for (let i = 0; i < amount; i++) {
            updatedField = attemptToFillCell(updatedField);
        }

        setField([...updatedField]);
    };

    return (
        <>
            <StatusBar barStyle={'dark-content'}/>
            <SafeAreaView style={styles.mainContainer}>
                <Header
                    score={score}
                    highScore={highScore}
                    buttons={[
                        {
                            icon: 'refresh',
                            onPress: () => {
                                spawnRandomCell(emptyField(), 2);
                                setScore(0);
                            }
                        }
                    ]}
                />
                <View style={styles.gridContainer}>
                    <GestureHandler field={field} move={(direction: Direction) => move(direction)}>
                        <Grid state={field}/>
                    </GestureHandler>
                </View>
            </SafeAreaView>
        </>
    );
};

export default App;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background
    },
    gridContainer: {
        borderColor: theme.colors.brown,
        borderWidth: 2,
        borderRadius: 8,
        marginVertical: 40
    }
});
