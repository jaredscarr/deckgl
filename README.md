# deckgl
An example that uses deck.gl to learn how the library works.

## Set-up

To run this example, you need a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) and a [map id](https://developers.google.com/maps/documentation/javascript/webgl#vector-id). You can either set an environment variable:

```bash
export GoogleMapsAPIKey=<google_maps_api_key>
export GoogleMapsMapId=<google_maps_map_id>
```

Or set the `GOOGLE_MAPS_API_KEY` and `GOOGLE_MAP_ID` variables in `app.jsx`.

To install dependencies:

```bash
npm install
```

Commands:
* `npm start` is the development target, to serve the app and hot reload.
* `npm run build` is the production target, to create the final bundle and write to disk.
