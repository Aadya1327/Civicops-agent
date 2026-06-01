INCIDENTS = [
    {"zone": "North Gate", "type": "crowd_density", "severity": 82, "trend": "rising"},
    {"zone": "Transit Hub", "type": "queue_delay", "severity": 74, "trend": "stable"},
    {"zone": "Market Lane", "type": "vendor_stockout", "severity": 63, "trend": "rising"},
    {"zone": "Family Plaza", "type": "accessibility_block", "severity": 56, "trend": "falling"},
]

RESOURCES = [
    {"name": "Volunteer Team A", "capacity": 12, "best_for": "crowd_density"},
    {"name": "Transit Liaison", "capacity": 4, "best_for": "queue_delay"},
    {"name": "Vendor Support Desk", "capacity": 6, "best_for": "vendor_stockout"},
    {"name": "Accessibility Crew", "capacity": 5, "best_for": "accessibility_block"},
]

MESSAGES = {
    "crowd_density": "Redirect visitors through the east corridor for the next 20 minutes.",
    "queue_delay": "Add two staff members to the transit kiosk and publish delay guidance.",
    "vendor_stockout": "Trigger restock workflow for high-demand items in Market Lane.",
    "accessibility_block": "Dispatch accessibility crew and update route signage.",
}
