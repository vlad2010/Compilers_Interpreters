// class to store variables environment context
class Environment {
  /*
	    Creates environment with the given record
	*/
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  /*
	   Create variable with a given name and value
	*/
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  assign(name, value) {
    this._resolve(name).record[name] = value;
    return value;
  }

  // Return value of variable
  lookup(name) {
    return this._resolve(name).record[name];
  }

  // return environment where variable is define, or throw exception if not found
  _resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent == null) {
      throw new ReferenceError(`Variable "${name}" is not defined `);
    }

    return this.parent._resolve(name);
  }
}

module.exports = Environment;
