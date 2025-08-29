import { useState, useEffect, useCallback } from "react";
import { API_URL } from "./APIURL";

export async function BuyTicket({ eventId, userId, quantity }) {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/buyTicket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,     // string
        quantity    // number
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error purchasing ticket:", error);
    return { error: error.message || "Unknown error" };
  }
}

export function GetUserTickets(userId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/${userId}/tickets`);
      const result = await response.json();
      if (result.success && result.data) {
        setTickets(result.data);
      } else {
        setTickets([]);
        setError("No Tickets Found.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: fetchTickets };
}