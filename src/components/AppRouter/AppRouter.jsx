import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Overview from '../../pages/Overview/Overview.jsx'
import { sections } from '../../pages/sections.conf.js'
import NoMatch from './NoMatch.jsx'

const AppRouter = () => {
    const routes = sections.map((section) => {
        const routeRender = () => {
            const Page = section.component
            return <Page sectionKey={section.key} />
        }
        return (
            <Route
                key={section.key}
                exact
                path={section.path}
                render={routeRender}
            />
        )
    })

    routes.push(<Route key="overview" exact path="/" component={Overview} />)

    /* No Match Route */
    routes.push(<Route key="no-match-route" component={NoMatch} />)

    return (
        <main>
            <Switch>{routes}</Switch>
        </main>
    )
}

export default AppRouter
