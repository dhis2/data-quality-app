import { Component } from 'react';
import PropTypes from 'prop-types';

import { ERROR } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

/* i18n */
import i18n from '../locales';
import { i18nKeys } from '../i18n';

class Page extends Component {
  static propTypes = {
      sectionKey: PropTypes.string.isRequired,
  }

  static contextTypes = {
      d2: PropTypes.object,
      currentSection: PropTypes.string,
      updateAppState: PropTypes.func,
  }

  componentWillMount() {
      this.pageMounted = true;

      // update section on side bar
      if (this.context.currentSection !== this.props.sectionKey) {
          this.context.updateAppState({
              currentSection: this.props.sectionKey,
          });
      }
  }

  componentWillUnmount() {
      this.pageMounted = false;
  }

  isPageMounted() {
      return this.pageMounted;
  }

  manageError(error) {
      if (this.isPageMounted()) {
          const messageError = error && error.message ?
              error.message :
              i18n.t(i18nKeys.messages.unexpectedAnalysisError);

          this.context.updateAppState({
              showSnackbar: true,
              snackbarConf: {
                  type: ERROR,
                  message: messageError,
              },
              pageState: {
                  loading: false,
              },
          });
      }
  }
}

export default Page;

