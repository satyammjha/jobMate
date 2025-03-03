import { cn } from "../../lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName
}) => {
  const { user } = useUser();
  const location = useLocation();

  const filteredItems = items.filter(item => 
    (!item.protected || user) && 
    (item.title !== "Refer & Earn" || user)
  );

  const itemsWithState = filteredItems.map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  return (<>
    <FloatingDockMobile items={itemsWithState} className={mobileClassName} />
  </>);
};


const FloatingDockMobile = ({
  items,
  className
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}>
                <Link
                  to={item.href}
                  className={cn(
                    "h-10 w-10 rounded-md flex items-center justify-center",
                    "transition-colors duration-200",
                    item.active 
                      ? "bg-primary text-white" 
                      : "bg-background text-foreground/80 hover:bg-accent",
                    "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300"
                  )}>
                  <div className="h-4 w-4 relative">
                    {item.icon}
                    {item.active && (
                      <motion.span 
                        className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-10 w-10 rounded-md flex items-center justify-center",
          "transition-colors duration-200 shadow-sm",
          "bg-black dark:bg-white",
          "text-white dark:text-neutral-800",
          "hover:bg-neutral-800 dark:hover:bg-neutral-200"
        )}>
        <IconLayoutNavbarCollapse className="h-5 w-5" />
      </button>
    </div>
  );
};


function IconContainer({
  mouseX,
  title,
  icon,
  href,
  active
}) {
  let ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]), 
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  let height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]), 
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  let iconSize = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]), 
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  return (
    <Link to={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center relative",
          "bg-background border border-border/50",
          "dark:bg-neutral-800 dark:border-neutral-700",
          active && "bg-primary/10 dark:bg-primary/20 border-primary/30"
        )}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className={cn(
                "px-2 py-0.5 whitespace-pre rounded-md text-xs",
                "bg-background border border-border",
                "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
              )}>
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className={cn(
            "flex items-center justify-center",
            active ? "text-primary" : "text-foreground/80 dark:text-neutral-300"
          )}>
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}