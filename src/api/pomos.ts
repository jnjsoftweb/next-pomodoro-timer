import axios from "axios";

const API_URL = "http://localhost:3001";

export interface Pomo {
  id?: number;
  taskId: number;
  startTime: string;
  endTime: string;
  state: "before" | "pending" | "run" | "pause" | "completed" | "standby";
  remainingTime: number;
}

export const getPomos = async (): Promise<Pomo[]> => {
  const response = await axios.get(`${API_URL}/pomos`);
  return response.data;
};

export const createPomo = async (pomo: Omit<Pomo, "id">): Promise<Pomo> => {
  // completed 상태가 아닌 pomo 확인
  const standbyPomos = await axios.get(`${API_URL}/pomos?taskId=${pomo.taskId}&state_ne=completed`);

  if (standbyPomos.data.length > 0) {
    throw new Error("이미 대기 중인 동일한 taskId의 pomo가 존재합니다.");
  } else {
    const response = await axios.post(`${API_URL}/pomos`, pomo);
    return response.data;
  }
};

export const updatePomo = async (id: number, pomo: Partial<Pomo>): Promise<Pomo> => {
  const response = await axios.patch(`${API_URL}/pomos/${id}`, pomo);
  return response.data;
};

export const deletePomo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/pomos/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting pomo:", error.response?.data);
      throw new Error(`Failed to delete pomo: ${error.response?.status} ${error.response?.statusText}`);
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};
