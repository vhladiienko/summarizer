# Proof of concept
1. Accepts an audio file as an imput
2. Sends the file for transcription
3. Fills in the text area with the transcript
4. Sends the transcript with a prompt to recap it and list action items

# Developement
1. Clone
2. Rename .env.template to .env
3. Fill in your API key
4. Run `npm i` and `npm run dev`

# Docker
Run `docker run -it --rm --name summarizer -p 3000:3000 --env OPENAI_API_KEY=your_key vhladiienko/summarizer:latest`