import PropTypes from 'prop-types'
import { Component } from 'react'

// TODO: Delete file

class Page extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
        currentSection: PropTypes.string,
        updateAppState: PropTypes.func,
    }

    UNSAFE_componentWillMount() {
        this.pageMounted = true

        // update section on side bar
        if (this.context.currentSection !== this.props.sectionKey) {
            this.context.updateAppState({
                currentSection: this.props.sectionKey,
            })
        }
    }

    componentWillUnmount() {
        this.pageMounted = false
    }

    isPageMounted() {
        return this.pageMounted
    }

    manageError(error) {
        console.error(error)
    }
}

export default Page
