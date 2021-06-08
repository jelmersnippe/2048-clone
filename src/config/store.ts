import AsyncStorage from '@react-native-async-storage/async-storage';
import {CellData} from '../components/Grid/Cell/CellData';
import {theme} from './theme';

const HIGH_SCORE_KEY = 'HIGH_SCORE';
const CURRENT_SCORE_KEY = 'CURRENT_SCORE';
const CURRENT_BOARD_KEY = 'CURRENT_BOARD';

export const saveHighScore = async (value: number) => {
    const currentHighScore = await getHighScore();

    if (!currentHighScore || value > currentHighScore) {
        await AsyncStorage.setItem(HIGH_SCORE_KEY, value.toString());
    }
};

export const saveCurrentScore = async (value: number) => {
    await AsyncStorage.setItem(CURRENT_SCORE_KEY, value.toString());
};

export const saveCurrentField = async (field: Array<Array<CellData | null>>) => {
    const simplifiedField: Array<Array<number | null>> = field.map((row) => {
        return row.map((cell) => {
            return cell ? cell.value : null;
        });
    });
    const jsonValue = JSON.stringify(simplifiedField);
    await AsyncStorage.setItem(CURRENT_BOARD_KEY, jsonValue);
};

export const getHighScore = async (): Promise<number | null> => {
    const highScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    if (!highScore) {
        return null;
    }

    return parseInt(highScore, 10);
};

export const getCurrentScore = async (): Promise<number | null> => {
    const currentScore = await AsyncStorage.getItem(CURRENT_SCORE_KEY);
    if (!currentScore) {
        return null;
    }

    return parseInt(currentScore, 10);
};

export const getCurrentField = async (): Promise<Array<Array<CellData | null>> | null> => {
    const jsonValue = await AsyncStorage.getItem(CURRENT_BOARD_KEY);
    const simplifiedField: Array<Array<number | null>> = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (!simplifiedField) {
        return null;
    }

    return simplifiedField.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
            if (!cell) {
                return null;
            }

            const cellData = new CellData();
            cellData.setValue(cell);
            cellData.setLocation({x: cellIndex * theme.CELL_SIZE, y: rowIndex * theme.CELL_SIZE});
            return cellData;
        });
    });
};
