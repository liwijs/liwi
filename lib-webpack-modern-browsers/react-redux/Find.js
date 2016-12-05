import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

export default class FindComponent extends Component {

  componentDidMount() {
    var _this = this;

    var { query, action, dispatch } = this.props;
    this._find = query.fetch(function (result) {
      if (!_this._find) return;
      dispatch(action(result));
      delete _this._find;
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