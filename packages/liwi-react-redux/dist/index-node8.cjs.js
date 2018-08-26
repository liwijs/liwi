'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

class FindComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: undefined
    };
    this._find = void 0;
  }

  componentDidMount() {
    const {
      query
    } = this.props;
    this._find = query.fetch(result => {
      if (!this._find) return;
      this.setState({
        fetched: true,
        result
      });
      delete this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render() {
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
    }

    return React__default.createElement(this.props.component, {
      [this.props.name]: this.state.result
    });
  }

}

// export { default as FindAndSubscribe } from './FindAndSubscribe';

exports.Find = FindComponent;
//# sourceMappingURL=index-node8.cjs.js.map
