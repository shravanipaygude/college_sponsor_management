import { useState, useEffect } from "react";

// useSavedItems provides reusable save/unsave behavior
// for both sponsors and events.
// It persists saved item IDs to localStorage, keyed per user,
// so saved lists don't mix between different accounts.

/**
 * @param {string} storageKey — unique localStorage key, e.g. "sf_saved_sponsors_user123"
 * @returns {{ savedItems: array, saveItem, removeItem, toggleSaved, isSaved }}
 */
export function useSavedItems(storageKey) {
  // useState manages the list of saved item IDs.
  const [savedItems, setSavedItems] = useState([]);

  // useEffect restores saved items from localStorage on mount or key change.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSavedItems(JSON.parse(stored));
      } else {
        setSavedItems([]);
      }
    } catch {
      setSavedItems([]);
    }
  }, [storageKey]);

  // useEffect persists saved items to localStorage whenever they change.
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(savedItems));
  }, [savedItems, storageKey]);

  /** Add an item ID to the saved list */
  const saveItem = (itemId) => {
    setSavedItems((prev) => {
      if (prev.includes(itemId)) return prev;
      return [...prev, itemId];
    });
  };

  /** Remove an item ID from the saved list */
  const removeItem = (itemId) => {
    setSavedItems((prev) => prev.filter((id) => id !== itemId));
  };

  /** Toggle saved state for an item */
  const toggleSaved = (itemId) => {
    setSavedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  /** Check if an item is currently saved */
  const isSaved = (itemId) => savedItems.includes(itemId);

  return {
    savedItems,
    saveItem,
    removeItem,
    toggleSaved,
    isSaved,
  };
}
