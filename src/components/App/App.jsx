import classnames from 'classnames'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import AppRouter from '../AppRouter/AppRouter.jsx'
import Sidebar from '../Sidebar/Sidebar.jsx'
import { SidebarProvider } from '../Sidebar/SidebarContext.js'
import styles from './App.module.css'
import useSidebar from './use-sidebar.js'

const App = () => {
    const sidebar = useSidebar()
    const history = useHistory()

    useEffect(() => {
        // Restore sidebar when user visits different page (which could be
        // triggered by back button)
        history.listen(() => {
            sidebar.show()
        })
    }, [])

    const containerClassName = classnames(styles.container, {
        [styles.containerWithSidebar]: sidebar.visible,
    })

    return (
        <div className={containerClassName}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.content}>
                <div className={styles.contentWrapper}>
                    <SidebarProvider value={sidebar}>
                        <AppRouter />
                    </SidebarProvider>
                </div>
            </div>
        </div>
    )
}

export default App
