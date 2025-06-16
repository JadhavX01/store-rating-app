const bcrypt = require('bcrypt');

const password = 'Admin@123'; // change this to whatever password you want to hash

bcrypt.hash(password, 10).then(hash => {
  console.log(`Hashed password: ${hash}`);
});
