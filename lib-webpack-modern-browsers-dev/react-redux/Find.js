import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

export default class FindComponent extends Component {

  componentDidMount() {
    var _props = this.props;
    var query = _props.query;
    var action = _props.action;
    var dispatch = _props.dispatch;

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
}
FindComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(AbstractQuery).isRequired,
  children: PropTypes.node
};
//# sourceMappingURL=Find.js.map