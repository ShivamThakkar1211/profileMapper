import { motion } from "framer-motion";

const ProfileCard = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="profile-card"
    >
      {/* Profile Card Content */}
    </motion.div>
  );
};
