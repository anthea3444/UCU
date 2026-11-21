const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sends back a list of problems, one per field, so the interface can show them next to the right input
const reject = (res, errors) =>
  res.status(400).json({ message: 'Please correct the highlighted fields', errors });

exports.validateRegister = (req, res, next) => {
  const errors = [];
  const full_name = (req.body.full_name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (full_name.length < 2 || full_name.length > 100) {
    errors.push({ field: 'full_name', message: 'Enter your full name (2 to 100 characters).' });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 100) {
    errors.push({ field: 'email', message: 'Enter a valid email address, for example name@ucu.ac.ug.' });
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Use at least 8 characters, including at least one letter and one number.',
    });
  }

  if (errors.length > 0) return reject(res, errors);

  req.body.full_name = full_name;
  req.body.email = email;
  next();
};

exports.validateLogin = (req, res, next) => {
  const errors = [];
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!EMAIL_PATTERN.test(email)) {
    errors.push({ field: 'email', message: 'Enter the email address you registered with.' });
  }
  if (password.length === 0) {
    errors.push({ field: 'password', message: 'Enter your password.' });
  }

  if (errors.length > 0) return reject(res, errors);

  req.body.email = email;
  next();
};