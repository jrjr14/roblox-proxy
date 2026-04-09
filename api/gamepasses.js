export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { userId, cursor } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }
    
    try {
        const response = await fetch(
            `https://inventory.roblox.com/v2/users/${userId}/assets/gamepasses?limit=100&cursor=${cursor || ""}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }
        );
        const data = await response.json();
        res.json(data);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
