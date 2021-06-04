import classnames from 'classnames'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import AppRouter from '../AppRouter/AppRouter'
import Sidebar from '../Sidebar/Sidebar'
import { SidebarProvider } from '../Sidebar/SidebarContext'
import styles from './App.module.css'

const useSidebar = () => {
    const [visible, setVisible] = useState(true)
    return {
        visible,
        show: () => {
            setVisible(true)
        },
        hide: () => {
            setVisible(false)
        },
    }
}

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

    return (
        <div
            className={classnames(styles.container, {
                [styles.containerWithSidebar]: sidebar.visible,
            })}
        >
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
