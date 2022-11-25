import React, { useEffect, useState } from "react";

const getDimensions =() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height
    };
}

const useWindowDimensions = () => {
    const [dimensions, setDimensions] = useState(getDimensions());

    useEffect(() => {
        const handleResize = () => {
            setDimensions(getDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return dimensions;
};

export default useWindowDimensions;