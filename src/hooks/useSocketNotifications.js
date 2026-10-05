import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/slices/notificationSlice";
import { fetchRequestsThunk } from "../store/slices/requestSlice";
import { fetchPartnershipsThunk } from "../store/slices/partnershipSlice";
import { getSocket } from "../services/socket";

/**
 * Experiment 8 — useSocketNotifications
 *
 * Custom hook that subscribes to real-time Socket.IO events and dispatches
 * the correct Redux actions so notifications + data refresh without page reload.
 *
 * Events handled:
 *   request:new          → committee gets notified of incoming sponsor request
 *   request:statusChanged → sponsor gets notified when request is accepted/declined
 *   partnership:created  → both committee + sponsor notified when partnership is formed
 *
 * This hook is mounted once in App.jsx after authentication, and cleaned up on logout.
 */
export function useSocketNotifications(user) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const roleLabel = user.role === "sponsor" ? "Corporate Sponsor" : "Committee Head";

    // ── request:new ─────────────────────────────────────────────
    // Committee receives this when a sponsor sends a sponsorship request
    const onRequestNew = (data) => {
      console.log("[Socket.IO] Received request:new", data);
      const senderName = data.sender?.name || data.sender?.organizationName || "A sponsor";
      const eventTitle = data.event?.title || "your event";

      dispatch(
        addNotification({
          role: roleLabel,
          title: "New Sponsorship Request",
          message: `${senderName} wants to sponsor ${eventTitle}.`,
        })
      );

      // Refresh requests in the store so UI updates
      dispatch(fetchRequestsThunk());
    };

    // ── request:statusChanged ────────────────────────────────────
    // Sponsor receives this when committee accepts or declines
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
        })
      );

      // Refresh requests so status reflects immediately
      dispatch(fetchRequestsThunk());
    };

    // ── partnership:created ──────────────────────────────────────
    // Both committee + sponsor receive this when a partnership is created
    const onPartnershipCreated = (data) => {
      console.log("[Socket.IO] Received partnership:created", data);
      const eventTitle = data.event?.title || data.opportunity?.title || "a recent request";

      dispatch(
        addNotification({
          role: roleLabel,
          title: "Partnership Created! 🤝",
          message: `A new active partnership has been created for "${eventTitle}".`,
        })
      );

      // Refresh partnerships so the list updates immediately
      dispatch(fetchPartnershipsThunk());
    };

    socket.on("request:new", onRequestNew);
    socket.on("request:statusChanged", onRequestStatusChanged);
    socket.on("partnership:created", onPartnershipCreated);

    // Cleanup listeners on unmount / user change
    return () => {
      socket.off("request:new", onRequestNew);
      socket.off("request:statusChanged", onRequestStatusChanged);
      socket.off("partnership:created", onPartnershipCreated);
    };
  }, [user, dispatch]);
}
