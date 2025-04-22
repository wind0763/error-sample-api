
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.use(bodyParser.json());

app.post('/add-error-sample', async (req, res) => {
  const sample = req.body;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: '工作表1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            sample["錯誤樣本編號"],
            sample["聯盟"],
            sample["日期"],
            sample["對戰隊伍"],
            sample["預測方向"],
            sample["結果"],
            sample["錯誤歸因"],
            sample["優化方向"],
            sample["模組分類"],
            sample["是否納入修正模組"]
          ]
        ]
      }
    });
    res.status(200).send('成功寫入 Google Sheet');
  } catch (error) {
    console.error('寫入失敗：', error);
    res.status(500).send('寫入失敗');
  }
});

app.get('/', (req, res) => {
  res.send('錯誤樣本 API 運作中');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
