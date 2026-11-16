 function labelParser(extractedText) {
   const quantityRegex = /(?:Net\s*(?:Wt|Weight|Qty|Quantity|Volume)\.?)\s*:?\s*(\d+(?:\.\d+)?)\s*(kg|g|ml|l)/i;
const quantity = extractedText.match(quantityRegex);
  
const mrpRegex = /(?:MRP|M\.R\.P\.|Maximum\s*Retail\s*Price)\s*:?\s*(?:(?:Rs\.?|INR|₹)\s*)?(\d+(?:\.\d{1,2})?)/i;
const MRP = extractedText.match(mrpRegex);

const productNameRegex = /(?:Product\s*Name|Name\s*of\s*Product)\s*[:\-]\s*([^\n]+)/i;
const productName = extractedText.match(productNameRegex);

const brandRegex = /Brand\s*[:\-]\s*([^\n]+)/i;
const brand = extractedText.match(brandRegex);

const manufacturerRegex = /(?:Manufactured\s*by|Manufactured\s*&\s*Packed\s*by|Mfd\.?\s*by)\s*[:\-]?\s*([^\n]+)/i;
const manufacturer = extractedText.match(manufacturerRegex);

const addressRegex = /(?:Address|Add\.?)\s*[:\-]\s*([^\n]+)/i;
const address = extractedText.match(addressRegex);

const manufacturingDateRegex = /(?:Mfg\.?\s*Date|Manufacturing\s*Date|Date\s*of\s*Manufacture)\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4}|[A-Za-z]{3,9}\s*,?\s*[0-9]{4})/i;
const manufacturingDate = extractedText.match(manufacturingDateRegex);

const expiryDateRegex = /(?:Expiry|Expires|Use\s*By|Best\s*Before)\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4}|[A-Za-z]{3,9}\s*,?\s*[0-9]{4})/i;
const expiryDate = extractedText.match(expiryDateRegex);

const batchRegex = /(?:Batch\s*(?:No\.?|Number)|Lot\s*(?:No\.?|Number))\s*[:\-]?\s*([A-Z0-9\-\/]+)/i;
const batch = extractedText.match(batchRegex);

const ingredientsRegex = /Ingredients?\s*[:\-]\s*([^\n]+)/i;
const ingredients = extractedText.match(ingredientsRegex);

const allergyRegex = /(?:Allergen\s*Information|Allergy\s*Advice|Contains|May\s*Contain)\s*[:\-]?\s*([^\n]+)/i;
const allergy = extractedText.match(allergyRegex);

const caloriesRegex = /(?:Energy|Calories)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(kcal|cal|kJ)?/i;
const calories = extractedText.match(caloriesRegex);

const servingSizeRegex = /Serving\s*Size\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(g|kg|ml|l)/i;
const servingSize = extractedText.match(servingSizeRegex);

const fatRegex = /Total\s*Fat\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i;
const fat = extractedText.match(fatRegex);

const saturatedFatRegex = /Saturated\s*Fat\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i;
const saturatedFat = extractedText.match(saturatedFatRegex);

const cholesterolRegex = /Cholesterol\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg/i;
const cholesterol = extractedText.match(cholesterolRegex);

const sodiumRegex = /Sodium\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*mg/i;
const sodium = extractedText.match(sodiumRegex);

const carbohydratesRegex = /(?:Total\s*)?Carbohydrates?\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i;
const carbohydrates = extractedText.match(carbohydratesRegex);

const proteinRegex = /Protein\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/i;
const protein = extractedText.match(proteinRegex);

  return {
    productName: productName ? productName[1].trim() : null,
    brand: brand ? brand[1].trim() : null,

    netQuantity: quantity ? `${quantity[1]} ${quantity[2]}` : null,
    mrp: MRP ? MRP[1] : null,

    manufacturer: {
        name: manufacturer ? manufacturer[1].trim() : null,
        address: address ? address[1].trim() : null
    },

    manufacturingDate: manufacturingDate ? manufacturingDate[1] : null,
    expiryDate: expiryDate ? expiryDate[1] : null,
    batchNumber: batch ? batch[1] : null,

    ingredients: ingredients
        ? ingredients[1].split(',').map(item => item.trim())
        : [],

    allergyAdvice: allergy ? allergy[1].trim() : null,

    nutrition: {
        servingSize: servingSize ? servingSize[1] : null,
        calories: calories ? calories[1] : null,
        totalFat: fat ? fat[1] : null,
        saturatedFat: saturatedFat ? saturatedFat[1] : null,
        cholesterol: cholesterol ? cholesterol[1] : null,
        sodium: sodium ? sodium[1] : null,
        carbohydrates: carbohydrates ? carbohydrates[1] : null,
        protein: protein ? protein[1] : null
    }
};

}

module.exports=labelParser;