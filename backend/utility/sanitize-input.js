module.exports = function sanitizeInput(input) {
  const blacklist = [
    "DROP TABLE",
    "SELECT *",
    "DELETE FROM",
    "INSERT INTO",
    "UPDATE",
    "--",
    ";",
    "/*",
    "*/",
  ];

  // Se l'input è una stringa, esegui la sanitizzazione
  if (typeof input === 'string') {
    for (let term of blacklist) {
      const regex = new RegExp(term, 'i');
      if (regex.test(input)) {
        throw new Error(`Input contains forbidden term: ${term}`);
      }
    }
  }

  return input
