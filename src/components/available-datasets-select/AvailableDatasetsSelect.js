import i18n from '@dhis2/d2-i18n'
import { MultiSelect, MultiSelectOption } from '@dhis2/ui'
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
        }
    }

    componentDidMount() {
        const d2 = this.context.d2
        if (this.state.dataSets == null) {
            d2.models.dataSet
                .list({
                    paging: false,
                    fields: 'id,displayName',
                })
                .then(dataSetsResponse => {
                    this.setState({
                        dataSets: dataSetsResponse.toArray(),
                    })
                })
                .catch(() => {
                    // TODO: Show critical alert
                })
        }
    }

    render() {
        return (
            <MultiSelect
                filterable
                noMatchText={i18n.t('No match found')}
                onChange={this.props.onChange}
                selected={this.props.selected}
            >
                {(this.state.dataSets || []).map(item => (
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
