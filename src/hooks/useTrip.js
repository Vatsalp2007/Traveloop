import { serverTimestamp, where } from "firebase/firestore";
import {
  createDocument,
  deleteDocument,
  updateDocument,
  getDocument,
  getCollection,
  subscribeToCollection,
} from "../firebase/firestore";

const COLLECTION = "trips";

export function useTrip() {
  async function createTrip(data) {
    try {
      const tripData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const tripId = await createDocument(COLLECTION, tripData);
      return tripId;
    } catch (error) {
      throw error;
    }
  }

  async function deleteTrip(tripId) {
    try {
      await deleteDocument(COLLECTION, tripId);
    } catch (error) {
      throw error;
    }
  }

  async function updateTrip(tripId, data) {
    try {
      await updateDocument(COLLECTION, tripId, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  }

  async function getTrip(tripId) {
    try {
      return await getDocument(COLLECTION, tripId);
    } catch (error) {
      throw error;
    }
  }

  async function getUserTrips(userId) {
    try {
      return await getCollection(COLLECTION, [
        // constraints passed as needed
      ]);
    } catch (error) {
      throw error;
    }
  }

  function subscribeToTrips(userId, callback, onError) {
    return subscribeToCollection(
      COLLECTION,
      [where("userId", "==", userId)],
      callback,
      onError
    );
  }

  return {
    createTrip,
    deleteTrip,
    updateTrip,
    getTrip,
    getUserTrips,
    subscribeToTrips,
  };
}
