/* eslint-disable node/no-unsupported-features */

const TapReporter = require('testem/lib/reporters/tap_reporter');

class FailureOnlyReporter extends TapReporter {
  constructor(...args) {
    super(...args);
    this._reportCount = 0;
  }

  display(prefix, result) {
    this._reportCount++;

    if (!result.passed) {
      super.display(prefix, result);
    }

    if (this._reportCount > 100) {
      this.out.write('pass count: ' + this.pass + '\n');
      this._reportCount = 0;
    }
  }
}

module.exports = FailureOnlyReporter;
