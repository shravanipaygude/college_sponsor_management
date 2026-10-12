import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/notificationSlice";
import { fetchRequestsThunk } from "../store/slices/requestSlice";
import { fetchPartnershipsThunk } from "../store/slices/partnershipSlice";
import { getSocket, subscribeConnectionStatus } from "../services/socket";

/**
 * Experiment 8 — useSocketNotifications
 *
 * Custom hook that subscribes to real-time Socket.IO events and dispatches
 * the correct Redux actions so notifications + data refresh without page reload.
 *
 * Events handled:
 *   request:new           → committee gets notified of incoming sponsor request
 *   request:statusChanged → sponsor gets notified when request is accepted/declined
 *   partnership:created   → both committee + sponsor notified when partnership is formed
 *
 * Race-condition safe: uses subscribeConnectionStatus to register listeners
 * whether the socket is already connected when the hook mounts or connects later
 * (e.g., slow network, React Strict Mode double-mount, reconnection after dropout).
 *
 * Mounted once in App.jsx after authentication; cleaned up on logout or user change.
 */
export function useSocketNotifications(user) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const roleLabel = user.role === "sponsor" ? "Corporate Sponsor" : "Committee Head";

    // ─── Event handlers ──────────────────────────────────────────────────────

    // request:new — committee is notified when a sponsor sends a sponsorship request
    const onRequestNew = (data) => {
      console.log("[Socket.IO] Received request:new", data);
      const senderName = data.sender?.name || data.sender?.organizationName || "A sponsor";
      const eventTitle = data.event?.title || "your event";

      dispatch(
        addNotification({
          role: roleLabel,
          title: "New Sponsorship Request",
          message: `${senderName} wants to sponsor ${eventTitle}.`,
          timestamp: data.timestamp,
        })
      );

      // Refresh requests in the store so the UI updates without a reload
      dispatch(fetchRequestsThunk());
    };

    // request:statusChanged — sponsor is notified when committee accepts or declines
    const onRequestStatusChanged = (data) => {
      console.log("[Socket.IO] Received request:statusChanged", data);
      const status = data.status || "updated";
      const eventTitle = data.event?.title || data.opportunity?.title || "your request";
      const isAccepted = status === "accepted";

      dispatch(
        addNotification({
          role: roleLabel,
          title: isAccepted ? "Request Accepted! 🎉" : "Request Declined",
          message: isAccepted
            ? `Your sponsorship proposal for "${eventTitle}" was accepted.`
            : `Your sponsorship proposal for "${eventTitle}" was declined.`,
          timestamp: data.timestamp,
        })
      );

      dispatch(fetchRequestsThunk());
    };

    // partnership:created — both committee + sponsor are notified when a partnership is formed
    const onPartnershipCreated = (data) => {
      console.log("[Socket.IO] Received partnership:created", data);
      const eventTitle = data.event?.title || data.opportunity?.title || "a recent request";

      dispatch(
        addNotification({
          role: roleLabel,
          title: "Partnership Created! 🤝",
          message: `A new active partnership has been created for "${eventTitle}".`,
          timestamp: data.timestamp,
        })
      );

      dispatch(fetchPartnershipsThunk());
    };

    // ─── Listener management ─────────────────────────────────────────────────

    /**
     * Attach all three event listeners to the given socket instance.
     * Returns a cleanup function that removes them from that same instance.
     * Calling with null/undefined is a no-op and returns a harmless cleanup.
     */
    const registerListeners = (socket) => {
      if (!socket) return () => {};
      socket.on("request:new", onRequestNew);
      socket.on("request:statusChanged", onRequestStatusChanged);
      socket.on("partnership:created", onPartnershipCreated);
      return () => {
        socket.off("request:new", onRequestNew);
        socket.off("request:statusChanged", onRequestStatusChanged);
        socket.off("partnership:created", onPartnershipCreated);
      };
    };

    // Mutable ref to the current cleanup for the active set of listeners.
    // Re-assigned on every reconnect to prevent duplicate handlers.
    let unregisterListeners = () => {};

    /**
     * Subscribe to connection status changes. The callback fires immediately
     * with the current status so there is no gap even if the socket is already
     * connected when this hook mounts.
     *
     * On "connected": remove any stale listeners, then attach fresh ones to the
     * current socket instance (handles both initial connect and every reconnect).
     *
     * On any non-connected status: remove listeners from the now-dead socket so
     * they don't fire on a stale instance if the socket object is replaced.
     */
    const unsubStatus = subscribeConnectionStatus((status) => {
      if (status === "connected") {
        unregisterListeners(); // remove stale listeners before re-adding
        unregisterListeners = registerListeners(getSocket());
      } else {
        // Socket is disconnecting / reconnecting — remove listeners from the
        // current socket; they will be re-registered when "connected" fires again.
        unregisterListeners();
        unregisterListeners = () => {};
      }
    });

    // ─── Cleanup ─────────────────────────────────────────────────────────────

    return () => {
      unregisterListeners(); // remove socket event listeners
      unsubStatus();         // stop watching connection status
    };
  }, [user, dispatch]);
}
