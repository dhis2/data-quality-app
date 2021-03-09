import i18n from '@dhis2/d2-i18n'
import { MultiSelect, MultiSelectOption, Help, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

class AvailableDatasetsSelect extends PureComponent {
    static contextTypes = {
        d2: PropTypes.object,
    }

    static propTypes = {
        selected: PropTypes.array,
        onChange: PropTypes.func,
    }

    constructor() {
        super()

        this.state = {
            dataSets: null,
            error: false,
        }
    }

    loadDatasets() {
        const d2 = this.context.d2
        return d2.models.dataSet.list({
            paging: false,
            fields: 'id,displayName',
        })
    }

    componentDidMount() {
        this.loadDatasets()
            .then(dataSetsResponse => {
                this.setState({
                    dataSets: dataSetsResponse.toArray(),
                })
            })
            .catch(() => {
                this.setState({ error: true })
            })
    }

    render() {
        if (this.state.error) {
            return <Help error>{i18n.t('Error loading datasets.')}</Help>
        }

        if (!this.state.dataSets) {
            return <CircularLoader />
        }

        return (
            <MultiSelect
                filterable
                noMatchText={i18n.t('No match found')}
                onChange={this.props.onChange}
                selected={this.props.selected}
            >
                {this.state.dataSets.map(item => (
                    <MultiSelectOption
                        key={item.id}
                        value={item.id}
                        label={item.displayName}
                    />
                ))}
            </MultiSelect>
        )
    }
}

export default AvailableDatasetsSelect
