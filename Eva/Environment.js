// class to store variables environment context
class Environment {
  /*
	    Creates environment with the given record
	*/

  constructor(record = {}) {
    this.record = record;
  }

  /*
	   Create variable with a given name and value
	*/
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  // Return value of variable
  lookup(name) {
    if (!this.record.hasOwnProperty(name)) {
      throw new ReferenceError(`Variable "${name}" is not defined `);
    }

    return this.record[name];
  }
}

module.exports = Environment;
