import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger)

export const animateWithGsapTimeline = (tl, rotationRef, rotationState, firstTarget, secondTarget, animationProps) => {
    tl.to(rotationRef.current.rotation, {
        y: rotationState,
        duration: 1,
        ease: "power2.inOut"
    })

    tl.to(firstTarget, {
        ...animationProps,
        ease: "power2.inOut"
    }, '<')

    tl.to(secondTarget, {
        ...animationProps,
        ease: "power2.inOut"
    }, '<')
}

export const animateWithGsap = (target, animationProps, scrollProps) => {
    return gsap.to(target, {
        ...animationProps,
        scrollTrigger: {
            trigger: target,
            toggleActions: "play none none none",
            ...scrollProps
        }
    })
}