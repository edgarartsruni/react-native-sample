import {BILL_BARCODE_PARTS, ELECTRICITY_BILL, WATER_BILL} from "../constants/bill-vars";

const INVALID_BARCODE =  {
    data: [],
    errorMessage: "INVALID BARCODE",
    success: false
};

export const changeBarcodeData = (type, code) => {
    let response = INVALID_BARCODE;
    try {
        const bill = BILL_BARCODE_PARTS[type];
        if (bill.LENGTH === code.length) {
            switch (type) {
                case ELECTRICITY_BILL:
                    response = electricityBarcode(bill, code);
                    break;
                case WATER_BILL:
                    response = waterBarcode(bill, code);
                    break;
            }
        }
    } catch (e) {
        response = {
            data: [],
            errorMessage: e.message,
            success: false
        }
    }
    return response;
};


export const electricityBarcode = (bill, code) => {
    const serviceNumber = code.slice(bill.SERVICE_NUMBER.start,bill.SERVICE_NUMBER.start + bill.SERVICE_NUMBER.length);
    const date = code.slice(bill.DATE.start,bill.DATE.start + bill.DATE.length);
    const amount = code.slice(bill.AMOUNT.start,bill.AMOUNT.start + bill.AMOUNT.length);
    return  {
        data: {
            SERVICE_NUMBER:  {
                label: 'Service Number',
                key: 'serviceNumber',
                value: serviceNumber,
                prettyValue: serviceNumber
            },
            AMOUNT: {
                label: 'Amount',
                key: 'amount',
                value: parseFloat(amount),
                prettyValue: `$${parseFloat(amount).toFixed(2)}`
            },
            DATE: {
                label: 'Date',
                key: 'date', // 200314 -> Date i.e. March 14th 2020
                value: date,
                prettyValue: `${date.slice(4,6)}/${date.slice(2,4)}/${date.slice(0,2)}`
            }
        },
        errorMessage: '',
        success: true
    };
};

export const waterBarcode = (bill, code) => {
    const captureLine = code.slice(bill.CAPTURE_LINE.start,bill.CAPTURE_LINE.start + bill.CAPTURE_LINE.length);
    const amount = code.slice(bill.AMOUNT.start,bill.AMOUNT.start + bill.AMOUNT.length);
    return  {
        data: {
            SERVICE_NUMBER:  {
                label: 'Capture Line',
                key: 'serviceNumber',
                value: captureLine,
                prettyValue: captureLine
            },
            AMOUNT:{
                label: 'Amount',
                key: 'amount',
                value: parseFloat(amount),
                prettyValue: `$${parseFloat(amount).toFixed(2)}`
            }
        },
        errorMessage: '',
        success: true,
    };
};


