const randomstring = require('randomstring');

function generateUniqueId(idSetToAvoid) {
  while (true) {
    const id = randomstring.generate({length: 7});
    if (!idSetToAvoid.has(id)) return id;
  }
}

module.exports = {generateUniqueId};
