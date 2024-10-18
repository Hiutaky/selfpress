import os from "os";
// Get CPU usage
export function getCpuUsage() {
  const cpus = os.cpus();

  cpus.forEach((cpu, i) => {
    const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
    const used = total - cpu.times.idle;
    const percentageUsed = (used / total) * 100;

    console.log(`CPU ${i}: ${percentageUsed.toFixed(2)}% used`);
  });
}

// Get memory usage
export function getMemoryUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const percentageUsed = (usedMemory / totalMemory) * 100;

  console.log(
    `Memory: ${(usedMemory / 1024 / 1024).toFixed(2)} MB used out of ${(totalMemory / 1024 / 1024).toFixed(2)} MB (${percentageUsed.toFixed(2)}% used)`,
  );
}
