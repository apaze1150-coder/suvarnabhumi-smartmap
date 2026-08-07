const fs = require('fs');
const csv = require('csv-parser');

const inputCsv = 'panpuri_products_backup.csv';
const outputCsv = 'panpuri_products.csv';

const results = [];

fs.createReadStream(inputCsv)
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      Code: data.product_code || data.product_id,
      Description: data.product_name,
      Reference: data.scent || '',
      Category: data.category,
      'Sub-Category': data.sub_category || '',
      Price: data.price,
      Image: data.image || '',
      Qty_Branch1: data.qty_de40 || '0',
      Qty_Branch2: data.qty_de12 || '0',
      Qty_Branch3: data.qty_dw41 || '0'
    });
  })
  .on('end', () => {
    const headers = ['Code', 'Description', 'Reference', 'Category', 'Sub-Category', 'Price', 'Image', 'Qty_Branch1', 'Qty_Branch2', 'Qty_Branch3'];
    
    // Properly escape CSV fields
    const escapeCsv = (val) => {
      if (val == null) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    let csvContent = headers.join(',') + '\n';
    
    for (const row of results) {
      csvContent += headers.map(header => escapeCsv(row[header])).join(',') + '\n';
    }
    
    fs.writeFileSync(outputCsv, csvContent);
    console.log('CSV converted and written successfully to panpuri_products.csv');
  });
