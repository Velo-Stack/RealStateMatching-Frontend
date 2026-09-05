import { motion } from "framer-motion";

const DashboardHeader = ({ title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="mb-5"
  >
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {title ? (
        <h1
          className="text-xl lg:text-2xl font-bold m-0 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
      ) : null}
      {title && subtitle ? (
        <span
          className="text-base lg:text-lg m-0 leading-none"
          style={{ color: "var(--text-dim)" }}
          aria-hidden
        >
          ·
        </span>
      ) : null}
      {subtitle ? (
        <p
          className="text-sm lg:text-base m-0 leading-tight"
          style={{ color: "var(--text-dim)" }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
    {children}
  </motion.div>
);

export default DashboardHeader;
