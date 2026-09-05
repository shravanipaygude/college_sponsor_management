const API_BASE_URL = "http://localhost:5000/api";

// Utility mapper helpers
export const mapEventToPost = (eventDoc) => {
    if (!eventDoc) return null;
    const id = eventDoc._id || eventDoc.id;
    return {
        id: id,
        _id: id,
        committeeId: eventDoc.createdBy || 1,
        committeeName: eventDoc.committeeName || "CSI Student Chapter",
        collegeName: "VESIT",
        collegeLogo: "VE",
        eventName: eventDoc.title || "College Event",
        title: eventDoc.title,
        description: eventDoc.description || "",
        eventType: eventDoc.category || "Technical Festival",
        eventDate: eventDoc.eventDate
            ? new Date(eventDoc.eventDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })
            : "TBD",
        participants: "500+",
        participantsNumeric: 500,
        lookingFor: eventDoc.sponsorshipNeeded
            ? eventDoc.sponsorshipNeeded.split(",").map((s) => s.trim())
            : ["Monetary Sponsorship"],
        canOffer:
            Array.isArray(eventDoc.benefitsOffered) && eventDoc.benefitsOffered.length > 0
                ? eventDoc.benefitsOffered
                : ["Main Stage Branding", "Social Media Post"],
        sponsorshipNeeded: eventDoc.sponsorshipNeeded || "Hybrid",
        brandsInterested: 0,
        status: eventDoc.status === "open" ? "Active" : eventDoc.status || "Active",
        createdAt: eventDoc.createdAt
            ? new Date(eventDoc.createdAt).toLocaleDateString()
            : "Recently",
    };
};

export const mapPostToEventPayload = (postData) => {
    return {
        createdBy: postData.createdBy || null,
        title: postData.title || postData.eventName || "New College Event",
        description:
            postData.description ||
            `Sponsorship post for ${postData.eventName || postData.title}`,
        committeeName: postData.committeeName || "College Committee",
        eventDate: postData.eventDate && postData.eventDate !== "TBD" ? postData.eventDate : new Date(),
        category: postData.eventType || "Technical Festival",
        sponsorshipNeeded: Array.isArray(postData.lookingFor)
            ? postData.lookingFor.join(", ")
            : postData.sponsorshipNeeded || "Hybrid",
        benefitsOffered: Array.isArray(postData.canOffer) ? postData.canOffer : [],
        status: "open",
    };
};

export const mapOpportunityToUI = (oppDoc) => {
    if (!oppDoc) return null;
    const id = oppDoc._id || oppDoc.id;
    const createdBy = oppDoc.createdBy ? (oppDoc.createdBy._id || oppDoc.createdBy) : null;
    const companyName = oppDoc.companyName || oppDoc.brandName || "Corporate Sponsor";
    const canProvideList = Array.isArray(oppDoc.supportType) ? oppDoc.supportType : [];
    const expectationsList = Array.isArray(oppDoc.requirements) ? oppDoc.requirements : [];

    return {
        id: id,
        _id: id,
        createdBy: createdBy,
        sponsorId: createdBy,
        companyName: companyName,
        brandName: companyName,
        brandLogo: companyName ? companyName.substring(0, 2).toUpperCase() : "CS",
        tagline: "OPEN FOR COLLEGE SPONSORSHIPS",
        industry: oppDoc.category || "AI / Technology",
        category: oppDoc.category || "AI / Technology",
        contributionType: typeof canProvideList[0] === "string" ? canProvideList[0] : (canProvideList[0]?.type || "Hybrid"),
        estimatedValue: oppDoc.amountOrValue || "₹50,000",
        estimatedValueNumeric: 50000,
        interestedIn: expectationsList,
        canProvide: canProvideList,
        expectations: expectationsList,
        lookingFor: expectationsList,
        about: oppDoc.description || "Corporate sponsorship program for college events.",
        description: oppDoc.description || "Corporate sponsorship program for college events.",
        status: oppDoc.status === "open" ? "Active" : oppDoc.status || "Active",
        responses: 0,
        createdAt: oppDoc.createdAt
            ? new Date(oppDoc.createdAt).toLocaleDateString()
            : "Recently",
    };
};

export const mapOpportunityPayload = (oppData) => {
    const compName = oppData.companyName || oppData.brandName || "Corporate Sponsor";
    return {
        createdBy: oppData.createdBy || null,
        title: oppData.title || `${compName} Sponsorship Program`,
        companyName: compName,
        description: oppData.about || oppData.description || "Sponsorship opportunity",
        supportType: Array.isArray(oppData.canProvide)
            ? oppData.canProvide.map((item) => (typeof item === "string" ? item : item.item || String(item)))
            : [oppData.selectedContributionType || oppData.contributionType || "Hybrid"],
        amountOrValue: oppData.estimatedValue || "₹50,000",
        requirements: Array.isArray(oppData.expectations)
            ? oppData.expectations
            : Array.isArray(oppData.lookingFor)
            ? oppData.lookingFor
            : [],
        category: oppData.industry || oppData.category || "AI / Technology",
        status: "open",
    };
};

export const mapRequestToUI = (reqDoc) => {
    if (!reqDoc) return null;
    const id = reqDoc._id || reqDoc.id;
    const eventObj = reqDoc.event && typeof reqDoc.event === "object" ? reqDoc.event : null;
    const oppObj = reqDoc.opportunity && typeof reqDoc.opportunity === "object" ? reqDoc.opportunity : null;

    const senderHex = reqDoc.sender ? (reqDoc.sender._id || reqDoc.sender) : null;
    const receiverHex = reqDoc.receiver ? (reqDoc.receiver._id || reqDoc.receiver) : null;

    const senderName =
        (typeof reqDoc.sender === "object" && reqDoc.sender
            ? reqDoc.sender.organizationName || reqDoc.sender.company || reqDoc.sender.name
            : null) || reqDoc.senderName || oppObj?.companyName || "Sponsor";

    const receiverName =
        (typeof reqDoc.receiver === "object" && reqDoc.receiver
            ? reqDoc.receiver.organizationName || reqDoc.receiver.committee || reqDoc.receiver.name
            : null) || reqDoc.receiverName || eventObj?.committeeName || "Committee";

    const brandName = reqDoc.brandName || senderName || "Corporate Sponsor";
    const eventName = reqDoc.eventName || eventObj?.title || "College Event";

    const offeringText = reqDoc.supportRequested || "₹20,000 + 100 AI Credit Vouchers";
    const offeringList = offeringText.includes("+")
        ? offeringText.split("+").map((s) => s.trim())
        : [offeringText];

    const offerDetailsList = reqDoc.offerDetails
        ? reqDoc.offerDetails.split(",").map((s) => s.trim())
        : ["Main Stage Branding", "Product Demo"];

    return {
        id: id,
        _id: id,
        sponsorshipPostId: eventObj?._id || reqDoc.event || null,
        eventId: eventObj?._id || reqDoc.event || null,
        opportunityId: oppObj?._id || reqDoc.opportunity || null,
        opportunityTitle: oppObj?.title || "Sponsorship Opportunity",
        eventName: eventName,
        collegeName: eventObj?.committeeName || "VESIT",
        collegeLogo: "VE",
        senderId: senderHex,
        sender: senderHex,
        senderName: senderName,
        senderRole: reqDoc.senderRole,
        receiverId: receiverHex,
        receiver: receiverHex,
        receiverName: receiverName,
        receiverRole: reqDoc.receiverRole,
        brandName: brandName,
        brandLogo: brandName.substring(0, 2).toUpperCase(),
        offering: offeringText,
        requesting: offeringList,
        interestedIn: offerDetailsList,
        theyOffer: offerDetailsList,
        estimatedValue: "₹50,000",
        message: reqDoc.message || `${brandName} partnership request for ${eventName}`,
        status:
            reqDoc.status === "accepted"
                ? "Accepted"
                : reqDoc.status === "declined"
                ? "Declined"
                : "Pending",
        createdAt: reqDoc.createdAt
            ? new Date(reqDoc.createdAt).toLocaleDateString()
            : "Recently",
        receivedAt: reqDoc.createdAt
            ? new Date(reqDoc.createdAt).toLocaleDateString()
            : "Recently",
    };
};

export const mapPartnershipToUI = (partDoc) => {
    if (!partDoc) return null;
    const id = partDoc._id || partDoc.id;
    const reqObj = partDoc.request && typeof partDoc.request === "object" ? partDoc.request : null;
    const eventObj = partDoc.event && typeof partDoc.event === "object" ? partDoc.event : null;
    const oppObj = partDoc.opportunity && typeof partDoc.opportunity === "object" ? partDoc.opportunity : null;

    const commHex = partDoc.committee ? (partDoc.committee._id || partDoc.committee) : null;
    const sponHex = partDoc.sponsor ? (partDoc.sponsor._id || partDoc.sponsor) : null;

    const committeeName =
        (typeof partDoc.committee === "object" && partDoc.committee
            ? partDoc.committee.organizationName || partDoc.committee.committee || partDoc.committee.name
            : null) || eventObj?.committeeName || partDoc.committeeName || "College Committee";

    const brandName =
        (typeof partDoc.sponsor === "object" && partDoc.sponsor
            ? partDoc.sponsor.organizationName || partDoc.sponsor.company || partDoc.sponsor.name
            : null) || oppObj?.companyName || partDoc.brandName || partDoc.sponsorName || "Corporate Sponsor";

    const eventName = partDoc.eventName || eventObj?.title || "College Event";
    const facultyStatus = partDoc.facultyApprovalStatus || "approved";
    const uiStatus = "Active";

    const supportProvidedText = partDoc.supportProvided || "₹20,000 Support";
    const deliverablesList =
        Array.isArray(partDoc.deliverables) && partDoc.deliverables.length > 0
            ? partDoc.deliverables
            : ["Main Stage Branding"];

    const sponsorProvidesItems = supportProvidedText.split("+").map((item) => ({
        item: item.trim(),
        type: item.toLowerCase().includes("voucher") || item.toLowerCase().includes("credit") ? "Digital" : "Monetary",
    }));

    return {
        id: id,
        _id: id,
        requestId: reqObj?._id || partDoc.request || null,
        committee: commHex,
        committeeId: commHex,
        committeeName: committeeName,
        sponsor: sponHex,
        sponsorId: sponHex,
        sponsorName: brandName,
        brandName: brandName,
        brandLogo: brandName.substring(0, 2).toUpperCase(),
        collegeName: "VESIT",
        collegeLogo: "VE",
        eventName: eventName,
        brandOffers: [supportProvidedText],
        brandProvides: [supportProvidedText],
        committeeOffers: deliverablesList,
        committeeProvides: deliverablesList,
        collegePromises: deliverablesList,
        sponsorProvides: sponsorProvidesItems,
        estimatedValue: "₹50,000",
        estimatedTotalValue: "₹50,000",
        status: uiStatus,
        facultyApprovalStatus: facultyStatus,
        submittedBy: committeeName,
        submittedAt: partDoc.createdAt
            ? new Date(partDoc.createdAt).toLocaleDateString()
            : "Recently",
        createdAt: partDoc.createdAt
            ? new Date(partDoc.createdAt).toLocaleDateString()
            : "Recently",
        lastUpdated: partDoc.updatedAt
            ? new Date(partDoc.updatedAt).toLocaleDateString()
            : "Recently",
    };
};

// API Methods
export const api = {
    // Events
    getEvents: async () => {
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        return await res.json();
    },
    createEvent: async (eventPayload) => {
        const res = await fetch(`${API_BASE_URL}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventPayload),
        });
        if (!res.ok) throw new Error("Failed to create event");
        return await res.json();
    },
    updateEvent: async (id, eventPayload) => {
        const res = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventPayload),
        });
        if (!res.ok) throw new Error("Failed to update event");
        return await res.json();
    },
    deleteEvent: async (id) => {
        const res = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete event");
        return await res.json();
    },

    // Opportunities
    getOpportunities: async () => {
        const res = await fetch(`${API_BASE_URL}/opportunities`);
        if (!res.ok) throw new Error("Failed to fetch opportunities");
        return await res.json();
    },
    createOpportunity: async (opportunityPayload) => {
        const res = await fetch(`${API_BASE_URL}/opportunities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(opportunityPayload),
        });
        if (!res.ok) throw new Error("Failed to create opportunity");
        return await res.json();
    },
    updateOpportunity: async (id, opportunityPayload) => {
        const res = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(opportunityPayload),
        });
        if (!res.ok) throw new Error("Failed to update opportunity");
        return await res.json();
    },
    deleteOpportunity: async (id) => {
        const res = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete opportunity");
        return await res.json();
    },

    // Requests
    getRequests: async () => {
        const res = await fetch(`${API_BASE_URL}/requests`);
        if (!res.ok) throw new Error("Failed to fetch requests");
        return await res.json();
    },
    createRequest: async (requestPayload) => {
        const res = await fetch(`${API_BASE_URL}/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPayload),
        });
        if (!res.ok) throw new Error("Failed to create request");
        return await res.json();
    },
    updateRequestStatus: async (requestId, status) => {
        const res = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("Failed to update request status");
        return await res.json();
    },

    // Partnerships
    getPartnerships: async () => {
        const res = await fetch(`${API_BASE_URL}/partnerships`);
        if (!res.ok) throw new Error("Failed to fetch partnerships");
        return await res.json();
    },
    createPartnership: async (partnershipPayload) => {
        const res = await fetch(`${API_BASE_URL}/partnerships`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partnershipPayload),
        });
        if (!res.ok) throw new Error("Failed to create partnership");
        return await res.json();
    },
    updateFacultyApproval: async (partnershipId, approvalPayload) => {
        const res = await fetch(`${API_BASE_URL}/partnerships/${partnershipId}/approval`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(approvalPayload),
        });
        if (!res.ok) throw new Error("Failed to update faculty approval");
        return await res.json();
    },
};
