export interface Assertion {
  reset(): void;
  inject(): void;
  assert(): void;
  restore(): void;
}

export default function setupQUnit(assertion: Assertion, _qunitGlobal: QUnit) {
  let qunitGlobal = QUnit;

  if (_qunitGlobal) {
    qunitGlobal = _qunitGlobal;
  }

  let originalModule = qunitGlobal.module;

  qunitGlobal.module = function(name: string, _options: any) {
    let options = _options || {};
    let originalSetup = options.setup || options.beforeEach || function() {};
    let originalTeardown = options.teardown || options.afterEach || function() {};

    delete options.setup;
    delete options.teardown;

    options.beforeEach = function() {
      assertion.reset();
      assertion.inject();

      return originalSetup.apply(this, arguments);
    };

    options.afterEach = function() {
      let result = originalTeardown.apply(this, arguments);

      assertion.assert();
      assertion.restore();

      return result;
    };

    return originalModule(name, options);
  };
}
