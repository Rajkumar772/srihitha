import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumToWordsServicesService {

  constructor() { }


  numberToWordsInIndianFormat(num) {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"
    ];
    const teens = [
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = [
      "", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    const thousands = [
      "", "Thousand", "Lakh", "Crore"
    ];

    function convertToWords(n) {
      if (n === 0) return "Zero";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 11];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "");
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 > 0 ? " and " + convertToWords(n % 100) : "");

      let result = "";
      let parts = [];

      if (n >= 10000000) {
        parts.push(Math.floor(n / 10000000));
        n = n % 10000000;
      }
      if (n >= 100000) {
        parts.push(Math.floor(n / 100000));
        n = n % 100000;
      }
      if (n >= 1000) {
        parts.push(Math.floor(n / 1000));
        n = n % 1000;
      }
      if (n > 0) {
        parts.push(n);
      }

      for (let i = 0; i < parts.length; i++) {
        let partValue = parts[i];
        let partWord = "";
        if (partValue > 99) {
          partWord += ones[Math.floor(partValue / 100)] + " Hundred ";
          partValue = partValue % 100;
        }
        if (partValue > 10 && partValue < 20) {
          partWord += teens[partValue - 11] + " ";
        } else {
          if (partValue >= 10) {
            partWord += tens[Math.floor(partValue / 10)] + " ";
            partValue = partValue % 10;
          }
          if (partValue > 0) {
            partWord += ones[partValue] + " ";
          }
        }

        if (i === 0 && parts.length > 1) {
          result += partWord.trim() + " " + thousands[parts.length - 1] + " ";
        } else {
          result += partWord.trim() + " " + thousands[parts.length - 1 - i] + " ";
        }
      }

      return result.trim();
    }

    function convertDecimals(decimals) {
      return convertToWords(decimals) + " Paise";
    }
    const [integerPart, decimalPart] = num.toString().split(".");

    let words = convertToWords(parseInt(integerPart)) + " Rupees";

    if (decimalPart) {
      words += " and " + convertDecimals(parseInt(decimalPart.substring(0, 2)));
    } else {
      words += " Only";
    }

    return words;
  }
}
