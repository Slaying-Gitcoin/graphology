'use strict';

var events = require('events');
var Iterator = require('obliterator/iterator');
var take = require('obliterator/take');
var chain = require('obliterator/chain');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Iterator__default = /*#__PURE__*/_interopDefaultLegacy(Iterator);
var take__default = /*#__PURE__*/_interopDefaultLegacy(take);
var chain__default = /*#__PURE__*/_interopDefaultLegacy(chain);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Object.assign-like polyfill.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assignPolyfill() {
  var target = arguments[0];

  for (var i = 1, l = arguments.length; i < l; i++) {
    if (!arguments[i]) continue;

    for (var k in arguments[i]) {
      target[k] = arguments[i][k];
    }
  }

  return target;
}

var assign = assignPolyfill;
if (typeof Object.assign === 'function') assign = Object.assign;
/**
 * Function returning the first matching edge for given path.
 * Note: this function does not check the existence of source & target. This
 * must be performed by the caller.
 *
 * @param  {Graph}  graph  - Target graph.
 * @param  {any}    source - Source node.
 * @param  {any}    target - Target node.
 * @param  {string} type   - Type of the edge (mixed, directed or undirected).
 * @return {string|null}
 */

function getMatchingEdge(graph, source, target, type) {
  var sourceData = graph._nodes.get(source);

  var edge = null;
  if (!sourceData) return edge;

  if (type === 'mixed') {
    edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
  } else if (type === 'directed') {
    edge = sourceData.out && sourceData.out[target];
  } else {
    edge = sourceData.undirected && sourceData.undirected[target];
  }

  return edge;
}
/**
 * Checks whether the given value is a Graph implementation instance.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */

function isGraph(value) {
  return value !== null && _typeof(value) === 'object' && typeof value.addUndirectedEdgeWithKey === 'function' && typeof value.dropNode === 'function';
}
/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */

function isPlainObject(value) {
  return _typeof(value) === 'object' && value !== null && value.constructor === Object;
}
/**
 * Checks whether the given object is empty.
 *
 * @param  {object}  o - Target Object.
 * @return {boolean}
 */

function isEmpty(o) {
  var k;

  for (k in o) {
    return false;
  }

  return true;
}
/**
 * Creates a "private" property for the given member name by concealing it
 * using the `enumerable` option.
 *
 * @param {object} target - Target object.
 * @param {string} name   - Member name.
 */

function privateProperty(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: false,
    writable: true,
    value: value
  });
}
/**
 * Creates a read-only property for the given member name & the given getter.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
 * @param {mixed}    value  - The attached getter or fixed value.
 */

function readOnlyProperty(target, name, value) {
  var descriptor = {
    enumerable: true,
    configurable: true
  };

  if (typeof value === 'function') {
    descriptor.get = value;
  } else {
    descriptor.value = value;
    descriptor.writable = false;
  }

  Object.defineProperty(target, name, descriptor);
}
/**
 * Returns whether the given object constitute valid hints.
 *
 * @param {object} hints - Target object.
 */

function validateHints(hints) {
  if (!isPlainObject(hints)) return false;
  if (hints.attributes && !Array.isArray(hints.attributes)) return false;
  return true;
}
/**
 * Creates a function generating incremental ids for edges.
 *
 * @return {function}
 */

function incrementalIdStartingFromRandomByte() {
  var i = Math.floor(Math.random() * 256) & 0xff;
  return function () {
    return i++;
  };
}

/**
 * Graphology Custom Errors
 * =========================
 *
 * Defining custom errors for ease of use & easy unit tests across
 * implementations (normalized typology rather than relying on error
 * messages to check whether the correct error was found).
 */
var GraphError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(GraphError, _Error);

  function GraphError(message) {
    var _this;

    _this = _Error.call(this) || this;
    _this.name = 'GraphError';
    _this.message = message;
    return _this;
  }

  return GraphError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var InvalidArgumentsGraphError = /*#__PURE__*/function (_GraphError) {
  _inheritsLoose(InvalidArgumentsGraphError, _GraphError);

  function InvalidArgumentsGraphError(message) {
    var _this2;

    _this2 = _GraphError.call(this, message) || this;
    _this2.name = 'InvalidArgumentsGraphError'; // This is V8 specific to enhance stack readability

    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_assertThisInitialized(_this2), InvalidArgumentsGraphError.prototype.constructor);
    return _this2;
  }

  return InvalidArgumentsGraphError;
}(GraphError);
var NotFoundGraphError = /*#__PURE__*/function (_GraphError2) {
  _inheritsLoose(NotFoundGraphError, _GraphError2);

  function NotFoundGraphError(message) {
    var _this3;

    _this3 = _GraphError2.call(this, message) || this;
    _this3.name = 'NotFoundGraphError'; // This is V8 specific to enhance stack readability

    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_assertThisInitialized(_this3), NotFoundGraphError.prototype.constructor);
    return _this3;
  }

  return NotFoundGraphError;
}(GraphError);
var UsageGraphError = /*#__PURE__*/function (_GraphError3) {
  _inheritsLoose(UsageGraphError, _GraphError3);

  function UsageGraphError(message) {
    var _this4;

    _this4 = _GraphError3.call(this, message) || this;
    _this4.name = 'UsageGraphError'; // This is V8 specific to enhance stack readability

    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_assertThisInitialized(_this4), UsageGraphError.prototype.constructor);
    return _this4;
  }

  return UsageGraphError;
}(GraphError);

/**
 * Graphology Internal Data Classes
 * =================================
 *
 * Internal classes hopefully reduced to structs by engines & storing
 * necessary information for nodes & edges.
 *
 * Note that those classes don't rely on the `class` keyword to avoid some
 * cruft introduced by most of ES2015 transpilers.
 */

/**
 * MixedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
function MixedNodeData(key, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;
  this.clear();
}

MixedNodeData.prototype.clear = function () {
  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.undirectedDegree = 0;
  this.directedSelfLoops = 0;
  this.undirectedSelfLoops = 0; // Indices

  this["in"] = {};
  this.out = {};
  this.undirected = {};
};
/**
 * DirectedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */


function DirectedNodeData(key, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;
  this.clear();
}

DirectedNodeData.prototype.clear = function () {
  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0; // Indices

  this["in"] = {};
  this.out = {};
};

DirectedNodeData.prototype.upgradeToMixed = function () {
  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0; // Indices

  this.undirected = {};
};
/**
 * UndirectedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */


function UndirectedNodeData(key, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;
  this.clear();
}

UndirectedNodeData.prototype.clear = function () {
  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0; // Indices

  this.undirected = {};
};

UndirectedNodeData.prototype.upgradeToMixed = function () {
  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0; // Indices

  this["in"] = {};
  this.out = {};
};
/**
 * EdgeData class.
 *
 * @constructor
 * @param {boolean} undirected   - Whether the edge is undirected.
 * @param {string}  string       - The edge's key.
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */


function EdgeData(undirected, key, source, target, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;
  this.undirected = undirected; // Extremities

  this.source = source;
  this.target = target;
}

/**
 * Graphology Indexes Functions
 * =============================
 *
 * Bunch of functions used to compute or clear indexes.
 */

/**
 * Function updating the 'structure' index with the given edge's data.
 * Note that in the case of the multi graph, related edges are stored in a
 * set that is the same for A -> B & B <- A.
 *
 * @param {Graph}    graph      - Target Graph instance.
 * @param {EdgeData} edgeData   - Added edge's data.
 * @param {NodeData} sourceData - Source node's data.
 * @param {NodeData} targetData - Target node's data.
 */
function updateStructureIndex(graph, undirected, edgeData, source, target, sourceData, targetData) {
  var multi = graph.multi;
  var outKey = 'out';
  var inKey = 'in';
  if (undirected) outKey = inKey = 'undirected';
  var adj, container;

  if (multi) {
    // Handling source
    adj = sourceData[outKey];
    container = adj[target];

    if (typeof container === 'undefined') {
      container = new Set();
      adj[target] = container;
    }

    container.add(edgeData); // If selfLoop, we break here

    if (source === target && undirected) return; // Handling target (we won't add the edge because it was already taken
    // care of with source above)

    adj = targetData[inKey];
    if (typeof adj[source] === 'undefined') adj[source] = container;
  } else {
    // Handling source
    sourceData[outKey][target] = edgeData; // If selfLoop, we break here

    if (source === target && undirected) return; // Handling target

    targetData[inKey][source] = edgeData;
  }
}
/**
 * Function clearing the 'structure' index data related to the given edge.
 *
 * @param {Graph}    graph    - Target Graph instance.
 * @param {EdgeData} edgeData - Dropped edge's data.
 */

function clearEdgeFromStructureIndex(graph, undirected, edgeData) {
  var multi = graph.multi;
  var sourceData = edgeData.source,
      targetData = edgeData.target;
  var source = sourceData.key,
      target = targetData.key; // NOTE: since the edge set is the same for source & target, we can only
  // affect source

  var outKey = undirected ? 'undirected' : 'out',
      sourceIndex = sourceData[outKey];
  var inKey = undirected ? 'undirected' : 'in';

  if (target in sourceIndex) {
    if (multi) {
      var set = sourceIndex[target];

      if (set.size === 1) {
        delete sourceIndex[target];
        delete targetData[inKey][source];
      } else {
        set["delete"](edgeData);
      }
    } else delete sourceIndex[target];
  }

  if (multi) return;
  var targetIndex = targetData[inKey];
  delete targetIndex[source];
}
/**
 * Function clearing the whole 'structure' index.
 *
 * @param {Graph} graph - Target Graph instance.
 */

function clearStructureIndex(graph) {
  var iterator = graph._nodes.values();

  var step;

  while (step = iterator.next(), step.done !== true) {
    step.value.clear();
  }
}
/**
 * Function used to upgrade a simple `structure` index to a multi on.
 *
 * @param {Graph}  graph - Target Graph instance.
 */

function upgradeStructureIndexToMulti(graph) {
  graph._nodes.forEach(function (data, node) {
    // Directed
    if (data.out) {
      for (var neighbor in data.out) {
        var edges = new Set();
        edges.add(data.out[neighbor]);
        data.out[neighbor] = edges;
        graph._nodes.get(neighbor)["in"][node] = edges;
      }
    } // Undirected


    if (data.undirected) {
      for (var _neighbor in data.undirected) {
        if (_neighbor > node) continue;

        var _edges = new Set();

        _edges.add(data.undirected[_neighbor]);

        data.undirected[_neighbor] = _edges;
        graph._nodes.get(_neighbor).undirected[node] = _edges;
      }
    }
  });
}

/**
 * Graphology Node Attributes methods
 * ===================================
 */
var NODE = 0;
var SOURCE = 1;
var TARGET = 2;
var OPPOSITE = 3;

function findRelevantNodeData(graph, method, mode, nodeOrEdge, nameOrEdge, add1, add2) {
  var nodeData, edgeData, arg1, arg2;
  nodeOrEdge = '' + nodeOrEdge;

  if (mode === NODE) {
    nodeData = graph._nodes.get(nodeOrEdge);
    if (!nodeData) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(nodeOrEdge, "\" node in the graph."));
    arg1 = nameOrEdge;
    arg2 = add1;
  } else if (mode === OPPOSITE) {
    nameOrEdge = '' + nameOrEdge;
    edgeData = graph._edges.get(nameOrEdge);
    if (!edgeData) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(nameOrEdge, "\" edge in the graph."));
    var source = edgeData.source.key;
    var target = edgeData.target.key;

    if (nodeOrEdge === source) {
      nodeData = edgeData.target;
    } else if (nodeOrEdge === target) {
      nodeData = edgeData.source;
    } else {
      throw new NotFoundGraphError("Graph.".concat(method, ": the \"").concat(nodeOrEdge, "\" node is not attached to the \"").concat(nameOrEdge, "\" edge (").concat(source, ", ").concat(target, ")."));
    }

    arg1 = add1;
    arg2 = add2;
  } else {
    edgeData = graph._edges.get(nodeOrEdge);
    if (!edgeData) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(nodeOrEdge, "\" edge in the graph."));

    if (mode === SOURCE) {
      nodeData = edgeData.source;
    } else {
      nodeData = edgeData.target;
    }

    arg1 = nameOrEdge;
    arg2 = add1;
  }

  return [nodeData, arg1, arg2];
}

function attachNodeAttributeGetter(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    var _findRelevantNodeData = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1),
        data = _findRelevantNodeData[0],
        name = _findRelevantNodeData[1];

    return data.attributes[name];
  };
}

function attachNodeAttributesGetter(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge) {
    var _findRelevantNodeData2 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge),
        data = _findRelevantNodeData2[0];

    return data.attributes;
  };
}

function attachNodeAttributeChecker(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    var _findRelevantNodeData3 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1),
        data = _findRelevantNodeData3[0],
        name = _findRelevantNodeData3[1];

    return data.attributes.hasOwnProperty(name);
  };
}

function attachNodeAttributeSetter(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1, add2) {
    var _findRelevantNodeData4 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1, add2),
        data = _findRelevantNodeData4[0],
        name = _findRelevantNodeData4[1],
        value = _findRelevantNodeData4[2];

    data.attributes[name] = value; // Emitting

    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'set',
      attributes: data.attributes,
      name: name
    });
    return this;
  };
}

function attachNodeAttributeUpdater(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1, add2) {
    var _findRelevantNodeData5 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1, add2),
        data = _findRelevantNodeData5[0],
        name = _findRelevantNodeData5[1],
        updater = _findRelevantNodeData5[2];

    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError("Graph.".concat(method, ": updater should be a function."));
    var attributes = data.attributes;
    var value = updater(attributes[name]);
    attributes[name] = value; // Emitting

    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'set',
      attributes: data.attributes,
      name: name
    });
    return this;
  };
}

function attachNodeAttributeRemover(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    var _findRelevantNodeData6 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1),
        data = _findRelevantNodeData6[0],
        name = _findRelevantNodeData6[1];

    delete data.attributes[name]; // Emitting

    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'remove',
      attributes: data.attributes,
      name: name
    });
    return this;
  };
}

function attachNodeAttributesReplacer(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    var _findRelevantNodeData7 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1),
        data = _findRelevantNodeData7[0],
        attributes = _findRelevantNodeData7[1];

    if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
    data.attributes = attributes; // Emitting

    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'replace',
      attributes: data.attributes
    });
    return this;
  };
}

function attachNodeAttributesMerger(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    var _findRelevantNodeData8 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1),
        data = _findRelevantNodeData8[0],
        attributes = _findRelevantNodeData8[1];

    if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
    assign(data.attributes, attributes); // Emitting

    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'merge',
      attributes: data.attributes,
      data: attributes
    });
    return this;
  };
}

function attachNodeAttributesUpdater(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    var _findRelevantNodeData9 = findRelevantNodeData(this, method, mode, nodeOrEdge, nameOrEdge, add1),
        data = _findRelevantNodeData9[0],
        updater = _findRelevantNodeData9[1];

    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided updater is not a function."));
    data.attributes = updater(data.attributes); // Emitting

    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'update',
      attributes: data.attributes
    });
    return this;
  };
}
/**
 * List of methods to attach.
 */


var NODE_ATTRIBUTES_METHODS = [{
  name: function name(element) {
    return "get".concat(element, "Attribute");
  },
  attacher: attachNodeAttributeGetter
}, {
  name: function name(element) {
    return "get".concat(element, "Attributes");
  },
  attacher: attachNodeAttributesGetter
}, {
  name: function name(element) {
    return "has".concat(element, "Attribute");
  },
  attacher: attachNodeAttributeChecker
}, {
  name: function name(element) {
    return "set".concat(element, "Attribute");
  },
  attacher: attachNodeAttributeSetter
}, {
  name: function name(element) {
    return "update".concat(element, "Attribute");
  },
  attacher: attachNodeAttributeUpdater
}, {
  name: function name(element) {
    return "remove".concat(element, "Attribute");
  },
  attacher: attachNodeAttributeRemover
}, {
  name: function name(element) {
    return "replace".concat(element, "Attributes");
  },
  attacher: attachNodeAttributesReplacer
}, {
  name: function name(element) {
    return "merge".concat(element, "Attributes");
  },
  attacher: attachNodeAttributesMerger
}, {
  name: function name(element) {
    return "update".concat(element, "Attributes");
  },
  attacher: attachNodeAttributesUpdater
}];
/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */

function attachNodeAttributesMethods(Graph) {
  NODE_ATTRIBUTES_METHODS.forEach(function (_ref) {
    var name = _ref.name,
        attacher = _ref.attacher;
    // For nodes
    attacher(Graph, name('Node'), NODE); // For sources

    attacher(Graph, name('Source'), SOURCE); // For targets

    attacher(Graph, name('Target'), TARGET); // For opposites

    attacher(Graph, name('Opposite'), OPPOSITE);
  });
}

/**
 * Graphology Edge Attributes methods
 * ===================================
 */
/**
 * Attach an attribute getter method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */

function attachEdgeAttributeGetter(Class, method, type) {
  /**
   * Get the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {mixed}          - The attribute's value.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 2) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + name;
      name = arguments[2];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    return data.attributes[name];
  };
}
/**
 * Attach an attributes getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   type        - Type of the edge to find.
 */


function attachEdgeAttributesGetter(Class, method, type) {
  /**
   * Retrieves all the target element's attributes.
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   *
   * @return {object}          - The element's attributes.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 1) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + arguments[1];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    return data.attributes;
  };
}
/**
 * Attach an attribute checker method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   type        - Type of the edge to find.
 */


function attachEdgeAttributeChecker(Class, method, type) {
  /**
   * Checks whether the desired attribute is set for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 2) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + name;
      name = arguments[2];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    return data.attributes.hasOwnProperty(name);
  };
}
/**
 * Attach an attribute setter method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */


function attachEdgeAttributeSetter(Class, method, type) {
  /**
   * Set the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name, value) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 3) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + name;
      name = arguments[2];
      value = arguments[3];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    data.attributes[name] = value; // Emitting

    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'set',
      attributes: data.attributes,
      name: name
    });
    return this;
  };
}
/**
 * Attach an attribute updater method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */


function attachEdgeAttributeUpdater(Class, method, type) {
  /**
   * Update the desired attribute for the given element (node or edge) using
   * the provided function.
   *
   * Arity 2:
   * @param  {any}      element - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * Arity 3 (only for edges):
   * @param  {any}      source  - Source element.
   * @param  {any}      target  - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * @return {Graph}            - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name, updater) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 3) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + name;
      name = arguments[2];
      updater = arguments[3];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError("Graph.".concat(method, ": updater should be a function."));
    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    data.attributes[name] = updater(data.attributes[name]); // Emitting

    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'set',
      attributes: data.attributes,
      name: name
    });
    return this;
  };
}
/**
 * Attach an attribute remover method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */


function attachEdgeAttributeRemover(Class, method, type) {
  /**
   * Remove the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 2) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + name;
      name = arguments[2];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    delete data.attributes[name]; // Emitting

    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'remove',
      attributes: data.attributes,
      name: name
    });
    return this;
  };
}
/**
 * Attach an attribute replacer method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */


function attachEdgeAttributesReplacer(Class, method, type) {
  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - New attributes.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - New attributes.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, attributes) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 2) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + attributes;
      attributes = arguments[2];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    data.attributes = attributes; // Emitting

    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'replace',
      attributes: data.attributes
    });
    return this;
  };
}
/**
 * Attach an attribute merger method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */


function attachEdgeAttributesMerger(Class, method, type) {
  /**
   * Merge the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - Attributes to merge.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - Attributes to merge.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, attributes) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 2) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + attributes;
      attributes = arguments[2];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided attributes are not a plain object."));
    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    assign(data.attributes, attributes); // Emitting

    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'merge',
      attributes: data.attributes,
      data: attributes
    });
    return this;
  };
}
/**
 * Attach an attribute updater method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 */


function attachEdgeAttributesUpdater(Class, method, type) {
  /**
   * Update the attributes of the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}      element - Target element.
   * @param  {function} updater - Updater function.
   *
   * Arity 3 (only for edges):
   * @param  {any}      source  - Source element.
   * @param  {any}      target  - Target element.
   * @param  {function} updater - Updater function.
   *
   * @return {Graph}            - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, updater) {
    var data;
    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new UsageGraphError("Graph.".concat(method, ": cannot find this type of edges in your ").concat(this.type, " graph."));

    if (arguments.length > 2) {
      if (this.multi) throw new UsageGraphError("Graph.".concat(method, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
      var source = '' + element,
          target = '' + updater;
      updater = arguments[2];
      data = getMatchingEdge(this, source, target, type);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find an edge for the given path (\"").concat(source, "\" - \"").concat(target, "\")."));
    } else {
      element = '' + element;
      data = this._edges.get(element);
      if (!data) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" edge in the graph."));
    }

    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError("Graph.".concat(method, ": provided updater is not a function."));
    if (type !== 'mixed' && data.undirected !== (type === 'undirected')) throw new NotFoundGraphError("Graph.".concat(method, ": could not find the \"").concat(element, "\" ").concat(type, " edge in the graph."));
    data.attributes = updater(data.attributes); // Emitting

    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'update',
      attributes: data.attributes
    });
    return this;
  };
}
/**
 * List of methods to attach.
 */


var EDGE_ATTRIBUTES_METHODS = [{
  name: function name(element) {
    return "get".concat(element, "Attribute");
  },
  attacher: attachEdgeAttributeGetter
}, {
  name: function name(element) {
    return "get".concat(element, "Attributes");
  },
  attacher: attachEdgeAttributesGetter
}, {
  name: function name(element) {
    return "has".concat(element, "Attribute");
  },
  attacher: attachEdgeAttributeChecker
}, {
  name: function name(element) {
    return "set".concat(element, "Attribute");
  },
  attacher: attachEdgeAttributeSetter
}, {
  name: function name(element) {
    return "update".concat(element, "Attribute");
  },
  attacher: attachEdgeAttributeUpdater
}, {
  name: function name(element) {
    return "remove".concat(element, "Attribute");
  },
  attacher: attachEdgeAttributeRemover
}, {
  name: function name(element) {
    return "replace".concat(element, "Attributes");
  },
  attacher: attachEdgeAttributesReplacer
}, {
  name: function name(element) {
    return "merge".concat(element, "Attributes");
  },
  attacher: attachEdgeAttributesMerger
}, {
  name: function name(element) {
    return "update".concat(element, "Attributes");
  },
  attacher: attachEdgeAttributesUpdater
}];
/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */

function attachEdgeAttributesMethods(Graph) {
  EDGE_ATTRIBUTES_METHODS.forEach(function (_ref) {
    var name = _ref.name,
        attacher = _ref.attacher;
    // For edges
    attacher(Graph, name('Edge'), 'mixed'); // For directed edges

    attacher(Graph, name('DirectedEdge'), 'directed'); // For undirected edges

    attacher(Graph, name('UndirectedEdge'), 'undirected');
  });
}

/**
 * Graphology Edge Iteration
 * ==========================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's edges.
 */
/**
 * Definitions.
 */

var EDGES_ITERATION = [{
  name: 'edges',
  type: 'mixed'
}, {
  name: 'inEdges',
  type: 'directed',
  direction: 'in'
}, {
  name: 'outEdges',
  type: 'directed',
  direction: 'out'
}, {
  name: 'inboundEdges',
  type: 'mixed',
  direction: 'in'
}, {
  name: 'outboundEdges',
  type: 'mixed',
  direction: 'out'
}, {
  name: 'directedEdges',
  type: 'directed'
}, {
  name: 'undirectedEdges',
  type: 'undirected'
}];
/**
 * Function collecting edges from the given object.
 *
 * @param  {array}  edges  - Edges array to populate.
 * @param  {object} object - Target object.
 * @return {array}         - The found edges.
 */

function collectSimple(edges, object) {
  for (var k in object) {
    edges.push(object[k].key);
  }
}

function collectMulti(edges, object) {
  for (var k in object) {
    object[k].forEach(function (edgeData) {
      return edges.push(edgeData.key);
    });
  }
}
/**
 * Function iterating over edges from the given object using a callback.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */


function forEachSimple(object, callback, avoid) {
  for (var k in object) {
    if (k === avoid) continue;
    var edgeData = object[k];
    callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
  }
}

function forEachMulti(object, callback, avoid) {
  for (var k in object) {
    if (k === avoid) continue;
    object[k].forEach(function (edgeData) {
      return callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
    });
  }
}
/**
 * Function iterating over edges from the given object to match one of them.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */


function findSimple(object, callback, avoid) {
  var shouldBreak = false;

  for (var k in object) {
    if (k === avoid) continue;
    var edgeData = object[k];
    shouldBreak = callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
    if (shouldBreak) return edgeData.key;
  }

  return;
}

function findMulti(object, callback, avoid) {
  var iterator, step, edgeData, source, target;
  var shouldBreak = false;

  for (var k in object) {
    if (k === avoid) continue;
    iterator = object[k].values();

    while (step = iterator.next(), step.done !== true) {
      edgeData = step.value;
      source = edgeData.source;
      target = edgeData.target;
      shouldBreak = callback(edgeData.key, edgeData.attributes, source.key, target.key, source.attributes, target.attributes, edgeData.undirected);
      if (shouldBreak) return edgeData.key;
    }
  }

  return;
}
/**
 * Function returning an iterator over edges from the given object.
 *
 * @param  {object}   object - Target object.
 * @return {Iterator}
 */


function createIterator(object, avoid) {
  var keys = Object.keys(object),
      l = keys.length;
  var inner = null,
      i = 0;
  return new Iterator__default["default"](function next() {
    var edgeData;

    if (inner) {
      var step = inner.next();

      if (step.done) {
        inner = null;
        i++;
        return next();
      }

      edgeData = step.value;
    } else {
      if (i >= l) return {
        done: true
      };
      var k = keys[i];

      if (k === avoid) {
        i++;
        return next();
      }

      edgeData = object[k];

      if (edgeData instanceof Set) {
        inner = edgeData.values();
        return next();
      }

      i++;
    }

    return {
      done: false,
      value: {
        edge: edgeData.key,
        attributes: edgeData.attributes,
        source: edgeData.source.key,
        target: edgeData.target.key,
        sourceAttributes: edgeData.source.attributes,
        targetAttributes: edgeData.target.attributes,
        undirected: edgeData.undirected
      }
    };
  });
}
/**
 * Function collecting edges from the given object at given key.
 *
 * @param  {array}  edges  - Edges array to populate.
 * @param  {object} object - Target object.
 * @param  {mixed}  k      - Neighbor key.
 * @return {array}         - The found edges.
 */


function collectForKeySimple(edges, object, k) {
  var edgeData = object[k];
  if (!edgeData) return;
  edges.push(edgeData.key);
}

function collectForKeyMulti(edges, object, k) {
  var edgesData = object[k];
  if (!edgesData) return;
  edgesData.forEach(function (edgeData) {
    return edges.push(edgeData.key);
  });
}
/**
 * Function iterating over the egdes from the object at given key using
 * a callback.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */


function forEachForKeySimple(object, k, callback) {
  var edgeData = object[k];
  if (!edgeData) return;
  var sourceData = edgeData.source;
  var targetData = edgeData.target;
  callback(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected);
}

function forEachForKeyMulti(object, k, callback) {
  var edgesData = object[k];
  if (!edgesData) return;
  edgesData.forEach(function (edgeData) {
    return callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
  });
}
/**
 * Function iterating over the egdes from the object at given key to match
 * one of them.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */


function findForKeySimple(object, k, callback) {
  var edgeData = object[k];
  if (!edgeData) return;
  var sourceData = edgeData.source;
  var targetData = edgeData.target;
  if (callback(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected)) return edgeData.key;
}

function findForKeyMulti(object, k, callback) {
  var edgesData = object[k];
  if (!edgesData) return;
  var shouldBreak = false;
  var iterator = edgesData.values();
  var step, edgeData;

  while (step = iterator.next(), step.done !== true) {
    edgeData = step.value;
    shouldBreak = callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes, edgeData.undirected);
    if (shouldBreak) return edgeData.key;
  }

  return;
}
/**
 * Function returning an iterator over the egdes from the object at given key.
 *
 * @param  {object}   object   - Target object.
 * @param  {mixed}    k        - Neighbor key.
 * @return {Iterator}
 */


function createIteratorForKey(object, k) {
  var v = object[k];

  if (v instanceof Set) {
    var iterator = v.values();
    return new Iterator__default["default"](function () {
      var step = iterator.next();
      if (step.done) return step;
      var edgeData = step.value;
      return {
        done: false,
        value: {
          edge: edgeData.key,
          attributes: edgeData.attributes,
          source: edgeData.source.key,
          target: edgeData.target.key,
          sourceAttributes: edgeData.source.attributes,
          targetAttributes: edgeData.target.attributes,
          undirected: edgeData.undirected
        }
      };
    });
  }

  return Iterator__default["default"].of([v.key, v.attributes, v.source.key, v.target.key, v.source.attributes, v.target.attributes]);
}
/**
 * Function creating an array of edges for the given type.
 *
 * @param  {Graph}   graph - Target Graph instance.
 * @param  {string}  type  - Type of edges to retrieve.
 * @return {array}         - Array of edges.
 */


function createEdgeArray(graph, type) {
  if (graph.size === 0) return [];

  if (type === 'mixed' || type === graph.type) {
    if (typeof Array.from === 'function') return Array.from(graph._edges.keys());
    return take__default["default"](graph._edges.keys(), graph._edges.size);
  }

  var size = type === 'undirected' ? graph.undirectedSize : graph.directedSize;
  var list = new Array(size),
      mask = type === 'undirected';

  var iterator = graph._edges.values();

  var i = 0;
  var step, data;

  while (step = iterator.next(), step.done !== true) {
    data = step.value;
    if (data.undirected === mask) list[i++] = data.key;
  }

  return list;
}
/**
 * Function iterating over a graph's edges using a callback.
 *
 * @param  {Graph}    graph    - Target Graph instance.
 * @param  {string}   type     - Type of edges to retrieve.
 * @param  {function} callback - Function to call.
 */


function forEachEdge(graph, type, callback) {
  if (graph.size === 0) return;
  var shouldFilter = type !== 'mixed' && type !== graph.type;
  var mask = type === 'undirected';
  var step, data;

  var iterator = graph._edges.values();

  while (step = iterator.next(), step.done !== true) {
    data = step.value;
    if (shouldFilter && data.undirected !== mask) continue;
    var _data = data,
        key = _data.key,
        attributes = _data.attributes,
        source = _data.source,
        target = _data.target;
    callback(key, attributes, source.key, target.key, source.attributes, target.attributes, data.undirected);
  }
}
/**
 * Function iterating over a graph's edges using a callback to match one of
 * them.
 *
 * @param  {Graph}    graph    - Target Graph instance.
 * @param  {string}   type     - Type of edges to retrieve.
 * @param  {function} callback - Function to call.
 */


function findEdge(graph, type, callback) {
  if (graph.size === 0) return;
  var shouldFilter = type !== 'mixed' && type !== graph.type;
  var mask = type === 'undirected';
  var step, data;
  var shouldBreak = false;

  var iterator = graph._edges.values();

  while (step = iterator.next(), step.done !== true) {
    data = step.value;
    if (shouldFilter && data.undirected !== mask) continue;
    var _data2 = data,
        key = _data2.key,
        attributes = _data2.attributes,
        source = _data2.source,
        target = _data2.target;
    shouldBreak = callback(key, attributes, source.key, target.key, source.attributes, target.attributes, data.undirected);
    if (shouldBreak) return key;
  }

  return;
}
/**
 * Function creating an iterator of edges for the given type.
 *
 * @param  {Graph}    graph - Target Graph instance.
 * @param  {string}   type  - Type of edges to retrieve.
 * @return {Iterator}
 */


function createEdgeIterator(graph, type) {
  if (graph.size === 0) return Iterator__default["default"].empty();
  var shouldFilter = type !== 'mixed' && type !== graph.type;
  var mask = type === 'undirected';

  var iterator = graph._edges.values();

  return new Iterator__default["default"](function next() {
    var step, data; // eslint-disable-next-line no-constant-condition

    while (true) {
      step = iterator.next();
      if (step.done) return step;
      data = step.value;
      if (shouldFilter && data.undirected !== mask) continue;
      break;
    }

    var value = {
      edge: data.key,
      attributes: data.attributes,
      source: data.source.key,
      target: data.target.key,
      sourceAttributes: data.source.attributes,
      targetAttributes: data.target.attributes,
      undirected: data.undirected
    };
    return {
      value: value,
      done: false
    };
  });
}
/**
 * Function creating an array of edges for the given type & the given node.
 *
 * @param  {boolean} multi     - Whether the graph is multi or not.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     nodeData  - Target node's data.
 * @return {array}             - Array of edges.
 */


function createEdgeArrayForNode(multi, type, direction, nodeData) {
  var edges = [];
  var fn = multi ? collectMulti : collectSimple;

  if (type !== 'undirected') {
    if (direction !== 'out') fn(edges, nodeData["in"]);
    if (direction !== 'in') fn(edges, nodeData.out); // Handling self loop edge case

    if (!direction && nodeData.directedSelfLoops > 0) edges.splice(edges.lastIndexOf(nodeData.key), 1);
  }

  if (type !== 'directed') {
    fn(edges, nodeData.undirected);
  }

  return edges;
}
/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {boolean}  multi     - Whether the graph is multi or not.
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */


function forEachEdgeForNode(multi, type, direction, nodeData, callback) {
  var fn = multi ? forEachMulti : forEachSimple;

  if (type !== 'undirected') {
    if (direction !== 'out') fn(nodeData["in"], callback);
    if (direction !== 'in') fn(nodeData.out, callback, !direction ? nodeData.key : null);
  }

  if (type !== 'directed') {
    fn(nodeData.undirected, callback);
  }
}
/**
 * Function iterating over a node's edges using a callback to match one of them.
 *
 * @param  {boolean}  multi     - Whether the graph is multi or not.
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */


function findEdgeForNode(multi, type, direction, nodeData, callback) {
  var fn = multi ? findMulti : findSimple;
  var found;

  if (type !== 'undirected') {
    if (direction !== 'out') {
      found = fn(nodeData["in"], callback);
      if (found) return found;
    }

    if (direction !== 'in') {
      found = fn(nodeData.out, callback, !direction ? nodeData.key : null);
      if (found) return found;
    }
  }

  if (type !== 'directed') {
    found = fn(nodeData.undirected, callback);
    if (found) return found;
  }

  return;
}
/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */


function createEdgeIteratorForNode(type, direction, nodeData) {
  var iterator = Iterator__default["default"].empty();

  if (type !== 'undirected') {
    if (direction !== 'out' && typeof nodeData["in"] !== 'undefined') iterator = chain__default["default"](iterator, createIterator(nodeData["in"]));
    if (direction !== 'in' && typeof nodeData.out !== 'undefined') iterator = chain__default["default"](iterator, createIterator(nodeData.out, !direction ? nodeData.key : null));
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    iterator = chain__default["default"](iterator, createIterator(nodeData.undirected));
  }

  return iterator;
}
/**
 * Function creating an array of edges for the given path.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {any}      target     - Target node.
 * @return {array}               - Array of edges.
 */


function createEdgeArrayForPath(type, multi, direction, sourceData, target) {
  var fn = multi ? collectForKeyMulti : collectForKeySimple;
  var edges = [];

  if (type !== 'undirected') {
    if (typeof sourceData["in"] !== 'undefined' && direction !== 'out') fn(edges, sourceData["in"], target);
    if (typeof sourceData.out !== 'undefined' && direction !== 'in') fn(edges, sourceData.out, target); // Handling self loop edge case

    if (!direction && sourceData.directedSelfLoops > 0) edges.splice(edges.lastIndexOf(sourceData.key), 1);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') fn(edges, sourceData.undirected, target);
  }

  return edges;
}
/**
 * Function iterating over edges for the given path using a callback.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */


function forEachEdgeForPath(type, multi, direction, sourceData, target, callback) {
  var fn = multi ? forEachForKeyMulti : forEachForKeySimple;

  if (type !== 'undirected') {
    if (typeof sourceData["in"] !== 'undefined' && direction !== 'out') fn(sourceData["in"], target, callback);
    if (sourceData.key !== target) if (typeof sourceData.out !== 'undefined' && direction !== 'in') fn(sourceData.out, target, callback);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') fn(sourceData.undirected, target, callback);
  }
}
/**
 * Function iterating over edges for the given path using a callback to match
 * one of them.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */


function findEdgeForPath(type, multi, direction, sourceData, target, callback) {
  var fn = multi ? findForKeyMulti : findForKeySimple;
  var found;

  if (type !== 'undirected') {
    if (typeof sourceData["in"] !== 'undefined' && direction !== 'out') {
      found = fn(sourceData["in"], target, callback);
      if (found) return found;
    }

    if (sourceData.key !== target) if (typeof sourceData.out !== 'undefined' && direction !== 'in') {
      found = fn(sourceData.out, target, callback, !direction ? sourceData.key : null);
      if (found) return found;
    }
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') {
      found = fn(sourceData.undirected, target, callback);
      if (found) return found;
    }
  }

  return;
}
/**
 * Function returning an iterator over edges for the given path.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */


function createEdgeIteratorForPath(type, direction, sourceData, target) {
  var iterator = Iterator__default["default"].empty();

  if (type !== 'undirected') {
    if (typeof sourceData["in"] !== 'undefined' && direction !== 'out' && target in sourceData["in"]) iterator = chain__default["default"](iterator, createIteratorForKey(sourceData["in"], target));
    if (typeof sourceData.out !== 'undefined' && direction !== 'in' && target in sourceData.out) iterator = chain__default["default"](iterator, createIteratorForKey(sourceData.out, target));
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined' && target in sourceData.undirected) iterator = chain__default["default"](iterator, createIteratorForKey(sourceData.undirected, target));
  }

  return iterator;
}
/**
 * Function attaching an edge array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachEdgeArrayCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  /**
   * Function returning an array of certain edges.
   *
   * Arity 0: Return all the relevant edges.
   *
   * Arity 1: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Return the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[name] = function (source, target) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return [];
    if (!arguments.length) return createEdgeArray(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      var nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(name, ": could not find the \"").concat(source, "\" node in the graph.")); // Iterating over a node's edges

      return createEdgeArrayForNode(this.multi, type === 'mixed' ? this.type : type, direction, nodeData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new NotFoundGraphError("Graph.".concat(name, ":  could not find the \"").concat(source, "\" source node in the graph."));
      if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.".concat(name, ":  could not find the \"").concat(target, "\" target node in the graph.")); // Iterating over the edges between source & target

      return createEdgeArrayForPath(type, this.multi, direction, sourceData, target);
    }

    throw new InvalidArgumentsGraphError("Graph.".concat(name, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
  };
}
/**
 * Function attaching a edge callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachForEachEdge(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  var forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);
  /**
   * Function iterating over the graph's relevant edges by applying the given
   * callback.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[forEachName] = function (source, target, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;

    if (arguments.length === 1) {
      callback = source;
      return forEachEdge(this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      var nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(forEachName, ": could not find the \"").concat(source, "\" node in the graph.")); // Iterating over a node's edges
      // TODO: maybe attach the sub method to the instance dynamically?

      return forEachEdgeForNode(this.multi, type === 'mixed' ? this.type : type, direction, nodeData, callback);
    }

    if (arguments.length === 3) {
      source = '' + source;
      target = '' + target;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new NotFoundGraphError("Graph.".concat(forEachName, ":  could not find the \"").concat(source, "\" source node in the graph."));
      if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.".concat(forEachName, ":  could not find the \"").concat(target, "\" target node in the graph.")); // Iterating over the edges between source & target

      return forEachEdgeForPath(type, this.multi, direction, sourceData, target, callback);
    }

    throw new InvalidArgumentsGraphError("Graph.".concat(forEachName, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
  };
  /**
   * Function mapping the graph's relevant edges by applying the given
   * callback.
   *
   * Arity 1: Map all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Map all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Map the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var mapName = 'map' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[mapName] = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    var result; // We know the result length beforehand

    if (args.length === 0) {
      var length = 0;
      if (type !== 'directed') length += this.undirectedSize;
      if (type !== 'undirected') length += this.directedSize;
      result = new Array(length);
      var i = 0;
      args.push(function (e, ea, s, t, sa, ta, u) {
        result[i++] = callback(e, ea, s, t, sa, ta, u);
      });
    } // We don't know the result length beforehand
    // TODO: we can in some instances of simple graphs, knowing degree
    else {
      result = [];
      args.push(function (e, ea, s, t, sa, ta, u) {
        result.push(callback(e, ea, s, t, sa, ta, u));
      });
    }

    this[forEachName].apply(this, args);
    return result;
  };
  /**
   * Function filtering the graph's relevant edges using the provided predicate
   * function.
   *
   * Arity 1: Filter all the relevant edges.
   * @param  {function} predicate - Predicate to use.
   *
   * Arity 2: Filter all of a node's relevant edges.
   * @param  {any}      node      - Target node.
   * @param  {function} predicate - Predicate to use.
   *
   * Arity 3: Filter the relevant edges across the given path.
   * @param  {any}      source    - Source node.
   * @param  {any}      target    - Target node.
   * @param  {function} predicate - Predicate to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var filterName = 'filter' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[filterName] = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    var result = [];
    args.push(function (e, ea, s, t, sa, ta, u) {
      if (callback(e, ea, s, t, sa, ta, u)) result.push(e);
    });
    this[forEachName].apply(this, args);
    return result;
  };
  /**
   * Function reducing the graph's relevant edges using the provided accumulator
   * function.
   *
   * Arity 1: Reduce all the relevant edges.
   * @param  {function} accumulator  - Accumulator to use.
   * @param  {any}      initialValue - Initial value.
   *
   * Arity 2: Reduce all of a node's relevant edges.
   * @param  {any}      node         - Target node.
   * @param  {function} accumulator  - Accumulator to use.
   * @param  {any}      initialValue - Initial value.
   *
   * Arity 3: Reduce the relevant edges across the given path.
   * @param  {any}      source       - Source node.
   * @param  {any}      target       - Target node.
   * @param  {function} accumulator  - Accumulator to use.
   * @param  {any}      initialValue - Initial value.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var reduceName = 'reduce' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[reduceName] = function () {
    var args = Array.prototype.slice.call(arguments);

    if (args.length < 2 || args.length > 4) {
      throw new InvalidArgumentsGraphError("Graph.".concat(reduceName, ": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(args.length, ")."));
    }

    if (typeof args[args.length - 1] === 'function' && typeof args[args.length - 2] !== 'function') {
      throw new InvalidArgumentsGraphError("Graph.".concat(reduceName, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
    }

    var callback;
    var initialValue;

    if (args.length === 2) {
      callback = args[0];
      initialValue = args[1];
      args = [];
    } else if (args.length === 3) {
      callback = args[1];
      initialValue = args[2];
      args = [args[0]];
    } else if (args.length === 4) {
      callback = args[2];
      initialValue = args[3];
      args = [args[0], args[1]];
    }

    var accumulator = initialValue;
    args.push(function (e, ea, s, t, sa, ta, u) {
      accumulator = callback(accumulator, e, ea, s, t, sa, ta, u);
    });
    this[forEachName].apply(this, args);
    return accumulator;
  };
}
/**
 * Function attaching a breakable edge callback iterator method to the Graph
 * prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachFindEdge(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  var findEdgeName = 'find' + name[0].toUpperCase() + name.slice(1, -1);
  /**
   * Function iterating over the graph's relevant edges in order to match
   * one of them using the provided predicate function.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[findEdgeName] = function (source, target, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return false;

    if (arguments.length === 1) {
      callback = source;
      return findEdge(this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      var nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(findEdgeName, ": could not find the \"").concat(source, "\" node in the graph.")); // Iterating over a node's edges
      // TODO: maybe attach the sub method to the instance dynamically?

      return findEdgeForNode(this.multi, type === 'mixed' ? this.type : type, direction, nodeData, callback);
    }

    if (arguments.length === 3) {
      source = '' + source;
      target = '' + target;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new NotFoundGraphError("Graph.".concat(findEdgeName, ":  could not find the \"").concat(source, "\" source node in the graph."));
      if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.".concat(findEdgeName, ":  could not find the \"").concat(target, "\" target node in the graph.")); // Iterating over the edges between source & target

      return findEdgeForPath(type, this.multi, direction, sourceData, target, callback);
    }

    throw new InvalidArgumentsGraphError("Graph.".concat(findEdgeName, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
  };
  /**
   * Function iterating over the graph's relevant edges in order to assert
   * whether any one of them matches the provided predicate function.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var someName = 'some' + name[0].toUpperCase() + name.slice(1, -1);

  Class.prototype[someName] = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    args.push(function (e, ea, s, t, sa, ta, u) {
      return callback(e, ea, s, t, sa, ta, u);
    });
    var found = this[findEdgeName].apply(this, args);
    if (found) return true;
    return false;
  };
  /**
   * Function iterating over the graph's relevant edges in order to assert
   * whether all of them matche the provided predicate function.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var everyName = 'every' + name[0].toUpperCase() + name.slice(1, -1);

  Class.prototype[everyName] = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    args.push(function (e, ea, s, t, sa, ta, u) {
      return !callback(e, ea, s, t, sa, ta, u);
    });
    var found = this[findEdgeName].apply(this, args);
    if (found) return false;
    return true;
  };
}
/**
 * Function attaching an edge iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachEdgeIteratorCreator(Class, description) {
  var originalName = description.name,
      type = description.type,
      direction = description.direction;
  var name = originalName.slice(0, -1) + 'Entries';
  /**
   * Function returning an iterator over the graph's edges.
   *
   * Arity 0: Iterate over all the relevant edges.
   *
   * Arity 1: Iterate over all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Iterate over the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[name] = function (source, target) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return Iterator__default["default"].empty();
    if (!arguments.length) return createEdgeIterator(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new NotFoundGraphError("Graph.".concat(name, ": could not find the \"").concat(source, "\" node in the graph.")); // Iterating over a node's edges

      return createEdgeIteratorForNode(type, direction, sourceData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      var _sourceData = this._nodes.get(source);

      if (!_sourceData) throw new NotFoundGraphError("Graph.".concat(name, ":  could not find the \"").concat(source, "\" source node in the graph."));
      if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.".concat(name, ":  could not find the \"").concat(target, "\" target node in the graph.")); // Iterating over the edges between source & target

      return createEdgeIteratorForPath(type, direction, _sourceData, target);
    }

    throw new InvalidArgumentsGraphError("Graph.".concat(name, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
  };
}
/**
 * Function attaching every edge iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */


function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(function (description) {
    attachEdgeArrayCreator(Graph, description);
    attachForEachEdge(Graph, description);
    attachFindEdge(Graph, description);
    attachEdgeIteratorCreator(Graph, description);
  });
}

/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
/**
 * Definitions.
 */

var NEIGHBORS_ITERATION = [{
  name: 'neighbors',
  type: 'mixed'
}, {
  name: 'inNeighbors',
  type: 'directed',
  direction: 'in'
}, {
  name: 'outNeighbors',
  type: 'directed',
  direction: 'out'
}, {
  name: 'inboundNeighbors',
  type: 'mixed',
  direction: 'in'
}, {
  name: 'outboundNeighbors',
  type: 'mixed',
  direction: 'out'
}, {
  name: 'directedNeighbors',
  type: 'directed'
}, {
  name: 'undirectedNeighbors',
  type: 'undirected'
}];
/**
 * Function merging neighbors into the given set iterating over the given object.
 *
 * @param {BasicSet} neighbors - Neighbors set.
 * @param {object}   object    - Target object.
 */

function merge(neighbors, object) {
  if (typeof object === 'undefined') return;

  for (var neighbor in object) {
    neighbors.add(neighbor);
  }
}
/**
 * Function creating an array of relevant neighbors for the given node.
 *
 * @param  {string}       type      - Type of neighbors.
 * @param  {string}       direction - Direction.
 * @param  {any}          nodeData  - Target node's data.
 * @return {Array}                  - The list of neighbors.
 */


function createNeighborArrayForNode(type, direction, nodeData) {
  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return Object.keys(nodeData.undirected);
    if (typeof direction === 'string') return Object.keys(nodeData[direction]);
  } // Else we need to keep a set of neighbors not to return duplicates


  var neighbors = new Set();

  if (type !== 'undirected') {
    if (direction !== 'out') {
      merge(neighbors, nodeData["in"]);
    }

    if (direction !== 'in') {
      merge(neighbors, nodeData.out);
    }
  }

  if (type !== 'directed') {
    merge(neighbors, nodeData.undirected);
  }

  return take__default["default"](neighbors.values(), neighbors.size);
}
/**
 * Function iterating over the given node's relevant neighbors using a
 * callback.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Callback to use.
 */


function forEachInObject(nodeData, object, callback) {
  for (var k in object) {
    var edgeData = object[k];
    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;
    var sourceData = edgeData.source,
        targetData = edgeData.target;
    var neighborData = sourceData === nodeData ? targetData : sourceData;
    callback(neighborData.key, neighborData.attributes);
  }
}

function forEachInObjectOnce(visited, nodeData, object, callback) {
  for (var k in object) {
    var edgeData = object[k];
    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;
    var sourceData = edgeData.source,
        targetData = edgeData.target;
    var neighborData = sourceData === nodeData ? targetData : sourceData;
    if (visited.has(neighborData.key)) continue;
    visited.add(neighborData.key);
    callback(neighborData.key, neighborData.attributes);
  }
}
/**
 * Function iterating over the given node's relevant neighbors to match
 * one of them using a predicated function.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Callback to use.
 */


function findInObject(nodeData, object, callback) {
  for (var k in object) {
    var edgeData = object[k];
    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;
    var sourceData = edgeData.source;
    var targetData = edgeData.target;
    var neighborData = sourceData === nodeData ? targetData : sourceData;
    var shouldBreak = callback(neighborData.key, neighborData.attributes);
    if (shouldBreak) return neighborData.key;
  }

  return;
}

function findInObjectOnce(visited, nodeData, object, callback) {
  for (var k in object) {
    var edgeData = object[k];
    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;
    var sourceData = edgeData.source;
    var targetData = edgeData.target;
    var neighborData = sourceData === nodeData ? targetData : sourceData;
    if (visited.has(neighborData.key)) continue;
    visited.add(neighborData.key);
    var shouldBreak = callback(neighborData.key, neighborData.attributes);
    if (shouldBreak) return neighborData.key;
  }

  return;
}

function forEachNeighborForNode(type, direction, nodeData, callback) {
  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return forEachInObject(nodeData, nodeData.undirected, callback);
    if (typeof direction === 'string') return forEachInObject(nodeData, nodeData[direction], callback);
  } // Else we need to keep a set of neighbors not to return duplicates


  var visited = new Set();

  if (type !== 'undirected') {
    if (direction !== 'out') {
      forEachInObjectOnce(visited, nodeData, nodeData["in"], callback);
    }

    if (direction !== 'in') {
      forEachInObjectOnce(visited, nodeData, nodeData.out, callback);
    }
  }

  if (type !== 'directed') {
    forEachInObjectOnce(visited, nodeData, nodeData.undirected, callback);
  }
}

function findNeighbor(type, direction, nodeData, callback) {
  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return findInObject(nodeData, nodeData.undirected, callback);
    if (typeof direction === 'string') return findInObject(nodeData, nodeData[direction], callback);
  } // Else we need to keep a set of neighbors not to return duplicates


  var visited = new Set();
  var found;

  if (type !== 'undirected') {
    if (direction !== 'out') {
      found = findInObjectOnce(visited, nodeData, nodeData["in"], callback);
      if (found) return found;
    }

    if (direction !== 'in') {
      found = findInObjectOnce(visited, nodeData, nodeData.out, callback);
      if (found) return found;
    }
  }

  if (type !== 'directed') {
    found = findInObjectOnce(visited, nodeData, nodeData.undirected, callback);
    if (found) return found;
  }

  return;
}
/**
 * Function returning an iterator over the given node's relevant neighbors.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */


function createObjectIterator(nodeData, object) {
  var keys = Object.keys(object),
      l = keys.length;
  var i = 0;
  return new Iterator__default["default"](function () {
    if (i >= l) return {
      done: true
    };
    var edgeData = object[keys[i++]];
    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;
    var sourceData = edgeData.source,
        targetData = edgeData.target;
    var neighborData = sourceData === nodeData ? targetData : sourceData;
    return {
      done: false,
      value: {
        neighbor: neighborData.key,
        attributes: neighborData.attributes
      }
    };
  });
}

function createDedupedObjectIterator(visited, nodeData, object) {
  var keys = Object.keys(object),
      l = keys.length;
  var i = 0;
  return new Iterator__default["default"](function next() {
    if (i >= l) return {
      done: true
    };
    var edgeData = object[keys[i++]];
    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;
    var sourceData = edgeData.source,
        targetData = edgeData.target;
    var neighborData = sourceData === nodeData ? targetData : sourceData;
    if (visited.has(neighborData.key)) return next();
    visited.add(neighborData.key);
    return {
      done: false,
      value: {
        neighbor: neighborData.key,
        attributes: neighborData.attributes
      }
    };
  });
}

function createNeighborIterator(type, direction, nodeData) {
  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return createObjectIterator(nodeData, nodeData.undirected);
    if (typeof direction === 'string') return createObjectIterator(nodeData, nodeData[direction]);
  }

  var iterator = Iterator__default["default"].empty(); // Else we need to keep a set of neighbors not to return duplicates

  var visited = new Set();

  if (type !== 'undirected') {
    if (direction !== 'out') {
      iterator = chain__default["default"](iterator, createDedupedObjectIterator(visited, nodeData, nodeData["in"]));
    }

    if (direction !== 'in') {
      iterator = chain__default["default"](iterator, createDedupedObjectIterator(visited, nodeData, nodeData.out));
    }
  }

  if (type !== 'directed') {
    iterator = chain__default["default"](iterator, createDedupedObjectIterator(visited, nodeData, nodeData.undirected));
  }

  return iterator;
}
/**
 * Function attaching a neighbors array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachNeighborArrayCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  /**
   * Function returning an array of certain neighbors.
   *
   * @param  {any}   node   - Target node.
   * @return {array} - The neighbors of neighbors.
   *
   * @throws {Error} - Will throw if node is not found in the graph.
   */

  Class.prototype[name] = function (node) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return [];
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(name, ": could not find the \"").concat(node, "\" node in the graph.")); // Here, we want to iterate over a node's relevant neighbors

    return createNeighborArrayForNode(type === 'mixed' ? this.type : type, direction, nodeData);
  };
}
/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachForEachNeighbor(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  var forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);
  /**
   * Function iterating over all the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[forEachName] = function (node, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(forEachName, ": could not find the \"").concat(node, "\" node in the graph.")); // Here, we want to iterate over a node's relevant neighbors

    forEachNeighborForNode(type === 'mixed' ? this.type : type, direction, nodeData, callback);
  };
  /**
   * Function mapping the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var mapName = 'map' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[mapName] = function (node, callback) {
    // TODO: optimize when size is known beforehand
    var result = [];
    this[forEachName](node, function (n, a) {
      result.push(callback(n, a));
    });
    return result;
  };
  /**
   * Function filtering the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var filterName = 'filter' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[filterName] = function (node, callback) {
    var result = [];
    this[forEachName](node, function (n, a) {
      if (callback(n, a)) result.push(n);
    });
    return result;
  };
  /**
   * Function reducing the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var reduceName = 'reduce' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[reduceName] = function (node, callback, initialValue) {
    if (arguments.length < 3) throw new InvalidArgumentsGraphError("Graph.".concat(reduceName, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
    var accumulator = initialValue;
    this[forEachName](node, function (n, a) {
      accumulator = callback(accumulator, n, a);
    });
    return accumulator;
  };
}
/**
 * Function attaching a breakable neighbors callback iterator method to the
 * Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachFindNeighbor(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  var capitalizedSingular = name[0].toUpperCase() + name.slice(1, -1);
  var findName = 'find' + capitalizedSingular;
  /**
   * Function iterating over all the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[findName] = function (node, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(findName, ": could not find the \"").concat(node, "\" node in the graph.")); // Here, we want to iterate over a node's relevant neighbors

    return findNeighbor(type === 'mixed' ? this.type : type, direction, nodeData, callback);
  };
  /**
   * Function iterating over all the relevant neighbors to find if any of them
   * matches the given predicate.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var someName = 'some' + capitalizedSingular;

  Class.prototype[someName] = function (node, callback) {
    var found = this[findName](node, callback);
    if (found) return true;
    return false;
  };
  /**
   * Function iterating over all the relevant neighbors to find if all of them
   * matche the given predicate.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */


  var everyName = 'every' + capitalizedSingular;

  Class.prototype[everyName] = function (node, callback) {
    var found = this[findName](node, function (n, a) {
      return !callback(n, a);
    });
    if (found) return false;
    return true;
  };
}
/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */


function attachNeighborIteratorCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;
  var iteratorName = name.slice(0, -1) + 'Entries';
  /**
   * Function returning an iterator over all the relevant neighbors.
   *
   * @param  {any}      node     - Target node.
   * @return {Iterator}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[iteratorName] = function (node) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return Iterator__default["default"].empty();
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined') throw new NotFoundGraphError("Graph.".concat(iteratorName, ": could not find the \"").concat(node, "\" node in the graph.")); // Here, we want to iterate over a node's relevant neighbors

    return createNeighborIterator(type === 'mixed' ? this.type : type, direction, nodeData);
  };
}
/**
 * Function attaching every neighbor iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */


function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(function (description) {
    attachNeighborArrayCreator(Graph, description);
    attachForEachNeighbor(Graph, description);
    attachFindNeighbor(Graph, description);
    attachNeighborIteratorCreator(Graph, description);
  });
}

/**
 * Graphology Adjacency Iteration
 * ================================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's adjacency.
 */

/**
 * Function iterating over a simple graph's adjacency using a callback.
 *
 * @param {boolean}  breakable         - Can we break?
 * @param {boolean}  assymetric        - Whether to emit undirected edges only once.
 * @param {boolean}  disconnectedNodes - Whether to emit disconnected nodes.
 * @param {Graph}    graph             - Target Graph instance.
 * @param {callback} function          - Iteration callback.
 */
function forEachAdjacencySimple(breakable, assymetric, disconnectedNodes, graph, callback) {
  var iterator = graph._nodes.values();

  var type = graph.type;
  var step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;

  while (step = iterator.next(), step.done !== true) {
    var hasEdges = false;
    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;
        hasEdges = true;
        shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
        if (breakable && shouldBreak) return edgeData;
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        if (assymetric && sourceData.key > neighbor) continue;
        edgeData = adj[neighbor];
        targetData = edgeData.target;
        if (targetData.key !== neighbor) targetData = edgeData.source;
        hasEdges = true;
        shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
        if (breakable && shouldBreak) return edgeData;
      }
    }

    if (disconnectedNodes && !hasEdges) {
      shouldBreak = callback(sourceData.key, null, sourceData.attributes, null, null, null, null);
      if (breakable && shouldBreak) return null;
    }
  }

  return;
}
/**
 * Function iterating over a multi graph's adjacency using a callback.
 *
 * @param {boolean}  breakable         - Can we break?
 * @param {boolean}  assymetric        - Whether to emit undirected edges only once.
 * @param {boolean}  disconnectedNodes - Whether to emit disconnected nodes.
 * @param {Graph}    graph             - Target Graph instance.
 * @param {callback} function          - Iteration callback.
 */

function forEachAdjacencyMulti(breakable, assymetric, disconnectedNodes, graph, callback) {
  var iterator = graph._nodes.values();

  var type = graph.type;
  var step;
  var sourceData;
  var neighbor;
  var container;
  var containerStep;
  var adj;
  var edgeData;
  var targetData;
  var shouldBreak;

  while (step = iterator.next(), step.done !== true) {
    var hasEdges = false;
    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        container = adj[neighbor].values();

        while (containerStep = container.next(), containerStep.done !== true) {
          edgeData = containerStep.value;
          targetData = edgeData.target;
          hasEdges = true;
          shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
          if (breakable && shouldBreak) return edgeData;
        }
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        if (assymetric && sourceData.key > neighbor) continue;
        container = adj[neighbor].values();

        while (containerStep = container.next(), containerStep.done !== true) {
          edgeData = containerStep.value;
          targetData = edgeData.target;
          if (targetData.key !== neighbor) targetData = edgeData.source;
          hasEdges = true;
          shouldBreak = callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes, edgeData.undirected);
          if (breakable && shouldBreak) return edgeData;
        }
      }
    }

    if (disconnectedNodes && !hasEdges) {
      shouldBreak = callback(sourceData.key, null, sourceData.attributes, null, null, null, null);
      if (breakable && shouldBreak) return null;
    }
  }

  return;
} // export function createAdjacencyIteratorSimple(graph) {
//   const iterator = graph._nodes.values();
//   const type = graph.type;
//   let state = 'outer',
//     sourceData,
//     neighbors,
//     adj,
//     offset;
//   return new Iterator(function next() {
//     let step;
//     if (state === 'outer') {
//       step = iterator.next();
//       if (step.done === true) return step;
//       sourceData = step.value;
//       state = 'directed';
//       return next();
//     }
//     if (state === 'directed') {
//       if (type === 'undirected') {
//         state = 'undirected';
//         return next();
//       }
//       adj = sourceData.out;
//       neighbors = Object.keys(sourceData.out);
//       offset = 0;
//       state = 'inner-directed';
//       return next();
//     }
//     if (state === 'undirected') {
//       if (type === 'directed') {
//         state = 'outer';
//         return next();
//       }
//       adj = sourceData.undirected;
//       neighbors = Object.keys(sourceData.undirected);
//       offset = 0;
//       state = 'inner-undirected';
//     }
//     // Inner
//     if (offset >= neighbors.length) {
//       if (state === 'inner-undirected') state = 'outer';
//       else state = 'undirected';
//       return next();
//     }
//     const neighbor = neighbors[offset++];
//     const edgeData = adj[neighbor];
//     let targetData = edgeData.target;
//     if (state === 'inner-undirected' && targetData.key === sourceData.key)
//       targetData = edgeData.source;
//     return {
//       done: false,
//       value: {
//         source: sourceData.key,
//         target: targetData.key,
//         sourceAttributes: sourceData.attributes,
//         targetAttributes: targetData.attributes,
//         edgeKey: edgeData.key,
//         edgeAttributes: edgeData.attributes,
//         undirected: edgeData.undirected
//       }
//     };
//   });
// }
// export function createAdjacencyIteratorMulti(graph) {
//   const iterator = graph._nodes.values();
//   const type = graph.type;
//   let state = 'outer',
//     sourceData,
//     neighbors,
//     container = null,
//     adj,
//     offset;
//   return new Iterator(function next() {
//     let step;
//     if (state === 'outer') {
//       step = iterator.next();
//       if (step.done === true) return step;
//       sourceData = step.value;
//       state = 'directed';
//       return next();
//     }
//     if (state === 'directed') {
//       if (type === 'undirected') {
//         state = 'undirected';
//         return next();
//       }
//       adj = sourceData.out;
//       neighbors = Object.keys(sourceData.out);
//       offset = 0;
//       state = 'inner-directed';
//       return next();
//     }
//     if (state === 'undirected') {
//       if (type === 'directed') {
//         state = 'outer';
//         return next();
//       }
//       adj = sourceData.undirected;
//       neighbors = Object.keys(sourceData.undirected);
//       offset = 0;
//       state = 'inner-undirected';
//     }
//     // Inner
//     if (!container && offset >= neighbors.length) {
//       if (state === 'inner-undirected') state = 'outer';
//       else state = 'undirected';
//       return next();
//     }
//     if (!container) {
//       const neighbor = neighbors[offset++];
//       container = adj[neighbor].values();
//       return next();
//     }
//     step = container.next();
//     if (step.done) {
//       container = null;
//       return next();
//     }
//     const edgeData = step.value;
//     let targetData = edgeData.target;
//     if (state === 'inner-undirected' && targetData.key === sourceData.key)
//       targetData = edgeData.source;
//     return {
//       done: false,
//       value: {
//         source: sourceData.key,
//         target: targetData.key,
//         sourceAttributes: sourceData.attributes,
//         targetAttributes: targetData.attributes,
//         edge: edgeData.key,
//         edgeAttributes: edgeData.attributes,
//         undirected: edgeData.undirected
//       }
//     };
//   });
// }

/**
 * Graphology Serialization Utilities
 * ===================================
 *
 * Collection of functions used to validate import-export formats & to ouput
 * them from internal graph data.
 *
 * Serialized Node:
 * {key, ?attributes}
 *
 * Serialized Edge:
 * {key?, source, target, attributes?, undirected?}
 *
 * Serialized Graph:
 * {nodes[], edges?[]}
 */
/**
 * Formats internal node data into a serialized node.
 *
 * @param  {any}    key  - The node's key.
 * @param  {object} data - Internal node's data.
 * @return {array}       - The serialized node.
 */

function serializeNode(key, data) {
  var serialized = {
    key: key
  };
  if (!isEmpty(data.attributes)) serialized.attributes = assign({}, data.attributes);
  return serialized;
}
/**
 * Formats internal edge data into a serialized edge.
 *
 * @param  {any}    key  - The edge's key.
 * @param  {object} data - Internal edge's data.
 * @return {array}       - The serialized edge.
 */

function serializeEdge(key, data) {
  var serialized = {
    key: key,
    source: data.source.key,
    target: data.target.key
  };
  if (!isEmpty(data.attributes)) serialized.attributes = assign({}, data.attributes);
  if (data.undirected) serialized.undirected = true;
  return serialized;
}
/**
 * Checks whether the given value is a serialized node.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */

function validateSerializedNode(value) {
  if (!isPlainObject(value)) return 'not-object';
  if (!('key' in value)) return 'no-key';
  if ('attributes' in value && (!isPlainObject(value.attributes) || value.attributes === null)) return 'invalid-attributes';
  return null;
}
/**
 * Checks whether the given value is a serialized edge.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */

function validateSerializedEdge(value) {
  if (!isPlainObject(value)) return 'not-object';
  if (!('source' in value)) return 'no-source';
  if (!('target' in value)) return 'no-target';
  if ('attributes' in value && (!isPlainObject(value.attributes) || value.attributes === null)) return 'invalid-attributes';
  if ('undirected' in value && typeof value.undirected !== 'boolean') return 'invalid-undirected';
  return null;
}

/**
 * Constants.
 */

var INSTANCE_ID = incrementalIdStartingFromRandomByte();
/**
 * Enums.
 */

var TYPES = new Set(['directed', 'undirected', 'mixed']);
var EMITTER_PROPS = new Set(['domain', '_events', '_eventsCount', '_maxListeners']);
var EDGE_ADD_METHODS = [{
  name: function name(verb) {
    return "".concat(verb, "Edge");
  },
  generateKey: true
}, {
  name: function name(verb) {
    return "".concat(verb, "DirectedEdge");
  },
  generateKey: true,
  type: 'directed'
}, {
  name: function name(verb) {
    return "".concat(verb, "UndirectedEdge");
  },
  generateKey: true,
  type: 'undirected'
}, {
  name: function name(verb) {
    return "".concat(verb, "EdgeWithKey");
  }
}, {
  name: function name(verb) {
    return "".concat(verb, "DirectedEdgeWithKey");
  },
  type: 'directed'
}, {
  name: function name(verb) {
    return "".concat(verb, "UndirectedEdgeWithKey");
  },
  type: 'undirected'
}];
/**
 * Default options.
 */

var DEFAULTS = {
  allowSelfLoops: true,
  multi: false,
  type: 'mixed'
};
/**
 * Abstract functions used by the Graph class for various methods.
 */

/**
 * Internal method used to add a node to the given graph
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {any}     node            - The node's key.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {NodeData}                - Created node data.
 */

function _addNode(graph, node, attributes) {
  if (attributes && !isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.addNode: invalid attributes. Expecting an object but got \"".concat(attributes, "\"")); // String coercion

  node = '' + node;
  attributes = attributes || {};
  if (graph._nodes.has(node)) throw new UsageGraphError("Graph.addNode: the \"".concat(node, "\" node already exist in the graph."));
  var data = new graph.NodeDataClass(node, attributes); // Adding the node to internal register

  graph._nodes.set(node, data); // Emitting


  graph.emit('nodeAdded', {
    key: node,
    attributes: attributes
  });
  return data;
}
/**
 * Same as the above but without sanity checks because we call this in contexts
 * where necessary checks were already done.
 */


function unsafeAddNode(graph, node, attributes) {
  var data = new graph.NodeDataClass(node, attributes);

  graph._nodes.set(node, data);

  graph.emit('nodeAdded', {
    key: node,
    attributes: attributes
  });
  return data;
}
/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */


function addEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {
  // Checking validity of operation
  if (!undirected && graph.type === 'undirected') throw new UsageGraphError("Graph.".concat(name, ": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));
  if (undirected && graph.type === 'directed') throw new UsageGraphError("Graph.".concat(name, ": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));
  if (attributes && !isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.".concat(name, ": invalid attributes. Expecting an object but got \"").concat(attributes, "\"")); // Coercion of source & target:

  source = '' + source;
  target = '' + target;
  attributes = attributes || {};
  if (!graph.allowSelfLoops && source === target) throw new UsageGraphError("Graph.".concat(name, ": source & target are the same (\"").concat(source, "\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));

  var sourceData = graph._nodes.get(source),
      targetData = graph._nodes.get(target);

  if (!sourceData) throw new NotFoundGraphError("Graph.".concat(name, ": source node \"").concat(source, "\" not found."));
  if (!targetData) throw new NotFoundGraphError("Graph.".concat(name, ": target node \"").concat(target, "\" not found.")); // Must the graph generate an id for this edge?

  var eventData = {
    key: null,
    undirected: undirected,
    source: source,
    target: target,
    attributes: attributes
  };

  if (mustGenerateKey) {
    // NOTE: in this case we can guarantee that the key does not already
    // exist and is already correctly casted as a string
    edge = graph._edgeKeyGenerator();
  } else {
    // Coercion of edge key
    edge = '' + edge; // Here, we have a key collision

    if (graph._edges.has(edge)) throw new UsageGraphError("Graph.".concat(name, ": the \"").concat(edge, "\" edge already exists in the graph."));
  } // Here, we might have a source / target collision


  if (!graph.multi && (undirected ? typeof sourceData.undirected[target] !== 'undefined' : typeof sourceData.out[target] !== 'undefined')) {
    throw new UsageGraphError("Graph.".concat(name, ": an edge linking \"").concat(source, "\" to \"").concat(target, "\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));
  } // Storing some data


  var edgeData = new EdgeData(undirected, edge, sourceData, targetData, attributes); // Adding the edge to the internal register

  graph._edges.set(edge, edgeData); // Incrementing node degree counters


  if (source === target) {
    if (undirected) {
      sourceData.undirectedSelfLoops++;
      graph._undirectedSelfLoopCount++;
    } else {
      sourceData.directedSelfLoops++;
      graph._directedSelfLoopCount++;
    }
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  } // Updating relevant index


  updateStructureIndex(graph, undirected, edgeData, source, target, sourceData, targetData);
  if (undirected) graph._undirectedSize++;else graph._directedSize++; // Emitting

  eventData.key = edge;
  graph.emit('edgeAdded', eventData);
  return edge;
}
/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @param  {boolean} [asUpdater]       - Are we updating or merging?
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */


function mergeEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes, asUpdater) {
  // Checking validity of operation
  if (!undirected && graph.type === 'undirected') throw new UsageGraphError("Graph.".concat(name, ": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));
  if (undirected && graph.type === 'directed') throw new UsageGraphError("Graph.".concat(name, ": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));

  if (attributes) {
    if (asUpdater) {
      if (typeof attributes !== 'function') throw new InvalidArgumentsGraphError("Graph.".concat(name, ": invalid updater function. Expecting a function but got \"").concat(attributes, "\""));
    } else {
      if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.".concat(name, ": invalid attributes. Expecting an object but got \"").concat(attributes, "\""));
    }
  } // Coercion of source & target:


  source = '' + source;
  target = '' + target;
  var updater;

  if (asUpdater) {
    updater = attributes;
    attributes = undefined;
  }

  if (!graph.allowSelfLoops && source === target) throw new UsageGraphError("Graph.".concat(name, ": source & target are the same (\"").concat(source, "\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));

  var sourceData = graph._nodes.get(source);

  var targetData = graph._nodes.get(target);

  var edgeData; // Do we need to handle duplicate?

  var alreadyExistingEdgeData;

  if (!mustGenerateKey) {
    edgeData = graph._edges.get(edge);

    if (edgeData) {
      // Here, we need to ensure, if the user gave a key, that source & target
      // are consistent
      if (edgeData.source.key !== source || edgeData.target.key !== target) {
        // If source or target inconsistent
        if (!undirected || edgeData.source.key !== target || edgeData.target.key !== source) {
          // If directed, or source/target aren't flipped
          throw new UsageGraphError("Graph.".concat(name, ": inconsistency detected when attempting to merge the \"").concat(edge, "\" edge with \"").concat(source, "\" source & \"").concat(target, "\" target vs. (\"").concat(edgeData.source.key, "\", \"").concat(edgeData.target.key, "\")."));
        }
      }

      alreadyExistingEdgeData = edgeData;
    }
  } // Here, we might have a source / target collision


  if (!alreadyExistingEdgeData && !graph.multi && sourceData) {
    alreadyExistingEdgeData = undirected ? sourceData.undirected[target] : sourceData.out[target];
  } // Handling duplicates


  if (alreadyExistingEdgeData) {
    var info = [alreadyExistingEdgeData.key, false, false, false]; // We can skip the attribute merging part if the user did not provide them

    if (asUpdater ? !updater : !attributes) return info; // Updating the attributes

    if (asUpdater) {
      var oldAttributes = alreadyExistingEdgeData.attributes;
      alreadyExistingEdgeData.attributes = updater(oldAttributes);
      graph.emit('edgeAttributesUpdated', {
        type: 'replace',
        key: alreadyExistingEdgeData.key,
        attributes: alreadyExistingEdgeData.attributes
      });
    } // Merging the attributes
    else {
      assign(alreadyExistingEdgeData.attributes, attributes);
      graph.emit('edgeAttributesUpdated', {
        type: 'merge',
        key: alreadyExistingEdgeData.key,
        attributes: alreadyExistingEdgeData.attributes,
        data: attributes
      });
    }

    return info;
  }

  attributes = attributes || {};
  if (asUpdater && updater) attributes = updater(attributes); // Must the graph generate an id for this edge?

  var eventData = {
    key: null,
    undirected: undirected,
    source: source,
    target: target,
    attributes: attributes
  };

  if (mustGenerateKey) {
    // NOTE: in this case we can guarantee that the key does not already
    // exist and is already correctly casted as a string
    edge = graph._edgeKeyGenerator();
  } else {
    // Coercion of edge key
    edge = '' + edge; // Here, we have a key collision

    if (graph._edges.has(edge)) throw new UsageGraphError("Graph.".concat(name, ": the \"").concat(edge, "\" edge already exists in the graph."));
  }

  var sourceWasAdded = false;
  var targetWasAdded = false;

  if (!sourceData) {
    sourceData = unsafeAddNode(graph, source, {});
    sourceWasAdded = true;

    if (source === target) {
      targetData = sourceData;
      targetWasAdded = true;
    }
  }

  if (!targetData) {
    targetData = unsafeAddNode(graph, target, {});
    targetWasAdded = true;
  } // Storing some data


  edgeData = new EdgeData(undirected, edge, sourceData, targetData, attributes); // Adding the edge to the internal register

  graph._edges.set(edge, edgeData); // Incrementing node degree counters


  if (source === target) {
    if (undirected) {
      sourceData.undirectedSelfLoops++;
      graph._undirectedSelfLoopCount++;
    } else {
      sourceData.directedSelfLoops++;
      graph._directedSelfLoopCount++;
    }
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  } // Updating relevant index


  updateStructureIndex(graph, undirected, edgeData, source, target, sourceData, targetData);
  if (undirected) graph._undirectedSize++;else graph._directedSize++; // Emitting

  eventData.key = edge;
  graph.emit('edgeAdded', eventData);
  return [edge, true, sourceWasAdded, targetWasAdded];
}
/**
 * Graph class
 *
 * @constructor
 * @param  {object}  [options] - Options:
 * @param  {boolean}   [allowSelfLoops] - Allow self loops?
 * @param  {string}    [type]           - Type of the graph.
 * @param  {boolean}   [map]            - Allow references as keys?
 * @param  {boolean}   [multi]          - Allow parallel edges?
 *
 * @throws {Error} - Will throw if the arguments are not valid.
 */


var Graph = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(Graph, _EventEmitter);

  function Graph(options) {
    var _this;

    _this = _EventEmitter.call(this) || this; //-- Solving options

    options = assign({}, DEFAULTS, options); // Enforcing options validity

    if (typeof options.multi !== 'boolean') throw new InvalidArgumentsGraphError("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(options.multi, "\"."));
    if (!TYPES.has(options.type)) throw new InvalidArgumentsGraphError("Graph.constructor: invalid 'type' option. Should be one of \"mixed\", \"directed\" or \"undirected\" but got \"".concat(options.type, "\"."));
    if (typeof options.allowSelfLoops !== 'boolean') throw new InvalidArgumentsGraphError("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(options.allowSelfLoops, "\".")); //-- Private properties
    // Utilities

    var NodeDataClass = options.type === 'mixed' ? MixedNodeData : options.type === 'directed' ? DirectedNodeData : UndirectedNodeData;
    privateProperty(_assertThisInitialized(_this), 'NodeDataClass', NodeDataClass); // Internal edge key generator
    // NOTE: this internal generator produce keys that are strings
    // composed of a weird prefix, an incremental instance id starting from
    // a random byte and finally an internal instance incremental id.
    // All this to avoid intra-frame and cross-frame adversarial inputs
    // that can force a single #.addEdge call to degenerate into a O(n)
    // available key search loop.
    // It also ensures that automatically generated edge keys are unlikely
    // to produce collisions with arbitrary keys given by users.

    var instancePrefix = 'geid_' + INSTANCE_ID() + '_';
    var edgeId = 0;

    var edgeKeyGenerator = function edgeKeyGenerator() {
      var availableEdgeKey;

      do {
        availableEdgeKey = instancePrefix + edgeId++;
      } while (_this._edges.has(availableEdgeKey));

      return availableEdgeKey;
    }; // Indexes


    privateProperty(_assertThisInitialized(_this), '_attributes', {});
    privateProperty(_assertThisInitialized(_this), '_nodes', new Map());
    privateProperty(_assertThisInitialized(_this), '_edges', new Map());
    privateProperty(_assertThisInitialized(_this), '_directedSize', 0);
    privateProperty(_assertThisInitialized(_this), '_undirectedSize', 0);
    privateProperty(_assertThisInitialized(_this), '_directedSelfLoopCount', 0);
    privateProperty(_assertThisInitialized(_this), '_undirectedSelfLoopCount', 0);
    privateProperty(_assertThisInitialized(_this), '_edgeKeyGenerator', edgeKeyGenerator); // Options

    privateProperty(_assertThisInitialized(_this), '_options', options); // Emitter properties

    EMITTER_PROPS.forEach(function (prop) {
      return privateProperty(_assertThisInitialized(_this), prop, _this[prop]);
    }); //-- Properties readers

    readOnlyProperty(_assertThisInitialized(_this), 'order', function () {
      return _this._nodes.size;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'size', function () {
      return _this._edges.size;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'directedSize', function () {
      return _this._directedSize;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'undirectedSize', function () {
      return _this._undirectedSize;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'selfLoopCount', function () {
      return _this._directedSelfLoopCount + _this._undirectedSelfLoopCount;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'directedSelfLoopCount', function () {
      return _this._directedSelfLoopCount;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'undirectedSelfLoopCount', function () {
      return _this._undirectedSelfLoopCount;
    });
    readOnlyProperty(_assertThisInitialized(_this), 'multi', _this._options.multi);
    readOnlyProperty(_assertThisInitialized(_this), 'type', _this._options.type);
    readOnlyProperty(_assertThisInitialized(_this), 'allowSelfLoops', _this._options.allowSelfLoops);
    readOnlyProperty(_assertThisInitialized(_this), 'implementation', function () {
      return 'graphology';
    });
    return _this;
  }

  var _proto = Graph.prototype;

  _proto._resetInstanceCounters = function _resetInstanceCounters() {
    this._directedSize = 0;
    this._undirectedSize = 0;
    this._directedSelfLoopCount = 0;
    this._undirectedSelfLoopCount = 0;
  }
  /**---------------------------------------------------------------------------
   * Read
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning whether the given node is found in the graph.
   *
   * @param  {any}     node - The node.
   * @return {boolean}
   */
  ;

  _proto.hasNode = function hasNode(node) {
    return this._nodes.has('' + node);
  }
  /**
   * Method returning whether the given directed edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */
  ;

  _proto.hasDirectedEdge = function hasDirectedEdge(source, target) {
    // Early termination
    if (this.type === 'undirected') return false;

    if (arguments.length === 1) {
      var edge = '' + source;

      var edgeData = this._edges.get(edge);

      return !!edgeData && !edgeData.undirected;
    } else if (arguments.length === 2) {
      source = '' + source;
      target = '' + target; // If the node source or the target is not in the graph we break

      var nodeData = this._nodes.get(source);

      if (!nodeData) return false; // Is there a directed edge pointing toward target?

      var edges = nodeData.out[target];
      if (!edges) return false;
      return this.multi ? !!edges.size : true;
    }

    throw new InvalidArgumentsGraphError("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
  }
  /**
   * Method returning whether the given undirected edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */
  ;

  _proto.hasUndirectedEdge = function hasUndirectedEdge(source, target) {
    // Early termination
    if (this.type === 'directed') return false;

    if (arguments.length === 1) {
      var edge = '' + source;

      var edgeData = this._edges.get(edge);

      return !!edgeData && edgeData.undirected;
    } else if (arguments.length === 2) {
      source = '' + source;
      target = '' + target; // If the node source or the target is not in the graph we break

      var nodeData = this._nodes.get(source);

      if (!nodeData) return false; // Is there a directed edge pointing toward target?

      var edges = nodeData.undirected[target];
      if (!edges) return false;
      return this.multi ? !!edges.size : true;
    }

    throw new InvalidArgumentsGraphError("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
  }
  /**
   * Method returning whether the given edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */
  ;

  _proto.hasEdge = function hasEdge(source, target) {
    if (arguments.length === 1) {
      var edge = '' + source;
      return this._edges.has(edge);
    } else if (arguments.length === 2) {
      source = '' + source;
      target = '' + target; // If the node source or the target is not in the graph we break

      var nodeData = this._nodes.get(source);

      if (!nodeData) return false; // Is there a directed edge pointing toward target?

      var edges = typeof nodeData.out !== 'undefined' && nodeData.out[target];
      if (!edges) edges = typeof nodeData.undirected !== 'undefined' && nodeData.undirected[target];
      if (!edges) return false;
      return this.multi ? !!edges.size : true;
    }

    throw new InvalidArgumentsGraphError("Graph.hasEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
  }
  /**
   * Method returning the edge matching source & target in a directed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */
  ;

  _proto.directedEdge = function directedEdge(source, target) {
    if (this.type === 'undirected') return;
    source = '' + source;
    target = '' + target;
    if (this.multi) throw new UsageGraphError('Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.');

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new NotFoundGraphError("Graph.directedEdge: could not find the \"".concat(source, "\" source node in the graph."));
    if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.directedEdge: could not find the \"".concat(target, "\" target node in the graph."));
    var edgeData = sourceData.out && sourceData.out[target] || undefined;
    if (edgeData) return edgeData.key;
  }
  /**
   * Method returning the edge matching source & target in a undirected fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */
  ;

  _proto.undirectedEdge = function undirectedEdge(source, target) {
    if (this.type === 'directed') return;
    source = '' + source;
    target = '' + target;
    if (this.multi) throw new UsageGraphError('Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.');

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new NotFoundGraphError("Graph.undirectedEdge: could not find the \"".concat(source, "\" source node in the graph."));
    if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.undirectedEdge: could not find the \"".concat(target, "\" target node in the graph."));
    var edgeData = sourceData.undirected && sourceData.undirected[target] || undefined;
    if (edgeData) return edgeData.key;
  }
  /**
   * Method returning the edge matching source & target in a mixed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */
  ;

  _proto.edge = function edge(source, target) {
    if (this.multi) throw new UsageGraphError('Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.');
    source = '' + source;
    target = '' + target;

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new NotFoundGraphError("Graph.edge: could not find the \"".concat(source, "\" source node in the graph."));
    if (!this._nodes.has(target)) throw new NotFoundGraphError("Graph.edge: could not find the \"".concat(target, "\" target node in the graph."));
    var edgeData = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target] || undefined;
    if (edgeData) return edgeData.key;
  }
  /**
   * Method returning whether two nodes are directed neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areDirectedNeighbors = function areDirectedNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areDirectedNeighbors: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return false;
    return neighbor in nodeData["in"] || neighbor in nodeData.out;
  }
  /**
   * Method returning whether two nodes are out neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areOutNeighbors = function areOutNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areOutNeighbors: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return false;
    return neighbor in nodeData.out;
  }
  /**
   * Method returning whether two nodes are in neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areInNeighbors = function areInNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areInNeighbors: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return false;
    return neighbor in nodeData["in"];
  }
  /**
   * Method returning whether two nodes are undirected neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areUndirectedNeighbors = function areUndirectedNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areUndirectedNeighbors: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'directed') return false;
    return neighbor in nodeData.undirected;
  }
  /**
   * Method returning whether two nodes are neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areNeighbors = function areNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areNeighbors: could not find the \"".concat(node, "\" node in the graph."));

    if (this.type !== 'undirected') {
      if (neighbor in nodeData["in"] || neighbor in nodeData.out) return true;
    }

    if (this.type !== 'directed') {
      if (neighbor in nodeData.undirected) return true;
    }

    return false;
  }
  /**
   * Method returning whether two nodes are inbound neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areInboundNeighbors = function areInboundNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areInboundNeighbors: could not find the \"".concat(node, "\" node in the graph."));

    if (this.type !== 'undirected') {
      if (neighbor in nodeData["in"]) return true;
    }

    if (this.type !== 'directed') {
      if (neighbor in nodeData.undirected) return true;
    }

    return false;
  }
  /**
   * Method returning whether two nodes are outbound neighbors.
   *
   * @param  {any}     node     - The node's key.
   * @param  {any}     neighbor - The neighbor's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.areOutboundNeighbors = function areOutboundNeighbors(node, neighbor) {
    node = '' + node;
    neighbor = '' + neighbor;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.areOutboundNeighbors: could not find the \"".concat(node, "\" node in the graph."));

    if (this.type !== 'undirected') {
      if (neighbor in nodeData.out) return true;
    }

    if (this.type !== 'directed') {
      if (neighbor in nodeData.undirected) return true;
    }

    return false;
  }
  /**
   * Method returning the given node's in degree.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.inDegree = function inDegree(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.inDegree: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return 0;
    return nodeData.inDegree + nodeData.directedSelfLoops;
  }
  /**
   * Method returning the given node's out degree.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.outDegree = function outDegree(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.outDegree: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return 0;
    return nodeData.outDegree + nodeData.directedSelfLoops;
  }
  /**
   * Method returning the given node's directed degree.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.directedDegree = function directedDegree(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.directedDegree: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return 0;
    var loops = nodeData.directedSelfLoops;
    var inDegree = nodeData.inDegree + loops;
    var outDegree = nodeData.outDegree + loops;
    return inDegree + outDegree;
  }
  /**
   * Method returning the given node's undirected degree.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.undirectedDegree = function undirectedDegree(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.undirectedDegree: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'directed') return 0;
    var loops = nodeData.undirectedSelfLoops;
    return nodeData.undirectedDegree + loops * 2;
  }
  /**
   * Method returning the given node's directed degree.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.degree = function degree(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.degree: could not find the \"".concat(node, "\" node in the graph."));
    var degree = 0;

    if (this.type !== 'directed') {
      degree += nodeData.undirectedDegree + nodeData.undirectedSelfLoops * 2;
    }

    if (this.type !== 'undirected') {
      degree += nodeData.inDegree + nodeData.outDegree + nodeData.directedSelfLoops * 2;
    }

    return degree;
  }
  /**
   * Method returning the given node's in degree without considering self loops.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.inDegreeWithoutSelfLoops = function inDegreeWithoutSelfLoops(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.inDegreeWithoutSelfLoops: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return 0;
    return nodeData.inDegree;
  }
  /**
   * Method returning the given node's out degree without considering self loops.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.outDegreeWithoutSelfLoops = function outDegreeWithoutSelfLoops(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.outDegreeWithoutSelfLoops: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return 0;
    return nodeData.outDegree;
  }
  /**
   * Method returning the given node's directed degree without considering self loops.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.directedDegreeWithoutSelfLoops = function directedDegreeWithoutSelfLoops(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.directedDegreeWithoutSelfLoops: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'undirected') return 0;
    return nodeData.inDegree + nodeData.outDegree;
  }
  /**
   * Method returning the given node's undirected degree without considering self loops.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.undirectedDegreeWithoutSelfLoops = function undirectedDegreeWithoutSelfLoops(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.undirectedDegreeWithoutSelfLoops: could not find the \"".concat(node, "\" node in the graph."));
    if (this.type === 'directed') return 0;
    return nodeData.undirectedDegree;
  }
  /**
   * Method returning the given node's directed degree without considering self loops.
   *
   * @param  {any}     node - The node's key.
   * @return {number}       - The node's in degree.
   *
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  ;

  _proto.degreeWithoutSelfLoops = function degreeWithoutSelfLoops(node) {
    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.degreeWithoutSelfLoops: could not find the \"".concat(node, "\" node in the graph."));
    var degree = 0;

    if (this.type !== 'directed') {
      degree += nodeData.undirectedDegree;
    }

    if (this.type !== 'undirected') {
      degree += nodeData.inDegree + nodeData.outDegree;
    }

    return degree;
  }
  /**
   * Method returning the given edge's source.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's source.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  ;

  _proto.source = function source(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.source: could not find the \"".concat(edge, "\" edge in the graph."));
    return data.source.key;
  }
  /**
   * Method returning the given edge's target.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's target.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  ;

  _proto.target = function target(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.target: could not find the \"".concat(edge, "\" edge in the graph."));
    return data.target.key;
  }
  /**
   * Method returning the given edge's extremities.
   *
   * @param  {any}   edge - The edge's key.
   * @return {array}      - The edge's extremities.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  ;

  _proto.extremities = function extremities(edge) {
    edge = '' + edge;

    var edgeData = this._edges.get(edge);

    if (!edgeData) throw new NotFoundGraphError("Graph.extremities: could not find the \"".concat(edge, "\" edge in the graph."));
    return [edgeData.source.key, edgeData.target.key];
  }
  /**
   * Given a node & an edge, returns the other extremity of the edge.
   *
   * @param  {any}   node - The node's key.
   * @param  {any}   edge - The edge's key.
   * @return {any}        - The related node.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph or if the
   *                   edge & node are not related.
   */
  ;

  _proto.opposite = function opposite(node, edge) {
    node = '' + node;
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.opposite: could not find the \"".concat(edge, "\" edge in the graph."));
    var source = data.source.key;
    var target = data.target.key;
    if (node === source) return target;
    if (node === target) return source;
    throw new NotFoundGraphError("Graph.opposite: the \"".concat(node, "\" node is not attached to the \"").concat(edge, "\" edge (").concat(source, ", ").concat(target, ")."));
  }
  /**
   * Returns whether the given edge has the given node as extremity.
   *
   * @param  {any}     edge - The edge's key.
   * @param  {any}     node - The node's key.
   * @return {boolean}      - The related node.
   *
   * @throws {Error} - Will throw if either the node or the edge isn't in the graph.
   */
  ;

  _proto.hasExtremity = function hasExtremity(edge, node) {
    edge = '' + edge;
    node = '' + node;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.hasExtremity: could not find the \"".concat(edge, "\" edge in the graph."));
    return data.source.key === node || data.target.key === node;
  }
  /**
   * Method returning whether the given edge is undirected.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  ;

  _proto.isUndirected = function isUndirected(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.isUndirected: could not find the \"".concat(edge, "\" edge in the graph."));
    return data.undirected;
  }
  /**
   * Method returning whether the given edge is directed.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  ;

  _proto.isDirected = function isDirected(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.isDirected: could not find the \"".concat(edge, "\" edge in the graph."));
    return !data.undirected;
  }
  /**
   * Method returning whether the given edge is a self loop.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  ;

  _proto.isSelfLoop = function isSelfLoop(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.isSelfLoop: could not find the \"".concat(edge, "\" edge in the graph."));
    return data.source === data.target;
  }
  /**---------------------------------------------------------------------------
   * Mutation
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to add a node to the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   *
   * @throws {Error} - Will throw if the given node already exist.
   * @throws {Error} - Will throw if the given attributes are not an object.
   */
  ;

  _proto.addNode = function addNode(node, attributes) {
    var nodeData = _addNode(this, node, attributes);

    return nodeData.key;
  }
  /**
   * Method used to merge a node into the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   */
  ;

  _proto.mergeNode = function mergeNode(node, attributes) {
    if (attributes && !isPlainObject(attributes)) throw new InvalidArgumentsGraphError("Graph.mergeNode: invalid attributes. Expecting an object but got \"".concat(attributes, "\"")); // String coercion

    node = '' + node;
    attributes = attributes || {}; // If the node already exists, we merge the attributes

    var data = this._nodes.get(node);

    if (data) {
      if (attributes) {
        assign(data.attributes, attributes);
        this.emit('nodeAttributesUpdated', {
          type: 'merge',
          key: node,
          attributes: data.attributes,
          data: attributes
        });
      }

      return [node, false];
    }

    data = new this.NodeDataClass(node, attributes); // Adding the node to internal register

    this._nodes.set(node, data); // Emitting


    this.emit('nodeAdded', {
      key: node,
      attributes: attributes
    });
    return [node, true];
  }
  /**
   * Method used to add a node if it does not exist in the graph or else to
   * update its attributes using a function.
   *
   * @param  {any}      node      - The node.
   * @param  {function} [updater] - Optional updater function.
   * @return {any}                - The node.
   */
  ;

  _proto.updateNode = function updateNode(node, updater) {
    if (updater && typeof updater !== 'function') throw new InvalidArgumentsGraphError("Graph.updateNode: invalid updater function. Expecting a function but got \"".concat(updater, "\"")); // String coercion

    node = '' + node; // If the node already exists, we update the attributes

    var data = this._nodes.get(node);

    if (data) {
      if (updater) {
        var oldAttributes = data.attributes;
        data.attributes = updater(oldAttributes);
        this.emit('nodeAttributesUpdated', {
          type: 'replace',
          key: node,
          attributes: data.attributes
        });
      }

      return [node, false];
    }

    var attributes = updater ? updater({}) : {};
    data = new this.NodeDataClass(node, attributes); // Adding the node to internal register

    this._nodes.set(node, data); // Emitting


    this.emit('nodeAdded', {
      key: node,
      attributes: attributes
    });
    return [node, true];
  }
  /**
   * Method used to drop a single node & all its attached edges from the graph.
   *
   * @param  {any}    node - The node.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node doesn't exist.
   */
  ;

  _proto.dropNode = function dropNode(node) {
    var _this2 = this;

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new NotFoundGraphError("Graph.dropNode: could not find the \"".concat(node, "\" node in the graph.")); // Removing attached edges
    // TODO: we could do faster

    this.forEachEdge(node, function (edge) {
      _this2.dropEdge(edge);
    }); // Dropping the node from the register

    this._nodes["delete"](node); // Emitting


    this.emit('nodeDropped', {
      key: node,
      attributes: nodeData.attributes
    });
  }
  /**
   * Method used to drop a single edge from the graph.
   *
   * Arity 1:
   * @param  {any}    edge - The edge.
   *
   * Arity 2:
   * @param  {any}    source - Source node.
   * @param  {any}    target - Target node.
   *
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the edge doesn't exist.
   */
  ;

  _proto.dropEdge = function dropEdge(edge) {
    var edgeData;

    if (arguments.length > 1) {
      var source = '' + arguments[0],
          target = '' + arguments[1];
      edgeData = getMatchingEdge(this, source, target, this.type);
      if (!edgeData) throw new NotFoundGraphError("Graph.dropEdge: could not find the \"".concat(source, "\" -> \"").concat(target, "\" edge in the graph."));
    } else {
      edge = '' + edge;
      edgeData = this._edges.get(edge);
      if (!edgeData) throw new NotFoundGraphError("Graph.dropEdge: could not find the \"".concat(edge, "\" edge in the graph."));
    } // Dropping the edge from the register


    this._edges["delete"](edgeData.key); // Updating related degrees


    var _edgeData = edgeData,
        sourceData = _edgeData.source,
        targetData = _edgeData.target,
        attributes = _edgeData.attributes;
    var undirected = edgeData.undirected;

    if (sourceData === targetData) {
      if (undirected) {
        sourceData.undirectedSelfLoops--;
        this._undirectedSelfLoopCount--;
      } else {
        sourceData.directedSelfLoops--;
        this._directedSelfLoopCount--;
      }
    } else {
      if (undirected) {
        sourceData.undirectedDegree--;
        targetData.undirectedDegree--;
      } else {
        sourceData.outDegree--;
        targetData.inDegree--;
      }
    } // Clearing index


    clearEdgeFromStructureIndex(this, undirected, edgeData);
    if (undirected) this._undirectedSize--;else this._directedSize--; // Emitting

    this.emit('edgeDropped', {
      key: edge,
      attributes: attributes,
      source: sourceData.key,
      target: targetData.key,
      undirected: undirected
    });
    return this;
  }
  /**
   * Method used to remove every edge & every node from the graph.
   *
   * @return {Graph}
   */
  ;

  _proto.clear = function clear() {
    // Clearing edges
    this._edges.clear(); // Clearing nodes


    this._nodes.clear(); // Reset counters


    this._resetInstanceCounters(); // Emitting


    this.emit('cleared');
  }
  /**
   * Method used to remove every edge from the graph.
   *
   * @return {Graph}
   */
  ;

  _proto.clearEdges = function clearEdges() {
    clearStructureIndex(this); // Clearing edges

    this._edges.clear(); // Reset counters


    this._resetInstanceCounters(); // Emitting


    this.emit('edgesCleared');
  }
  /**---------------------------------------------------------------------------
   * Attributes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the desired graph's attribute.
   *
   * @param  {string} name - Name of the attribute.
   * @return {any}
   */
  ;

  _proto.getAttribute = function getAttribute(name) {
    return this._attributes[name];
  }
  /**
   * Method returning the graph's attributes.
   *
   * @return {object}
   */
  ;

  _proto.getAttributes = function getAttributes() {
    return this._attributes;
  }
  /**
   * Method returning whether the graph has the desired attribute.
   *
   * @param  {string}  name - Name of the attribute.
   * @return {boolean}
   */
  ;

  _proto.hasAttribute = function hasAttribute(name) {
    return this._attributes.hasOwnProperty(name);
  }
  /**
   * Method setting a value for the desired graph's attribute.
   *
   * @param  {string}  name  - Name of the attribute.
   * @param  {any}     value - Value for the attribute.
   * @return {Graph}
   */
  ;

  _proto.setAttribute = function setAttribute(name, value) {
    this._attributes[name] = value; // Emitting

    this.emit('attributesUpdated', {
      type: 'set',
      attributes: this._attributes,
      name: name
    });
    return this;
  }
  /**
   * Method using a function to update the desired graph's attribute's value.
   *
   * @param  {string}   name    - Name of the attribute.
   * @param  {function} updater - Function use to update the attribute's value.
   * @return {Graph}
   */
  ;

  _proto.updateAttribute = function updateAttribute(name, updater) {
    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');
    var value = this._attributes[name];
    this._attributes[name] = updater(value); // Emitting

    this.emit('attributesUpdated', {
      type: 'set',
      attributes: this._attributes,
      name: name
    });
    return this;
  }
  /**
   * Method removing the desired graph's attribute.
   *
   * @param  {string} name  - Name of the attribute.
   * @return {Graph}
   */
  ;

  _proto.removeAttribute = function removeAttribute(name) {
    delete this._attributes[name]; // Emitting

    this.emit('attributesUpdated', {
      type: 'remove',
      attributes: this._attributes,
      name: name
    });
    return this;
  }
  /**
   * Method replacing the graph's attributes.
   *
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */
  ;

  _proto.replaceAttributes = function replaceAttributes(attributes) {
    if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError('Graph.replaceAttributes: provided attributes are not a plain object.');
    this._attributes = attributes; // Emitting

    this.emit('attributesUpdated', {
      type: 'replace',
      attributes: this._attributes
    });
    return this;
  }
  /**
   * Method merging the graph's attributes.
   *
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */
  ;

  _proto.mergeAttributes = function mergeAttributes(attributes) {
    if (!isPlainObject(attributes)) throw new InvalidArgumentsGraphError('Graph.mergeAttributes: provided attributes are not a plain object.');
    assign(this._attributes, attributes); // Emitting

    this.emit('attributesUpdated', {
      type: 'merge',
      attributes: this._attributes,
      data: attributes
    });
    return this;
  }
  /**
   * Method updating the graph's attributes.
   *
   * @param  {function} updater - Function used to update the attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given updater is not a function.
   */
  ;

  _proto.updateAttributes = function updateAttributes(updater) {
    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError('Graph.updateAttributes: provided updater is not a function.');
    this._attributes = updater(this._attributes); // Emitting

    this.emit('attributesUpdated', {
      type: 'update',
      attributes: this._attributes
    });
    return this;
  }
  /**
   * Method used to update each node's attributes using the given function.
   *
   * @param {function}  updater - Updater function to use.
   * @param {object}    [hints] - Optional hints.
   */
  ;

  _proto.updateEachNodeAttributes = function updateEachNodeAttributes(updater, hints) {
    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError('Graph.updateEachNodeAttributes: expecting an updater function.');
    if (hints && !validateHints(hints)) throw new InvalidArgumentsGraphError('Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}');

    var iterator = this._nodes.values();

    var step, nodeData;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      nodeData.attributes = updater(nodeData.key, nodeData.attributes);
    }

    this.emit('eachNodeAttributesUpdated', {
      hints: hints ? hints : null
    });
  }
  /**
   * Method used to update each edge's attributes using the given function.
   *
   * @param {function}  updater - Updater function to use.
   * @param {object}    [hints] - Optional hints.
   */
  ;

  _proto.updateEachEdgeAttributes = function updateEachEdgeAttributes(updater, hints) {
    if (typeof updater !== 'function') throw new InvalidArgumentsGraphError('Graph.updateEachEdgeAttributes: expecting an updater function.');
    if (hints && !validateHints(hints)) throw new InvalidArgumentsGraphError('Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}');

    var iterator = this._edges.values();

    var step, edgeData, sourceData, targetData;

    while (step = iterator.next(), step.done !== true) {
      edgeData = step.value;
      sourceData = edgeData.source;
      targetData = edgeData.target;
      edgeData.attributes = updater(edgeData.key, edgeData.attributes, sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.undirected);
    }

    this.emit('eachEdgeAttributesUpdated', {
      hints: hints ? hints : null
    });
  }
  /**---------------------------------------------------------------------------
   * Iteration-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method iterating over the graph's adjacency using the given callback.
   *
   * @param  {function}  callback - Callback to use.
   */
  ;

  _proto.forEachAdjacencyEntry = function forEachAdjacencyEntry(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.forEachAdjacencyEntry: expecting a callback.');
    if (this.multi) forEachAdjacencyMulti(false, false, false, this, callback);else forEachAdjacencySimple(false, false, false, this, callback);
  };

  _proto.forEachAdjacencyEntryWithOrphans = function forEachAdjacencyEntryWithOrphans(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.');
    if (this.multi) forEachAdjacencyMulti(false, false, true, this, callback);else forEachAdjacencySimple(false, false, true, this, callback);
  }
  /**
   * Method iterating over the graph's assymetric adjacency using the given callback.
   *
   * @param  {function}  callback - Callback to use.
   */
  ;

  _proto.forEachAssymetricAdjacencyEntry = function forEachAssymetricAdjacencyEntry(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.forEachAssymetricAdjacencyEntry: expecting a callback.');
    if (this.multi) forEachAdjacencyMulti(false, true, false, this, callback);else forEachAdjacencySimple(false, true, false, this, callback);
  };

  _proto.forEachAssymetricAdjacencyEntryWithOrphans = function forEachAssymetricAdjacencyEntryWithOrphans(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.');
    if (this.multi) forEachAdjacencyMulti(false, true, true, this, callback);else forEachAdjacencySimple(false, true, true, this, callback);
  }
  /**
   * Method returning the list of the graph's nodes.
   *
   * @return {array} - The nodes.
   */
  ;

  _proto.nodes = function nodes() {
    if (typeof Array.from === 'function') return Array.from(this._nodes.keys());
    return take__default["default"](this._nodes.keys(), this._nodes.size);
  }
  /**
   * Method iterating over the graph's nodes using the given callback.
   *
   * @param  {function}  callback - Callback (key, attributes, index).
   */
  ;

  _proto.forEachNode = function forEachNode(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.forEachNode: expecting a callback.');

    var iterator = this._nodes.values();

    var step, nodeData;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      callback(nodeData.key, nodeData.attributes);
    }
  }
  /**
   * Method iterating attempting to find a node matching the given predicate
   * function.
   *
   * @param  {function}  callback - Callback (key, attributes).
   */
  ;

  _proto.findNode = function findNode(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.findNode: expecting a callback.');

    var iterator = this._nodes.values();

    var step, nodeData;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      if (callback(nodeData.key, nodeData.attributes)) return nodeData.key;
    }

    return;
  }
  /**
   * Method mapping nodes.
   *
   * @param  {function}  callback - Callback (key, attributes).
   */
  ;

  _proto.mapNodes = function mapNodes(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.mapNode: expecting a callback.');

    var iterator = this._nodes.values();

    var step, nodeData;
    var result = new Array(this.order);
    var i = 0;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      result[i++] = callback(nodeData.key, nodeData.attributes);
    }

    return result;
  }
  /**
   * Method returning whether some node verify the given predicate.
   *
   * @param  {function}  callback - Callback (key, attributes).
   */
  ;

  _proto.someNode = function someNode(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.someNode: expecting a callback.');

    var iterator = this._nodes.values();

    var step, nodeData;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      if (callback(nodeData.key, nodeData.attributes)) return true;
    }

    return false;
  }
  /**
   * Method returning whether all node verify the given predicate.
   *
   * @param  {function}  callback - Callback (key, attributes).
   */
  ;

  _proto.everyNode = function everyNode(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.everyNode: expecting a callback.');

    var iterator = this._nodes.values();

    var step, nodeData;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      if (!callback(nodeData.key, nodeData.attributes)) return false;
    }

    return true;
  }
  /**
   * Method filtering nodes.
   *
   * @param  {function}  callback - Callback (key, attributes).
   */
  ;

  _proto.filterNodes = function filterNodes(callback) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.filterNodes: expecting a callback.');

    var iterator = this._nodes.values();

    var step, nodeData;
    var result = [];

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      if (callback(nodeData.key, nodeData.attributes)) result.push(nodeData.key);
    }

    return result;
  }
  /**
   * Method reducing nodes.
   *
   * @param  {function}  callback - Callback (accumulator, key, attributes).
   */
  ;

  _proto.reduceNodes = function reduceNodes(callback, initialValue) {
    if (typeof callback !== 'function') throw new InvalidArgumentsGraphError('Graph.reduceNodes: expecting a callback.');
    if (arguments.length < 2) throw new InvalidArgumentsGraphError('Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.');
    var accumulator = initialValue;

    var iterator = this._nodes.values();

    var step, nodeData;

    while (step = iterator.next(), step.done !== true) {
      nodeData = step.value;
      accumulator = callback(accumulator, nodeData.key, nodeData.attributes);
    }

    return accumulator;
  }
  /**
   * Method returning an iterator over the graph's node entries.
   *
   * @return {Iterator}
   */
  ;

  _proto.nodeEntries = function nodeEntries() {
    var iterator = this._nodes.values();

    return new Iterator__default["default"](function () {
      var step = iterator.next();
      if (step.done) return step;
      var data = step.value;
      return {
        value: {
          node: data.key,
          attributes: data.attributes
        },
        done: false
      };
    });
  }
  /**---------------------------------------------------------------------------
   * Serialization
   **---------------------------------------------------------------------------
   */

  /**
   * Method exporting the target node.
   *
   * @param  {any}   node - Target node.
   * @return {array}      - The serialized node.
   *
   * @throws {Error} - Will throw if the node is not found.
   */
  ;

  _proto.exportNode = function exportNode(node) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new NotFoundGraphError("Graph.exportNode: could not find the \"".concat(node, "\" node in the graph."));
    return serializeNode(node, data);
  }
  /**
   * Method exporting the target edge.
   *
   * @param  {any}   edge - Target edge.
   * @return {array}      - The serialized edge.
   *
   * @throws {Error} - Will throw if the edge is not found.
   */
  ;

  _proto.exportEdge = function exportEdge(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new NotFoundGraphError("Graph.exportEdge: could not find the \"".concat(edge, "\" edge in the graph."));
    return serializeEdge(edge, data);
  }
  /**
   * Method used to export the whole graph.
   *
   * @return {object} - The serialized graph.
   */
  ;

  _proto["export"] = function _export() {
    var nodes = new Array(this._nodes.size);
    var i = 0;

    this._nodes.forEach(function (data, key) {
      nodes[i++] = serializeNode(key, data);
    });

    var edges = new Array(this._edges.size);
    i = 0;

    this._edges.forEach(function (data, key) {
      edges[i++] = serializeEdge(key, data);
    });

    return {
      attributes: this.getAttributes(),
      nodes: nodes,
      edges: edges,
      options: {
        type: this.type,
        multi: this.multi,
        allowSelfLoops: this.allowSelfLoops
      }
    };
  }
  /**
   * Method used to import a serialized node.
   *
   * @param  {object} data   - The serialized node.
   * @param  {boolean} merge - Whether to merge the given node.
   * @return {Graph}         - Returns itself for chaining.
   */
  ;

  _proto.importNode = function importNode(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // Validating
    var error = validateSerializedNode(data);

    if (error) {
      if (error === 'not-object') throw new InvalidArgumentsGraphError('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
      if (error === 'no-key') throw new InvalidArgumentsGraphError('Graph.importNode: no key provided.');
      if (error === 'invalid-attributes') throw new InvalidArgumentsGraphError('Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.');
    } // Adding the node


    var key = data.key,
        _data$attributes = data.attributes,
        attributes = _data$attributes === void 0 ? {} : _data$attributes;
    if (merge) this.mergeNode(key, attributes);else this.addNode(key, attributes);
    return this;
  }
  /**
   * Method used to import a serialized edge.
   *
   * @param  {object}  data  - The serialized edge.
   * @param  {boolean} merge - Whether to merge the given edge.
   * @return {Graph}         - Returns itself for chaining.
   */
  ;

  _proto.importEdge = function importEdge(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // Validating
    var error = validateSerializedEdge(data);

    if (error) {
      if (error === 'not-object') throw new InvalidArgumentsGraphError('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
      if (error === 'no-source') throw new InvalidArgumentsGraphError('Graph.importEdge: missing souce.');
      if (error === 'no-target') throw new InvalidArgumentsGraphError('Graph.importEdge: missing target.');
      if (error === 'invalid-attributes') throw new InvalidArgumentsGraphError('Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.');
      if (error === 'invalid-undirected') throw new InvalidArgumentsGraphError('Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.');
    } // Adding the edge


    var source = data.source,
        target = data.target,
        _data$attributes2 = data.attributes,
        attributes = _data$attributes2 === void 0 ? {} : _data$attributes2,
        _data$undirected = data.undirected,
        undirected = _data$undirected === void 0 ? false : _data$undirected;
    var method;

    if ('key' in data) {
      method = merge ? undirected ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : undirected ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey;
      method.call(this, data.key, source, target, attributes);
    } else {
      method = merge ? undirected ? this.mergeUndirectedEdge : this.mergeDirectedEdge : undirected ? this.addUndirectedEdge : this.addDirectedEdge;
      method.call(this, source, target, attributes);
    }

    return this;
  }
  /**
   * Method used to import a serialized graph.
   *
   * @param  {object|Graph} data  - The serialized graph.
   * @param  {boolean}      merge - Whether to merge data.
   * @return {Graph}              - Returns itself for chaining.
   */
  ;

  _proto["import"] = function _import(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    // Importing a Graph instance
    if (isGraph(data)) {
      this["import"](data["export"](), merge);
      return this;
    } // Importing a serialized graph


    if (!isPlainObject(data)) throw new InvalidArgumentsGraphError('Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.');

    if (data.attributes) {
      if (!isPlainObject(data.attributes)) throw new InvalidArgumentsGraphError('Graph.import: invalid attributes. Expecting a plain object.');
      if (merge) this.mergeAttributes(data.attributes);else this.replaceAttributes(data.attributes);
    }

    var i, l, list;

    if (data.nodes) {
      list = data.nodes;
      if (!Array.isArray(list)) throw new InvalidArgumentsGraphError('Graph.import: invalid nodes. Expecting an array.');

      for (i = 0, l = list.length; i < l; i++) {
        this.importNode(list[i], merge);
      }
    }

    if (data.edges) {
      list = data.edges;
      if (!Array.isArray(list)) throw new InvalidArgumentsGraphError('Graph.import: invalid edges. Expecting an array.');

      for (i = 0, l = list.length; i < l; i++) {
        this.importEdge(list[i], merge);
      }
    }

    return this;
  }
  /**---------------------------------------------------------------------------
   * Utils
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning a null copy of the graph, i.e. a graph without nodes
   * & edges but with the exact same options.
   *
   * @param  {object} options - Options to merge with the current ones.
   * @return {Graph}          - The null copy.
   */
  ;

  _proto.nullCopy = function nullCopy(options) {
    var graph = new Graph(assign({}, this._options, options));
    graph.replaceAttributes(assign({}, this.getAttributes()));
    return graph;
  }
  /**
   * Method returning an empty copy of the graph, i.e. a graph without edges but
   * with the exact same options.
   *
   * @param  {object} options - Options to merge with the current ones.
   * @return {Graph}          - The empty copy.
   */
  ;

  _proto.emptyCopy = function emptyCopy(options) {
    var graph = this.nullCopy(options);

    this._nodes.forEach(function (nodeData, key) {
      var attributes = assign({}, nodeData.attributes); // NOTE: no need to emit events since user cannot access the instance yet

      nodeData = new graph.NodeDataClass(key, attributes);

      graph._nodes.set(key, nodeData);
    });

    return graph;
  }
  /**
   * Method returning an exact copy of the graph.
   *
   * @return {Graph} - The copy.
   */
  ;

  _proto.copy = function copy() {
    var graph = this.emptyCopy();

    var iterator = this._edges.values();

    var step, edgeData;

    while (step = iterator.next(), step.done !== true) {
      edgeData = step.value; // NOTE: no need to emit events since user cannot access the instance yet

      addEdge(graph, 'copy', false, edgeData.undirected, edgeData.key, edgeData.source.key, edgeData.target.key, assign({}, edgeData.attributes));
    }

    return graph;
  }
  /**
   * Method upgrading the graph to a mixed one.
   *
   * @return {Graph} - The copy.
   */
  ;

  _proto.upgradeToMixed = function upgradeToMixed() {
    if (this.type === 'mixed') return this; // Upgrading node data:
    // NOTE: maybe this could lead to some de-optimization by usual
    // JavaScript engines but I cannot be sure of it. Another solution
    // would be to reinstantiate the classes but this surely has a performance
    // and memory impact.

    this._nodes.forEach(function (data) {
      return data.upgradeToMixed();
    }); // Mutating the options & the instance


    this._options.type = 'mixed';
    readOnlyProperty(this, 'type', this._options.type);
    privateProperty(this, 'NodeDataClass', MixedNodeData);
    return this;
  }
  /**
   * Method upgrading the graph to a multi one.
   *
   * @return {Graph} - The copy.
   */
  ;

  _proto.upgradeToMulti = function upgradeToMulti() {
    if (this.multi) return this; // Mutating the options & the instance

    this._options.multi = true;
    readOnlyProperty(this, 'multi', true); // Upgrading indices

    upgradeStructureIndexToMulti(this);
    return this;
  }
  /**---------------------------------------------------------------------------
   * Known methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used by JavaScript to perform JSON serialization.
   *
   * @return {object} - The serialized graph.
   */
  ;

  _proto.toJSON = function toJSON() {
    return this["export"]();
  }
  /**
   * Method returning [object Graph].
   */
  ;

  _proto.toString = function toString() {
    return '[object Graph]';
  }
  /**
   * Method used internally by node's console to display a custom object.
   *
   * @return {object} - Formatted object representation of the graph.
   */
  ;

  _proto.inspect = function inspect() {
    var _this3 = this;

    var nodes = {};

    this._nodes.forEach(function (data, key) {
      nodes[key] = data.attributes;
    });

    var edges = {},
        multiIndex = {};

    this._edges.forEach(function (data, key) {
      var direction = data.undirected ? '--' : '->';
      var label = '';
      var source = data.source.key;
      var target = data.target.key;
      var tmp;

      if (data.undirected && source > target) {
        tmp = source;
        source = target;
        target = tmp;
      }

      var desc = "(".concat(source, ")").concat(direction, "(").concat(target, ")");

      if (!key.startsWith('geid_')) {
        label += "[".concat(key, "]: ");
      } else if (_this3.multi) {
        if (typeof multiIndex[desc] === 'undefined') {
          multiIndex[desc] = 0;
        } else {
          multiIndex[desc]++;
        }

        label += "".concat(multiIndex[desc], ". ");
      }

      label += desc;
      edges[label] = data.attributes;
    });

    var dummy = {};

    for (var k in this) {
      if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k) && typeof this[k] !== 'function' && _typeof(k) !== 'symbol') dummy[k] = this[k];
    }

    dummy.attributes = this._attributes;
    dummy.nodes = nodes;
    dummy.edges = edges;
    privateProperty(dummy, 'constructor', this.constructor);
    return dummy;
  };

  return Graph;
}(events.EventEmitter);
if (typeof Symbol !== 'undefined') Graph.prototype[Symbol["for"]('nodejs.util.inspect.custom')] = Graph.prototype.inspect;
/**
 * Related to edge addition.
 */

EDGE_ADD_METHODS.forEach(function (method) {
  ['add', 'merge', 'update'].forEach(function (verb) {
    var name = method.name(verb);
    var fn = verb === 'add' ? addEdge : mergeEdge;

    if (method.generateKey) {
      Graph.prototype[name] = function (source, target, attributes) {
        return fn(this, name, true, (method.type || this.type) === 'undirected', null, source, target, attributes, verb === 'update');
      };
    } else {
      Graph.prototype[name] = function (edge, source, target, attributes) {
        return fn(this, name, false, (method.type || this.type) === 'undirected', edge, source, target, attributes, verb === 'update');
      };
    }
  });
});
/**
 * Attributes-related.
 */

attachNodeAttributesMethods(Graph);
attachEdgeAttributesMethods(Graph);
/**
 * Edge iteration-related.
 */

attachEdgeIterationMethods(Graph);
/**
 * Neighbor iteration-related.
 */

attachNeighborIterationMethods(Graph);

/**
 * Alternative constructors.
 */

var DirectedGraph = /*#__PURE__*/function (_Graph) {
  _inheritsLoose(DirectedGraph, _Graph);

  function DirectedGraph(options) {
    var finalOptions = assign({
      type: 'directed'
    }, options);
    if ('multi' in finalOptions && finalOptions.multi !== false) throw new InvalidArgumentsGraphError('DirectedGraph.from: inconsistent indication that the graph should be multi in given options!');
    if (finalOptions.type !== 'directed') throw new InvalidArgumentsGraphError('DirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
    return _Graph.call(this, finalOptions) || this;
  }

  return DirectedGraph;
}(Graph);

var UndirectedGraph = /*#__PURE__*/function (_Graph2) {
  _inheritsLoose(UndirectedGraph, _Graph2);

  function UndirectedGraph(options) {
    var finalOptions = assign({
      type: 'undirected'
    }, options);
    if ('multi' in finalOptions && finalOptions.multi !== false) throw new InvalidArgumentsGraphError('UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!');
    if (finalOptions.type !== 'undirected') throw new InvalidArgumentsGraphError('UndirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
    return _Graph2.call(this, finalOptions) || this;
  }

  return UndirectedGraph;
}(Graph);

var MultiGraph = /*#__PURE__*/function (_Graph3) {
  _inheritsLoose(MultiGraph, _Graph3);

  function MultiGraph(options) {
    var finalOptions = assign({
      multi: true
    }, options);
    if ('multi' in finalOptions && finalOptions.multi !== true) throw new InvalidArgumentsGraphError('MultiGraph.from: inconsistent indication that the graph should be simple in given options!');
    return _Graph3.call(this, finalOptions) || this;
  }

  return MultiGraph;
}(Graph);

var MultiDirectedGraph = /*#__PURE__*/function (_Graph4) {
  _inheritsLoose(MultiDirectedGraph, _Graph4);

  function MultiDirectedGraph(options) {
    var finalOptions = assign({
      type: 'directed',
      multi: true
    }, options);
    if ('multi' in finalOptions && finalOptions.multi !== true) throw new InvalidArgumentsGraphError('MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!');
    if (finalOptions.type !== 'directed') throw new InvalidArgumentsGraphError('MultiDirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
    return _Graph4.call(this, finalOptions) || this;
  }

  return MultiDirectedGraph;
}(Graph);

var MultiUndirectedGraph = /*#__PURE__*/function (_Graph5) {
  _inheritsLoose(MultiUndirectedGraph, _Graph5);

  function MultiUndirectedGraph(options) {
    var finalOptions = assign({
      type: 'undirected',
      multi: true
    }, options);
    if ('multi' in finalOptions && finalOptions.multi !== true) throw new InvalidArgumentsGraphError('MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!');
    if (finalOptions.type !== 'undirected') throw new InvalidArgumentsGraphError('MultiUndirectedGraph.from: inconsistent "' + finalOptions.type + '" type in given options!');
    return _Graph5.call(this, finalOptions) || this;
  }

  return MultiUndirectedGraph;
}(Graph);
/**
 * Attaching static #.from method to each of the constructors.
 */


function attachStaticFromMethod(Class) {
  /**
   * Builds a graph from serialized data or another graph's data.
   *
   * @param  {Graph|SerializedGraph} data      - Hydratation data.
   * @param  {object}                [options] - Options.
   * @return {Class}
   */
  Class.from = function (data, options) {
    // Merging given options with serialized ones
    var finalOptions = assign({}, data.options, options);
    var instance = new Class(finalOptions);
    instance["import"](data);
    return instance;
  };
}

attachStaticFromMethod(Graph);
attachStaticFromMethod(DirectedGraph);
attachStaticFromMethod(UndirectedGraph);
attachStaticFromMethod(MultiGraph);
attachStaticFromMethod(MultiDirectedGraph);
attachStaticFromMethod(MultiUndirectedGraph);
Graph.Graph = Graph;
Graph.DirectedGraph = DirectedGraph;
Graph.UndirectedGraph = UndirectedGraph;
Graph.MultiGraph = MultiGraph;
Graph.MultiDirectedGraph = MultiDirectedGraph;
Graph.MultiUndirectedGraph = MultiUndirectedGraph;
Graph.InvalidArgumentsGraphError = InvalidArgumentsGraphError;
Graph.NotFoundGraphError = NotFoundGraphError;
Graph.UsageGraphError = UsageGraphError;

/**
 * Graphology CommonJS Endoint
 * ============================
 *
 * Endpoint for CommonJS modules consumers.
 */

module.exports = Graph;
//# sourceMappingURL=graphology.cjs.js.map