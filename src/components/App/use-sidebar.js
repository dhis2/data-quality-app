import { useState } from 'react'

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

export default useSidebar
