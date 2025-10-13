"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaTrophy,
  FaMedal,
  FaCrown,
  FaDumbbell,
  FaBolt,
  FaClock,
  FaStar,
  FaGem,
  FaRunning,
  FaFireAlt,
  FaAward,
  FaSun,
} from "react-icons/fa";

export default function GamificationPage() {
  const [user, setUser] = useState({
    name: "Alex Carter",
    level: 8,
    xp: 7200,
    nextLevelXP: 10000,
    streak: 1,
    avatarColor: "#10b981",
    badges: ["🔥"],
  });

  const xpData = [
    { day: "Mon", xp: 400 },
    { day: "Tue", xp: 300 },
    { day: "Wed", xp: 600 },
    { day: "Thu", xp: 800 },
    { day: "Fri", xp: 900 },
    { day: "Sat", xp: 700 },
    { day: "Sun", xp: 1000 },
  ];

  const challenges = [
    { id: 1, title: "Complete 3 Workouts", xp: 500, icon: <FaDumbbell /> },
    { id: 2, title: "Generate Meal Plan", xp: 300, icon: <FaBolt /> },
    { id: 3, title: "Hit 10k Steps", xp: 400, icon: <FaRunning /> },
  ];

  const handleChallengeComplete = (xp) => {
    const newXP = user.xp + xp;
    const levelUp = newXP >= user.nextLevelXP;
    setUser({
      ...user,
      xp: levelUp ? newXP - user.nextLevelXP : newXP,
      level: levelUp ? user.level + 1 : user.level,
      streak: user.streak + 1,
      badges: levelUp ? [...user.badges, "🏅"] : user.badges,
    });
  };

  const badgesList = [
    { id: 1, name: "Ten 10", color: "from-red-400 to-red-600", icon: <FaFireAlt /> },
    { id: 2, name: "Twenty 20", color: "from-purple-400 to-purple-700", icon: <FaMedal /> },
    { id: 3, name: "Quarter Century", color: "from-blue-400 to-blue-700", icon: <FaTrophy /> },
    { id: 4, name: "Half Century", color: "from-yellow-400 to-yellow-600", icon: <FaStar /> },
    { id: 5, name: "3 Quarter Century", color: "from-indigo-400 to-indigo-700", icon: <FaCrown /> },
    { id: 6, name: "Super Century", color: "from-pink-400 to-pink-700", icon: <FaGem /> },
    { id: 7, name: "Time Master", color: "from-sky-400 to-sky-700", icon: <FaClock /> },
  ];

  const cardShadow = "shadow-[0_10px_25px_rgba(0,0,0,0.05)]";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 px-4 md:px-10 py-10 transition-all duration-700">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-transparent bg-clip-text mb-4 drop-shadow-md">
            Gamify Your Fitness Journey
          </h1>
          <p className="text-gray-700 dark:text-gray-300 md:text-lg">
            Track progress, complete challenges, and unlock achievements!
          </p>
        </motion.div>

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 p-8 rounded-3xl ${cardShadow} flex flex-col md:flex-row items-center justify-between gap-6`}
        >
          <div className="flex items-center gap-6">
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-emerald-300 shadow-md"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name[0]}
              <div className="absolute bottom-0 right-0 text-yellow-400 text-2xl">
                <FaCrown />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-emerald-600 dark:text-green-400 font-medium">
                Level {user.level} | Streak: {user.streak}🔥
              </p>
              <div className="w-52 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400 h-3 rounded-full transition-all"
                  style={{ width: `${(user.xp / user.nextLevelXP) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                XP: {user.xp}/{user.nextLevelXP}
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-3xl">{user.badges.map((b, i) => <span key={i}>{b}</span>)}</div>
        </motion.div>

        {/* DAILY STREAK */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative p-8 rounded-3xl overflow-hidden text-gray-900 dark:text-white ${cardShadow}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#1e1b4b] opacity-95 rounded-3xl"></div>

          <div className="relative text-center space-y-3">
            <h3 className="text-2xl font-bold flex justify-center items-center gap-2">
              <FaSun className="text-yellow-500 dark:text-yellow-400" /> Daily Streak: {user.streak} Days
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Complete {10 - user.streak} more days to earn your{" "}
              <span className="font-semibold text-amber-600 dark:text-amber-400">Ten 10 Badge</span>
            </p>

            <div className="flex justify-center gap-3 pt-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border text-sm font-semibold ${
                    i < user.streak
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500 border-transparent text-white shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-gray-200 dark:border-gray-700 text-center"
        >
          <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
            <FaAward className="text-yellow-500" /> Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {badgesList.map((badge) => (
              <div
                key={badge.id}
                className={`relative h-36 w-full flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color} text-white shadow-lg`}
              >
                <div className="text-3xl mb-2 drop-shadow-md">{badge.icon}</div>
                <p className="font-semibold text-sm tracking-wide">{badge.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CHALLENGES */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-5">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className={`bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all ${cardShadow}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{ch.title}</h3>
                <span className="text-2xl text-emerald-500">{ch.icon}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">+{ch.xp} XP</p>
              <button
                onClick={() => handleChallengeComplete(ch.xp)}
                className="py-2.5 px-8 bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 text-gray-900 rounded-full hover:opacity-90 font-semibold transition"
              >
                Complete
              </button>
            </div>
          ))}
        </motion.div>

        {/* WEEKLY XP CHART */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`bg-white dark:bg-[#111827] p-6 rounded-3xl border border-gray-200 dark:border-gray-700 ${cardShadow}`}
        >
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-emerald-600 dark:text-green-400">
            <FaTrophy /> Weekly XP
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={xpData}>
              <XAxis stroke="#10b981" dataKey="day" />
              <YAxis stroke="#10b981" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "#111827",
                  borderRadius: "10px",
                }}
              />
              <Line type="monotone" dataKey="xp" stroke="#10b981" strokeWidth={3} dot={{ fill: "#34d399" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
