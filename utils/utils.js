const randomstring = require('randomstring');

/**
 * Generates a random seven-character ID that's different from the provided set
 * of IDs.
 *
 * @param {object} idSetToAvoid The set of IDs, from which the generated ID is
 * not a member of.
 *
 * @return {string} A seven-character ID that consists of alphanumeric
 * characters.
 */
function generateUniqueId(idSetToAvoid) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const id = randomstring.generate({length: 7});
    if (!idSetToAvoid.has(id)) return id;
  }
}

module.exports = {generateUniqueId};
