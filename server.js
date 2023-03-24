const dotenv = require('dotenv')
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const bodyParser = require('body-parser');
const app = express();
const upload = multer({ dest: 'uploads/' });

dotenv.config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiUrlAudio = 'https://api.openai.com/v1/audio/transcriptions';
const apiUrlChat = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.OPENAI_API_KEY;

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
    });
    formData.append('model', 'whisper-1');
    const headers = {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      'Authorization': `Bearer ${apiKey}`,
    };

    const transcriptionResponse = await axios.post(apiUrlAudio, formData, { headers });
    
    res.json({ 
      transcript: transcriptionResponse.data.text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the file.' });
  }
});

app.post('/summarize', async (req, res) => {
  try {
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{"role": "user", "content": `Recap below meeting transcription with bullet points and outline action points:\n\n${req.body.transcript}`}]
    };
    const headers = {
      'Authorization': `Bearer ${apiKey}`
    };
    const completionResponse = await axios.post(apiUrlChat, data, { headers });

    res.json({
      recap: completionResponse.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generationg summary' });
  }
    
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
