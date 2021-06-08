import {CellData} from '../components/Grid/Cell/CellData';
import {theme} from './theme';

const emptyField = (): Array<Array<CellData | null>> => {
    const grid: Array<Array<CellData | null>> = [];

    for (let rowIndex = 0; rowIndex < theme.ROW_LENGTH; rowIndex++) {
        const row: Array<CellData | null> = [];

        for (let cell = 0; cell < theme.ROW_LENGTH; cell++) {
            row.push(null);
        }

        grid.push(row);
    }

    return grid;
};

export default emptyField;
