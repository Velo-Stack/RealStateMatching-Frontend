import { useEffect, useRef, useState } from "react";
import { stats } from "../data/statsData";

const CounterItem = ({ end, label, suffix }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;

                    let start = 0;
                    const duration = 1800;
                    const increment = end / (duration / 16);

                    const counter = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(counter);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.4 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);

    return (
        <div ref={ref} className="text-center group">
            <div className="flex items-end justify-center gap-1">
                <h3 className="text-5xl md:text-6xl font-bold text-[#9d7857] leading-none">
                    {count.toLocaleString()}
                </h3>
                {suffix && (
                    <span className="text-2xl font-bold text-[#9d7857] mb-1">{suffix}</span>
                )}
            </div>

            <div className="mx-auto mt-3 mb-3 h-[2px] w-8 bg-[#9d7857] rounded-full transition-all duration-500 group-hover:w-14" />

            <p className="text-gray-500 text-sm md:text-base tracking-wide">
                {label}
            </p>
        </div>
    );
};

const StatsSection = () => {
    return (
        <section className="bg-[#f8f9fa] pt-2 pb-16 font-cairo">
            <div className="mx-6 md:mx-16 mb-10 h-px bg-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-16">
                {stats.map((s, i) => (
                    <CounterItem key={i} end={s.end} label={s.label} suffix={s.suffix} />
                ))}
            </div>
        </section>
    );
};

export default StatsSection;