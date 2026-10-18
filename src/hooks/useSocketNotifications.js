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
 *   request:new           → committee or sponsor gets notified of incoming request/approach
 *   request:statusChanged → sender gets notified when request/approach is accepted or declined
 *   partnership:created   → both committee + sponsor notified when partnership is formed
 *   notification:new      → direct persistent notification dispatch
 *
 * Race-condition safe: uses subscribeConnectionStatus to register listeners
 * whether the socket is already connected when the hook mounts or connects later.
 */
export function useSocketNotifications(user) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const roleLabel = user.role === "sponsor" ? "Corporate Sponsor" : "Committee Head";

    // ─── Event handlers ──────────────────────────────────────────────────────

    // notification:new — generic persistent notification event
    const onNotificationNew = (notif) => {
      console.log("[Socket.IO] Received notification:new", notif);
      if (notif) {
        dispatch(addNotification(notif));
      }
    };

    // request:new — incoming request (sponsor -> event) or approach (committee -> opp)
    const onRequestNew = (data) => {
      console.log("[Socket.IO] Received request:new", data);
      if (data.notification) {
        dispatch(addNotification(data.notification));
      } else {
        const senderName = data.sender?.organizationName || data.sender?.name || "A partner";
        const isOppApproach = Boolean(data.opportunity);
        const title = isOppApproach ? "New Opportunity Approach" : "New Sponsorship Request";
        const entity = data.opportunity?.title || data.event?.title || "your listing";
        const message = isOppApproach
          ? `${senderName} approached your opportunity "${entity}".`
          : `${senderName} wants to sponsor ${entity}.`;

        dispatch(
          addNotification({
            _id: data.requestId ? `req_${data.requestId}` : undefined,
            role: roleLabel,
            title,
            message,
            timestamp: data.timestamp,
          })
        );
      }

      // Refresh requests in the store so the UI updates without a reload
      dispatch(fetchRequestsThunk());
    };

    // request:statusChanged — sender notified when committee/sponsor accepts or declines
    const onRequestStatusChanged = (data) => {
      console.log("[Socket.IO] Received request:statusChanged", data);
      if (data.notification) {
        dispatch(addNotification(data.notification));
      } else {
        const status = data.status || "updated";
        const isAccepted = status === "accepted";
        const isOppApproach = Boolean(data.opportunity);
        const entity = data.opportunity?.title || data.event?.title || "your request";

        const title = isOppApproach
          ? isAccepted
            ? "Approach Accepted! 🎉"
            : "Approach Declined"
          : isAccepted
          ? "Request Accepted! 🎉"
          : "Request Declined";

        const message = isOppApproach
          ? `Your sponsorship approach for "${entity}" was ${status}.`
          : `Your sponsorship proposal for "${entity}" was ${status}.`;

        dispatch(
          addNotification({
            _id: data.requestId ? `status_${data.requestId}_${status}` : undefined,
            role: roleLabel,
            title,
            message,
            timestamp: data.timestamp,
          })
        );
      }

      dispatch(fetchRequestsThunk());
    };

    // partnership:created — both committee + sponsor notified when partnership is formed
    const onPartnershipCreated = (data) => {
      console.log("[Socket.IO] Received partnership:created", data);
      if (data.notification) {
        dispatch(addNotification(data.notification));
      } else {
        const entity = data.event?.title || data.opportunity?.title || "a recent request";

        dispatch(
          addNotification({
            _id: data.partnershipId ? `part_${data.partnershipId}` : undefined,
            role: roleLabel,
            title: "Partnership Created! 🤝",
            message: `A new active partnership has been created for "${entity}".`,
            timestamp: data.timestamp,
          })
        );
      }

      dispatch(fetchPartnershipsThunk());
    };

    // ─── Listener management ─────────────────────────────────────────────────

    const registerListeners = (socket) => {
      if (!socket) return () => {};
      socket.on("notification:new", onNotificationNew);
      socket.on("request:new", onRequestNew);
      socket.on("request:statusChanged", onRequestStatusChanged);
      socket.on("partnership:created", onPartnershipCreated);

      return () => {
        socket.off("notification:new", onNotificationNew);
        socket.off("request:new", onRequestNew);
        socket.off("request:statusChanged", onRequestStatusChanged);
        socket.off("partnership:created", onPartnershipCreated);
      };
    };

    let unregisterListeners = () => {};

    const unsubStatus = subscribeConnectionStatus((status) => {
      if (status === "connected") {
        unregisterListeners();
        unregisterListeners = registerListeners(getSocket());
      } else {
        unregisterListeners();
        unregisterListeners = () => {};
      }
    });

    return () => {
      unregisterListeners();
      unsubStatus();
    };
  }, [user, dispatch]);
}
