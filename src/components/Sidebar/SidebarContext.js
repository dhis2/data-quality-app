import React, { useContext } from 'react'

const SidebarContext = React.createContext()

export const useSidebar = () => useContext(SidebarContext)
export const SidebarProvider = SidebarContext.Provider
