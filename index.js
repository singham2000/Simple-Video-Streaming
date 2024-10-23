const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/video', (req, res) => {
  const videoPath = 'path/to/your/video.mp4';
  const videoSize = fs.statSync(videoPath).size;
  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires Range header');
  }
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  const start = Number(range.replace(/bytes=/, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
