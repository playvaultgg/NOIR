import gsap from "gsap";

export const executeHeroReveal = (heroRef, textRef, ctaRef) => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.set([textRef.current, ctaRef.current], { opacity: 0, y: 50 });

    tl.to(heroRef.current, {
        scale: 1, // Reset from a slight zoom (Ken burns effect handled by css)
        duration: 2,
        ease: "power2.out",
    })
        .to(
            textRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
            },
            "-=1.2"
        )
        .to(
            ctaRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
            },
            "-=1"
        );

    return tl;
};
