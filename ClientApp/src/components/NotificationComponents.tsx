import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type Param = {
  message: string;
  title: string;
  OnClose: () => void;
};

const NotificationComponents = ({
  message,
  title,
  OnClose
}: Param) => {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "keyframes", stiffness: 120, damping: 15 }}
        exit={{opacity: 0, x: 400 }}
        className="fixed z-999 bottom-10 right-5 p-5 card w-90"
      >
        <X
          className="absolute top-2 left-2 bg-danger/30 rounded-2xl cursor-pointer"
          size={15}
          onClick={OnClose}
        />
        <p className="text-sm font-bold text-sub tracking-widest text-right">
          {title}
        </p>
        <p className="text-xl font-bold text-foreground">{message}</p>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default NotificationComponents;
