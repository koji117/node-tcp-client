import {convertCsvToArray} from "./tcp-client";

describe("convert", (): void => {
    test("File should be converted to a csv array ", (): void => {
        const dataPath = "./data/avl.csv";
        const response: string[] = convertCsvToArray(dataPath);
        expect(response.length).toBeGreaterThan(10);
    });
});
