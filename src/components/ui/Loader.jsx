import React from 'react';
import Lottie from 'lottie-react';
import plantLoader from '../../assets/Animated plant loader..json';

const Loader = ({ className = "min-h-[calc(100vh-10rem)]" }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className} w-full`}>
            <div className="w-24 h-24 md:w-32 md:h-32">
                <Lottie
                    animationData={plantLoader}
                    loop={true}
                    autoplay={true}
                />
            </div>
        </div>
    );
};

export default Loader;
