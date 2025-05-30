import './ConfrimWindow.css'
import { motion } from 'framer-motion';
type Props = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};


export function ConfirmWindow({message, onConfirm, onCancel}: Props){
    
    return (   
        <div className='confirmation-body'>
            <motion.div className="confirmation-container" 
            animate={{
                y: [-300, 0, -10, 0]
            }}
            transition={{
                duration: 0.6,
                times: [0, 0.7, 0.85, 1],
                ease: 'easeInOut'
            }}
            >
                <h4 className="confirmation-text">
                    Do you really want to logout and leave? :(
                </h4>
                <div className="confirmation-button-container">
                <button className="confirmation-button" onClick={onConfirm}>
                    Yes
                </button>
                <button className="confirmation-button cancel" onClick={onCancel}>
                    Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    )
}