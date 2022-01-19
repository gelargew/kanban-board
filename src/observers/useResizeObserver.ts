
import React, { useEffect, useState, useMemo } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

//DOMrect state that updates whenever size changes
const useResizeObserver = (ref:React.RefObject<HTMLElement>) => {
    const [properties, setProps] = useState({} as DOMRectReadOnly)
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            setProps(entry.contentRect)
        })      
    })
    useEffect(() => {
        const element = ref.current!
        resizeObserver.observe(element)     
        return () => resizeObserver.unobserve(element)
    }, [])

    return properties
}

// extend resize observer with boundingClient state
const useBoundingClientObserver = (ref:React.RefObject<HTMLElement>) => {
    const sizeProps = useResizeObserver(ref)
    const boundingClient = useMemo(() => ref.current?.getBoundingClientRect(), [sizeProps])

    return {sizeProps, boundingClient}
}


export {useResizeObserver, useBoundingClientObserver}