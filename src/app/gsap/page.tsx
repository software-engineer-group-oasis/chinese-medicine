'use client' // 必须声明为客户端组件

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText) // 注册插件
gsap.registerPlugin(ScrollTrigger)

export default function TextAnimation() {
    const textRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // 简单的文本动画
            // gsap.from(textRef.current, {
            //     duration: 1,
            //     opacity: 0,
            //     y: 50,
            //     ease: "power2.out"
            // })

            const split = new SplitText(textRef.current, {
                type: "chars, words, lines"
            })

            gsap.from(split.chars, {
                duration: 0.8,
                opacity: 0,
                y: 20,
                stagger: 0.05,
                ease: "back.out(1.7)"
            })
        }, textRef)

        return () => ctx.revert() // 清理动画
    }, [])

    const sectionRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(sectionRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                duration: 1
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        // <h1 ref={textRef}>
        //     <p>hello world</p>
        //     <code>hello world</code>
        //
        // </h1>

        <section ref={sectionRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <h1>滚动触发动画的文本</h1>
        </section>
    )
}