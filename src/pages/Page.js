import { Component } from 'react';
import PropTypes from 'prop-types';

import { ERROR } from '../helpers/feedbackSnackBarTypes';

/* i18n */
import i18n from '../locales';
import { i18nKeys } from '../i18n';

class Page extends Component {
  static propTypes = {
      updateFeedbackState: PropTypes.func.isRequired,
  };

  static contextTypes = {
      d2: PropTypes.object,
  };

  componentDidMount() {
      this.pageMounted = true;
  }

  componentWillUnmount() {
      this.pageMounted = false;
      this.props.updateFeedbackState(false);
  }

  isPageMounted() {
      return this.pageMounted;
  }

  manageError(error) {
      if (this.isPageMounted()) {
          const messageError = error && error.message ?
              error.message :
              i18n.t(i18nKeys.messages.unexpectedAnalysisError);

          this.props.updateFeedbackState(true, {
              type: ERROR,
              message: messageError,
          });
      }
  }
}

export default Page;

