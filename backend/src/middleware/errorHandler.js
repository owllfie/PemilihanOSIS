const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err.stack || err.message || err);
  
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Ukuran file melebihi batas maksimal 2MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Terjadi kesalahan internal pada server.',
  });
};

module.exports = errorHandler;
