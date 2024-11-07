module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.message === 'Parameter not found.') {
    res.status(404).json({ error: err.message });
  }  else if (err.message.includes('validation')) {
    res.status(400).json({ error: err.message });
  }  else if (err.message === 'Invalid token') {
    res.status(403).json({ error: err.message });
  } else if (err.message === 'Parameter with this key already exists.') {
    res.status(409).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
