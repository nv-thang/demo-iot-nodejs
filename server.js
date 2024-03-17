var admin = require("firebase-admin");
const express = require('express');
var serviceAccount = require("./serviceAccountKey.json");

const app = express();


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "YOUR_DB_URL" //thay thế URL DB
});

// Lấy reference đến Realtime Database
const db = admin.database();
const ref = db.ref('weather_data');

// Route để hiển thị dữ liệu trên trang web
app.get('/', (req, res) => {
    // Đọc dữ liệu từ Realtime Database
    ref.once('value', snapshot => {
        const data = snapshot.val();
        const temperature = data.temperature;
        const humidity = data.humidity;

        // Render trang web với dữ liệu từ Firebase
        res.send(`
            <h1>Dữ liệu từ Firebase Realtime Database</h1>
            <p>Nhiệt độ: ${temperature}°C</p>
            <p>Độ ẩm: ${humidity}%</p>
        `);
    }).catch(error => {
        console.error('Lỗi khi đọc dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi đọc dữ liệu từ Firebase.');
    });
});

// Khởi động server
const port = 3000;
app.listen(port, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});