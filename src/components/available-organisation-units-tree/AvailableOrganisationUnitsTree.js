import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component'
import i18n from '@dhis2/d2-i18n'
import styles from './AvailableOrganisationUnitsTree.module.css'

class AvailableOrganisationUnitsTree extends PureComponent {
    static contextTypes = {
        d2: PropTypes.object,
    }

    static propTypes = {
        onChange: PropTypes.func,
        multiselect: PropTypes.bool,
    }

    static defaultProps = {
        onChange: null,
        multiselect: false,
    }

    constructor() {
        super()

        this.state = {
            selected: [],
            rootsWithMembers: null,
        }

        this.getOrgUnitIdFromPath = this.getOrgUnitIdFromPath.bind(this)
        this.handleOrgUnitClickSingle = this.handleOrgUnitClickSingle.bind(this)
        this.handleOrgUnitClickMulti = this.handleOrgUnitClickMulti.bind(this)
        this.loadAvailableOrgUnits = this.loadAvailableOrgUnits.bind(this)
    }

    componentDidMount() {
        if (this.state.rootsWithMembers === null) {
            this.loadAvailableOrgUnits()
                .then(organisationUnitsResponse => {
                    const organisationUnits = organisationUnitsResponse.toArray()
                    this.setState({
                        rootsWithMembers: organisationUnits,
                    })
                })
                .catch(() => {
                    this.manageError()
                })
        }
    }

    async loadAvailableOrgUnits() {
        const d2 = this.context.d2

        const orgUnits = await d2.currentUser.getOrganisationUnits({
            fields: 'id,displayName,path,children::isNotEmpty,memberCount',
            paging: false,
        })

        if (!orgUnits.size && d2.currentUser.authorities.has('ALL')) {
            // if special all-authority we have access to all orgunits
            return d2.models.organisationUnits.list({
                paging: false,
                level: 1,
                fields: 'id,displayName,path,children::isNotEmpty,memberCount',
            })
        }

        return orgUnits
    }

    getOrgUnitIdFromPath(path) {
        return path.split('/').pop()
    }

    handleOrgUnitClickSingle(event, orgUnit) {
        if (this.state.selected.includes(orgUnit.path)) {
            return
        }
        const id = this.getOrgUnitIdFromPath(orgUnit.path)
        this.setState({ selected: [orgUnit.path] })
        this.props.onChange && this.props.onChange(id)
    }

    handleOrgUnitClickMulti(event, orgUnit) {
        const { selected } = this.state
        const { path } = orgUnit
        const paths = selected.includes(path)
            ? selected.filter(selectedPath => selectedPath !== path)
            : [...this.state.selected, orgUnit.path]

        this.setState({ selected: paths })
        this.props.onChange &&
            this.props.onChange(paths.map(this.getOrgUnitIdFromPath))
    }

    render() {
        if (!this.state.rootsWithMembers) {
            return <span>{i18n.t('Updating Organisation Units Tree...')}</span>
        }

        if (this.state.rootsWithMembers.length < 1) {
            return (
                <p>
                    {i18n.t(
                        'You do not have access to any organisation units.'
                    )}
                </p>
            )
        }

        const onSelectClick = this.props.multiselect
            ? this.handleOrgUnitClickMulti
            : this.handleOrgUnitClickSingle

        return (
            <div className={styles.tree}>
                {this.state.rootsWithMembers.map(rootOrgUnit => (
                    <OrgUnitTree
                        key={rootOrgUnit.id}
                        hideMemberCount={Boolean(true)}
                        root={rootOrgUnit}
                        selected={this.state.selected}
                        initiallyExpanded={[`/${rootOrgUnit.id}`]}
                        onSelectClick={onSelectClick}
                    />
                ))}
            </div>
        )
    }
}

export default AvailableOrganisationUnitsTree
