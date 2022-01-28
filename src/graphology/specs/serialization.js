"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = serialization;

var _assert = _interopRequireDefault(require("assert"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Graphology Serializaton Specs
 * ==============================
 *
 * Testing the serialization methods of the graph.
 */
function serialization(Graph, checkers) {
  var invalid = checkers.invalid,
      notFound = checkers.notFound;
  return {
    '#.exportNode': {
      'it should throw if the node does not exist.': function itShouldThrowIfTheNodeDoesNotExist() {
        var graph = new Graph();

        _assert["default"]["throws"](function () {
          graph.exportNode('Test');
        }, notFound());
      },
      'it should properly serialize nodes.': function itShouldProperlySerializeNodes() {
        var graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack', {
          age: 34
        });

        _assert["default"].deepStrictEqual(graph.exportNode('John'), {
          key: 'John'
        });

        _assert["default"].deepStrictEqual(graph.exportNode('Jack'), {
          key: 'Jack',
          attributes: {
            age: 34
          }
        });
      }
    },
    '#.exportEdge': {
      'it should throw if the edge does not exist.': function itShouldThrowIfTheEdgeDoesNotExist() {
        var graph = new Graph();

        _assert["default"]["throws"](function () {
          graph.exportEdge('Test');
        }, notFound());
      },
      'it should properly serialize edges.': function itShouldProperlySerializeEdges() {
        var graph = new Graph({
          multi: true
        });
        (0, _helpers.addNodesFrom)(graph, ['John', 'Martha']);
        graph.addEdgeWithKey('J->M•1', 'John', 'Martha');
        graph.addEdgeWithKey('J->M•2', 'John', 'Martha', {
          weight: 1
        });
        graph.addUndirectedEdgeWithKey('J<->M•1', 'John', 'Martha');
        graph.addUndirectedEdgeWithKey('J<->M•2', 'John', 'Martha', {
          weight: 2
        });

        _assert["default"].deepStrictEqual(graph.exportEdge('J->M•1'), {
          key: 'J->M•1',
          source: 'John',
          target: 'Martha'
        });

        _assert["default"].deepStrictEqual(graph.exportEdge('J->M•2'), {
          key: 'J->M•2',
          source: 'John',
          target: 'Martha',
          attributes: {
            weight: 1
          }
        });

        _assert["default"].deepStrictEqual(graph.exportEdge('J<->M•1'), {
          key: 'J<->M•1',
          source: 'John',
          target: 'Martha',
          undirected: true
        });

        _assert["default"].deepStrictEqual(graph.exportEdge('J<->M•2'), {
          key: 'J<->M•2',
          source: 'John',
          target: 'Martha',
          attributes: {
            weight: 2
          },
          undirected: true
        });
      }
    },
    '#.export': {
      'it should correctly return the serialized graph.': function itShouldCorrectlyReturnTheSerializedGraph() {
        var graph = new Graph({
          multi: true
        });
        graph.setAttribute('name', 'graph');
        (0, _helpers.addNodesFrom)(graph, ['John', 'Jack', 'Martha']);
        graph.setNodeAttribute('John', 'age', 34);
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {
          weight: 2
        });
        graph.addEdgeWithKey('J->J•3', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•1', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•2', 'John', 'Jack', {
          weight: 3
        });

        _assert["default"].deepStrictEqual(graph["export"](), {
          attributes: {
            name: 'graph'
          },
          nodes: [{
            key: 'John',
            attributes: {
              age: 34
            }
          }, {
            key: 'Jack'
          }, {
            key: 'Martha'
          }],
          edges: [{
            key: 'J->J•1',
            source: 'John',
            target: 'Jack'
          }, {
            key: 'J->J•2',
            source: 'John',
            target: 'Jack',
            attributes: {
              weight: 2
            }
          }, {
            key: 'J->J•3',
            source: 'John',
            target: 'Jack'
          }, {
            key: 'J<->J•1',
            source: 'John',
            target: 'Jack',
            undirected: true
          }, {
            key: 'J<->J•2',
            source: 'John',
            target: 'Jack',
            attributes: {
              weight: 3
            },
            undirected: true
          }],
          options: {
            allowSelfLoops: true,
            multi: true,
            type: 'mixed'
          }
        });
      }
    },
    '#.importNode': {
      'it should throw if the given serialized node is invalid.': function itShouldThrowIfTheGivenSerializedNodeIsInvalid() {
        var graph = new Graph();

        _assert["default"]["throws"](function () {
          graph.importNode(false);
        }, invalid());

        _assert["default"]["throws"](function () {
          graph.importNode({
            hello: 'world'
          });
        }, invalid());

        _assert["default"]["throws"](function () {
          graph.importNode({
            key: 'test',
            attributes: false
          });
        }, invalid());
      },
      'it should correctly import the given node.': function itShouldCorrectlyImportTheGivenNode() {
        var graph = new Graph();
        graph.importNode({
          key: 'John'
        });
        graph.importNode({
          key: 'Jack',
          attributes: {
            age: 34
          }
        });

        _assert["default"].deepStrictEqual(graph.nodes(), ['John', 'Jack']);

        _assert["default"].deepStrictEqual(graph.getNodeAttributes('Jack'), {
          age: 34
        });
      },
      'it should merge if the flag is true.': function itShouldMergeIfTheFlagIsTrue() {
        var graph = new Graph();
        graph.addNode('John');
        graph.importNode({
          key: 'John',
          attributes: {
            age: 34
          }
        }, true);

        _assert["default"].deepStrictEqual(graph.nodes(), ['John']);

        _assert["default"].strictEqual(graph.getNodeAttribute('John', 'age'), 34);
      }
    },
    '#.importEdge': {
      'it should throw if the given serialized node is invalid.': function itShouldThrowIfTheGivenSerializedNodeIsInvalid() {
        var graph = new Graph();

        _assert["default"]["throws"](function () {
          graph.importEdge(false);
        }, invalid());

        _assert["default"]["throws"](function () {
          graph.importEdge({
            hello: 'world'
          });
        }, invalid());

        _assert["default"]["throws"](function () {
          graph.importEdge({
            source: 'John',
            hello: 'world'
          });
        }, invalid());

        _assert["default"]["throws"](function () {
          graph.importEdge({
            source: 'John',
            target: 'Thomas',
            attributes: false
          });
        }, invalid());

        _assert["default"]["throws"](function () {
          graph.importEdge({
            source: 'John',
            target: 'Thomas',
            undirected: 'test'
          });
        }, invalid());
      },
      'it should correctly import the given edge.': function itShouldCorrectlyImportTheGivenEdge() {
        var graph = new Graph({
          multi: true
        });
        (0, _helpers.addNodesFrom)(graph, ['John', 'Thomas']);
        graph.importEdge({
          source: 'John',
          target: 'Thomas'
        });
        graph.importEdge({
          key: 'J<->T',
          source: 'John',
          target: 'Thomas',
          attributes: {
            weight: 2
          },
          undirected: true
        });

        _assert["default"].strictEqual(graph.size, 2);

        _assert["default"].deepStrictEqual(graph.getEdgeAttributes('J<->T'), {
          weight: 2
        });
      },
      'it should merge if the flag is true.': function itShouldMergeIfTheFlagIsTrue() {
        var graph = new Graph();
        (0, _helpers.addNodesFrom)(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');
        graph.importEdge({
          source: 'John',
          target: 'Thomas',
          attributes: {
            weight: 10
          }
        }, true);

        _assert["default"].strictEqual(graph.size, 1);

        _assert["default"].strictEqual(graph.getEdgeAttribute('John', 'Thomas', 'weight'), 10);
      }
    },
    '#.import': {
      'it should throw if the given data is invalid.': function itShouldThrowIfTheGivenDataIsInvalid() {
        var graph = new Graph();

        _assert["default"]["throws"](function () {
          graph["import"](true);
        }, invalid());
      },
      'it should be possible to import a graph instance.': function itShouldBePossibleToImportAGraphInstance() {
        var graph = new Graph();
        (0, _helpers.addNodesFrom)(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');
        var other = new Graph();
        other["import"](graph);

        _assert["default"].deepStrictEqual(graph.nodes(), other.nodes());

        _assert["default"].deepStrictEqual(graph.edges(), other.edges());
      },
      'it should be possible to import a serialized graph.': function itShouldBePossibleToImportASerializedGraph() {
        var graph = new Graph();
        graph["import"]({
          nodes: [{
            key: 'John'
          }, {
            key: 'Thomas'
          }],
          edges: [{
            source: 'John',
            target: 'Thomas'
          }]
        });

        _assert["default"].deepStrictEqual(graph.nodes(), ['John', 'Thomas']);

        _assert["default"].strictEqual(graph.hasEdge('John', 'Thomas'), true);
      },
      'it should be possible to import only edges when merging.': function itShouldBePossibleToImportOnlyEdgesWhenMerging() {
        var graph = new Graph();
        graph["import"]({
          edges: [{
            source: 'John',
            target: 'Thomas'
          }]
        }, true);

        _assert["default"].deepStrictEqual(graph.nodes(), ['John', 'Thomas']);

        _assert["default"].strictEqual(graph.size, 1);

        _assert["default"].strictEqual(graph.hasEdge('John', 'Thomas'), true);
      },
      'it should be possible to import attributes.': function itShouldBePossibleToImportAttributes() {
        var graph = new Graph();
        graph["import"]({
          attributes: {
            name: 'graph'
          }
        });

        _assert["default"].deepStrictEqual(graph.getAttributes(), {
          name: 'graph'
        });
      },
      'it should throw if nodes are absent, edges are present and we merge.': function itShouldThrowIfNodesAreAbsentEdgesArePresentAndWeMerge() {
        var graph = new Graph();

        _assert["default"]["throws"](function () {
          graph["import"]({
            edges: [{
              source: '1',
              target: '2'
            }]
          });
        }, notFound());
      }
    }
  };
}