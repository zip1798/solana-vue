export function splConstructMetadata(symbol: string, name: string, description: string, icon: string) {
    return JSON.stringify({
        "name": name,
        "symbol": symbol,
        "description": description,
        "image": icon,
        "attributes": [],
        "properties": {
          "files": [
            {
                "uri": icon,
                "type": "image/png"
            }
          ]
        }
    });
}