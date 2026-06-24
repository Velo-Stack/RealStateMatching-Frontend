import { AnimatePresence, motion as Motion } from 'framer-motion';

const JoinUsStepTransition = ({ step, children }) => (
  <AnimatePresence mode="wait">
    <Motion.div
      key={step}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Motion.div>
  </AnimatePresence>
);

export default JoinUsStepTransition;
