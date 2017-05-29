var _class, _temp;

import { Component } from 'react';
import PropTypes from 'prop-types';
let FindAndSubscribeComponent = (_temp = _class = class extends Component {

  componentDidMount() {
    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      dispatch(action(result, true));
    });
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render() {
    return this.props.children;
  }
}, _class.contextTypes = {
  store: PropTypes.any
}, _temp);
export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map