export const transitions = {
    liquid: {
        type: "spring",
        stiffness: 400,
        damping: 30
    },
    smooth: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
    }
};

export const variants = {
    liquidEntrance: {
        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: transitions.smooth
        }
    },
    liquidHover: {
        rest: { scale: 1, y: 0 },
        hover: {
            scale: 1.02,
            y: -2,
            transition: transitions.liquid
        },
        tap: { scale: 0.98 }
    },
    listItem: {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    }
};
