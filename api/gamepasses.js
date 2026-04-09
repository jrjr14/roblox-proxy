export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { userId, cursor } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }
    
    try {
        const response = await fetch(
            `https://www.roblox.com/users/inventory/list-json?assetTypeId=34&cursor=${cursor || ""}&itemsPerPage=100&userId=${userId}`
        );
        const data = await response.json();
        res.json(data);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
