import axiosInstance from "../api/axios";

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  eventDate: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  location: string;
  eventDate: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
}

// Create a new event
export const createEvent = async (data: CreateEventDto): Promise<Event> => {
  const response = await axiosInstance.post("/event/createEvent", data);
  return response.data;
};

// Get all events
export const listEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get("/event/listEvent");
  return response.data;
};

// Get event by ID
export const getEventById = async (id: number): Promise<Event> => {
  const response = await axiosInstance.get(`/event/getEventById/${id}`);
  return response.data;
};

// Update event
export const updateEvent = async (
  id: number,
  data: UpdateEventDto
): Promise<Event> => {
  const response = await axiosInstance.put(`/event/updateEvent/${id}`, data);
  return response.data;
};

// Delete event
export const deleteEvent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/event/deleteEvent/${id}`);
};
