export const ELECTRICITY_BILL = 'ELECTRICITY';

export const WATER_BILL = 'WATER';

export const BILL_BARCODE_PARTS = {  // start,length
   [ELECTRICITY_BILL]: {
       LENGTH: 30,
       SERVICE_NUMBER: {
           start: 2,
           length: 12
       },
       DATE: {
           start: 14,
           length: 6
       },
       AMOUNT: {
           start: 20,
           length: 9
       }
   },
   [WATER_BILL]: {
       LENGTH: 32,
       CAPTURE_LINE: {
           start: 0,
           length: 20
       },
       AMOUNT: {
           start: 20,
           length: 9
       }
   }
};
