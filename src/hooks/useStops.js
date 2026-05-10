import { serverTimestamp, writeBatch, doc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getCollection,
  subscribeToCollection,
  subscribeToDocument,
} from "../firebase/firestore";

export function useStops() {
  async function addStop(tripId, stopData) {
    try {
      const stopId = await createDocument(`trips/${tripId}/stops`, {
        ...stopData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return stopId;
    } catch (error) {
      throw error;
    }
  }

  async function updateStop(tripId, stopId, data) {
    try {
      await updateDocument(`trips/${tripId}/stops`, stopId, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  }

  async function deleteStop(tripId, stopId) {
    try {
      const activities = await getCollection(`trips/${tripId}/stops/${stopId}/activities`);
      const batch = writeBatch(db);
      activities.forEach((activity) => {
        batch.delete(doc(db, `trips/${tripId}/stops/${stopId}/activities`, activity.id));
      });
      batch.delete(doc(db, `trips/${tripId}/stops`, stopId));
      await batch.commit();
    } catch (error) {
      throw error;
    }
  }

  async function reorderStops(tripId, stops) {
    try {
      const batch = writeBatch(db);
      stops.forEach((stop, index) => {
        batch.update(doc(db, `trips/${tripId}/stops`, stop.id), {
          order: index,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    } catch (error) {
      throw error;
    }
  }

  async function addActivity(tripId, stopId, activityData) {
    try {
      const activityId = await createDocument(
        `trips/${tripId}/stops/${stopId}/activities`,
        {
          ...activityData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
      return activityId;
    } catch (error) {
      throw error;
    }
  }

  async function updateActivity(tripId, stopId, activityId, data) {
    try {
      await updateDocument(
        `trips/${tripId}/stops/${stopId}/activities`,
        activityId,
        {
          ...data,
          updatedAt: serverTimestamp(),
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async function deleteActivity(tripId, stopId, activityId) {
    try {
      await deleteDocument(
        `trips/${tripId}/stops/${stopId}/activities`,
        activityId
      );
    } catch (error) {
      throw error;
    }
  }

  function subscribeToStops(tripId, callback) {
    return subscribeToCollection(`trips/${tripId}/stops`, [], callback);
  }

  function subscribeToActivities(tripId, stopId, callback) {
    return subscribeToCollection(
      `trips/${tripId}/stops/${stopId}/activities`,
      [],
      callback
    );
  }

  async function getActivitiesForStop(tripId, stopId) {
    try {
      return await getCollection(`trips/${tripId}/stops/${stopId}/activities`);
    } catch (error) {
      throw error;
    }
  }

  return {
    addStop,
    updateStop,
    deleteStop,
    reorderStops,
    addActivity,
    updateActivity,
    deleteActivity,
    subscribeToStops,
    subscribeToActivities,
    getActivitiesForStop,
  };
}
