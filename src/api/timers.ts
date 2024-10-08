import axios from "axios";

const API_URL = "http://localhost:3001";

export interface Timer {
  id: number;
  taskId: number;
  startTime: string;
  endTime: string;
  state: string;
  remainingTime: number;
  sn: number;
}

export const getTimers = async (): Promise<Timer[]> => {
  const response = await axios.get(`${API_URL}/timers`);
  return response.data;
};

export const createTimer = async (timer: Omit<Timer, "id">): Promise<Timer> => {
  // completed 상태가 아닌 timer 확인
  const standbyTimers = await axios.get(`${API_URL}/timers?taskId=${timer.taskId}&state_ne=completed`);

  if (standbyTimers.data.length > 0) {
    throw new Error("이미 대기 중인 동일한 taskId의 timer가 존재합니다.");
  } else {
    const response = await axios.post(`${API_URL}/timers`, timer);
    return response.data;
  }
};

export const updateTimer = async (id: number, timer: Partial<Timer>): Promise<Timer> => {
  const response = await axios.patch(`${API_URL}/timers/${id}`, timer);
  return response.data;
};

export const deleteTimer = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/timers/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting timer:", error.response?.data);
      throw new Error(`Failed to delete timer: ${error.response?.status} ${error.response?.statusText}`);
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};
