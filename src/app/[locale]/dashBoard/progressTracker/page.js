"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressTracker() {
  const { data: session } = useSession();
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    axios
      .get(`/api/userWorkout?email=${session.user.email}`)
      .then((res) => setWorkoutPlan(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  const handleToggleComplete = async (day, exerciseName, currentStatus) => {
    try {
      await axios.patch("/api/userWorkout", {
        email: session.user.email,
        day,
        exerciseName,
        completed: !currentStatus,
      });

      setWorkoutPlan((prev) =>
        prev.map((d) =>
          d.day === day
            ? {
                ...d,
                exercises: d.exercises.map((ex) =>
                  ex.name === exerciseName
                    ? { ...ex, completed: !currentStatus }
                    : ex
                ),
              }
            : d
        )
      );

      toast.success("Workout updated successfully!");
    } catch (err) {
      toast.error("Error updating progress");
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Loading your progress...
      </p>
    );

  if (workoutPlan.length === 0)
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-400">
        <p>❌ No workout found!</p>
        <p>Generate your workout first.</p>
      </div>
    );

  const totalExercises = workoutPlan.reduce(
    (acc, d) => acc + d.exercises.length,
    0
  );
  const completedExercises = workoutPlan.reduce(
    (acc, d) => acc + d.exercises.filter((ex) => ex.completed).length,
    0
  );
  const progressPercentage =
    totalExercises > 0
      ? Math.round((completedExercises / totalExercises) * 100)
      : 0;

  const activeWorkouts = workoutPlan.map((d) => ({
    day: d.day,
    exercises: d.exercises.filter((ex) => !ex.completed),
  }));
  const completedWorkouts = workoutPlan.map((d) => ({
    day: d.day,
    exercises: d.exercises.filter((ex) => ex.completed),
  }));

  const doughnutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [progressPercentage, 100 - progressPercentage],
        backgroundColor: ["rgba(34,197,94,0.9)", "rgba(156,163,175,0.2)"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    elements: { arc: { borderRadius: 12 } },
  };

  const lineData = {
    labels: workoutPlan.map((d) => d.day),
    datasets: [
      {
        label: "Completed Exercises",
        data: workoutPlan.map(
          (d) => d.exercises.filter((ex) => ex.completed).length
        ),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.3)",
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#22c55e",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: "white" } },
      x: { ticks: { color: "white" } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text mb-4">
          🏋️ Fitness Progress Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
          Track your daily progress, stay consistent, and grow stronger!
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg p-6 text-center transition-colors duration-500">
          <h3 className="text-lg font-semibold mb-2">Total Exercises</h3>
          <p className="text-3xl font-bold">{totalExercises}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg p-6 text-center transition-colors duration-500">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{completedExercises}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg p-6 text-center transition-colors duration-500">
          <h3 className="text-lg font-semibold mb-2">Progress</h3>
          <p className="text-3xl font-bold text-blue-500">{progressPercentage}%</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Workouts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-100 dark:bg-gray-800/70 rounded-3xl shadow-lg p-6 flex flex-col transition-colors duration-500"
        >
          <h2 className="text-2xl font-bold mb-4">📝 Active Workouts</h2>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {activeWorkouts.map(
              (day, idx) =>
                day.exercises.length > 0 && (
                  <div key={idx} className="mb-4">
                    <h3 className="font-semibold mb-2">{day.day}</h3>
                    {day.exercises.map((ex, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm mb-3 transition-colors duration-300"
                      >
                        <div>
                          <p className="font-semibold">{ex.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {ex.sets} sets × {ex.reps} reps
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={ex.completed}
                          onChange={() =>
                            handleToggleComplete(day.day, ex.name, ex.completed)
                          }
                          className="w-6 h-6 accent-green-500 cursor-pointer"
                        />
                      </motion.div>
                    ))}
                  </div>
                )
            )}
          </div>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800/80 rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center transition-colors duration-500"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">🌀 Overall Progress</h2>
          <div className="relative w-56 h-56 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute text-center">
              <p className="text-4xl font-extrabold text-green-500">
                {progressPercentage}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">Completed</p>
            </div>
          </div>
          <div className="mt-10 w-full h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </motion.div>

        {/* Completed Workouts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-100 dark:bg-green-900/30 rounded-3xl shadow-lg p-6 flex flex-col transition-colors duration-500"
        >
          <h2 className="text-2xl font-bold mb-4 text-green-500">✅ Completed Workouts</h2>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {completedWorkouts.map(
              (day, idx) =>
                day.exercises.length > 0 && (
                  <div key={idx} className="mb-4">
                    <h3 className="font-semibold mb-2">{day.day}</h3>
                    {day.exercises.map((ex, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-between items-center bg-white dark:bg-green-900/40 p-3 rounded-xl shadow-sm mb-3 transition-colors duration-300"
                      >
                        <div>
                          <p className="font-semibold">{ex.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {ex.sets} sets × {ex.reps} reps
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={ex.completed}
                          onChange={() =>
                            handleToggleComplete(day.day, ex.name, ex.completed)
                          }
                          className="w-6 h-6 accent-red-500 cursor-pointer"
                        />
                      </motion.div>
                    ))}
                  </div>
                )
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 text-center text-gray-600 dark:text-gray-400 text-lg md:text-xl"
      >
        <p className="italic">
          “Discipline is choosing between what you want now and what you want most.” 💪
        </p>
      </motion.div>
    </div>
  );
}
