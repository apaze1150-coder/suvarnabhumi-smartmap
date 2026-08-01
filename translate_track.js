const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacements = [
    {
        from: /รอรับ Order/g,
        to: "Pending"
    },
    {
        from: /ร้านค้าได้รับ Order ของท่านแล้ว กำลังตรวจสอบ/g,
        to: "The store has received your order and is processing it"
    },
    {
        from: /รับ Order แล้ว/g,
        to: "Confirmed"
    },
    {
        from: /พนักงานรับ Order เรียบร้อยแล้ว/g,
        to: "Staff has confirmed your order"
    },
    {
        from: /กำลังจัดสินค้า/g,
        to: "Preparing"
    },
    {
        from: /พนักงานกำลังจัดเตรียมสินค้าของท่าน/g,
        to: "Staff is preparing your items"
    },
    {
        from: /พร้อมรับสินค้า/g,
        to: "Ready"
    },
    {
        from: /สินค้าพร้อมแล้ว! กรุณามารับที่ร้าน/g,
        to: "Items are ready! Please pick up at the store"
    },
    {
        from: /ยกเลิก/g,
        to: "Cancelled" // This might match 'ยกเลิกรายการจองนี้' partially, but regex with exact match handles it well if we are careful. Wait, I'll use precise strings.
    },
    {
        from: /Order นี้ถูกยกเลิก/g,
        to: "This order has been cancelled"
    },
    {
        from: /สินค้าหมด/g,
        to: "Out of Stock"
    },
    {
        from: /สินค้าบางรายการหมดสต็อก กรุณาติดต่อร้านค้า/g,
        to: "Some items are out of stock. Please contact the store"
    },
    {
        from: /หมายเหตุจากร้านค้า:/g,
        to: "Note from store:"
    },
    {
        from: /ยอดรวม/g,
        to: "Total"
    },
    {
        from: /ลูกค้า:/g,
        to: "Customer:"
    },
    {
        from: /ไฟลท์:/g,
        to: "Flight:"
    },
    {
        from: /รับสินค้าที่ร้าน/g,
        to: "Pick up at store"
    },
    {
        from: /นำทาง/g,
        to: "Navigate"
    },
    {
        from: /ยกเลิกรายการจองนี้/g,
        to: "Cancel this order"
    },
    {
        from: /ไม่สามารถเชื่อมต่อได้/g,
        to: "Unable to connect"
    },
    {
        from: /ประวัติการสั่งจองล่าสุดของคุณ:/g,
        to: "Your recent order history:"
    },
    {
        from: /ล้างประวัติ/g,
        to: "Clear history"
    },
    {
        from: /คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำสั่งจองนี้\?/g,
        to: "Are you sure you want to cancel this order?"
    },
    {
        from: /ยกเลิก Order สำเร็จ/g,
        to: "Order cancelled successfully"
    },
    {
        from: /ไม่สามารถยกเลิกได้/g,
        to: "Unable to cancel"
    },
    {
        from: /ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้/g,
        to: "Unable to connect to server"
    },
    {
        from: /ต้องการล้างประวัติการสั่งจองในเครื่องนี้หรือไม่\? \(จะทำให้สัญลักษณ์รถเข็นหายไป\)/g,
        to: "Do you want to clear the order history on this device? (The cart icon will disappear)"
    },
    // Fix mojibake
    {
        from: /Ã—/g,
        to: "×"
    },
    {
        from: /â€¢/g,
        to: "•"
    },
    {
        from: /ðŸ’¬/g,
        to: "💬"
    }
];

// Refine 'ยกเลิก' specifically in statusMap to not over-replace
content = content.replace(/label: 'ยกเลิก'/g, "label: 'Cancelled'");

for (const r of replacements) {
    if (r.from.toString() !== "/ยกเลิก/g") {
        content = content.replace(r.from, r.to);
    }
}

fs.writeFileSync('index.html', content);
console.log("Translation applied successfully");
