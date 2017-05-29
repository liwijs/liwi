var _class, _temp;

import { Component } from 'react';
import PropTypes from 'prop-types';
let FindComponent = (_temp = _class = class extends Component {

  componentDidMount() {
    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._find = query.fetch(result => {
      if (!this._find) return;
      dispatch(action(result));
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
    return this.props.children;
  }
}, _class.contextTypes = {
  store: PropTypes.any
}, _temp);
export { FindComponent as default };
//# sourceMappingURL=Find.js.map