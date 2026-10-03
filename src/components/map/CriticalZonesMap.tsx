"use client";

import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import {
  SEVERITY_PRESENTATION,
  ZONE_TYPE_LABELS,
  type CriticalZone,
} from "@/domain/critical-zone";
import { SeverityBadge } from "@/components/zones/SeverityBadge";
import styles from "./map.module.css";

const MAX_INITIAL_ZOOM = 11;
const BOUNDS_PADDING: [number, number] = [40, 40];

interface CriticalZonesMapProps {
  zones: readonly CriticalZone[];
}

function toLatLng({ location }: CriticalZone): LatLngTuple {
  return [location.latitude, location.longitude];
}

export default function CriticalZonesMap({ zones }: CriticalZonesMapProps) {
  return (
    <MapContainer
      className={styles.map}
      bounds={zones.map(toLatLng)}
      boundsOptions={{ padding: BOUNDS_PADDING, maxZoom: MAX_INITIAL_ZOOM }}
      scrollWheelZoom
      aria-label="Mapa das zonas críticas de erosão em Sergipe"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {zones.map((zone) => {
        const { color } = SEVERITY_PRESENTATION[zone.severity];

        return (
          <CircleMarker
            key={zone.id}
            center={toLatLng(zone)}
            radius={12}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.45, weight: 2 }}
          >
            <Popup>
              <div className={styles.popup}>
                <strong>{zone.name}</strong>
                <span className={styles.popupMeta}>
                  {zone.municipality} · {ZONE_TYPE_LABELS[zone.type]}
                </span>
                <SeverityBadge severity={zone.severity} />
                <span>{zone.rateSummary}</span>
                {zone.note ? <span className={styles.popupMeta}>{zone.note}</span> : null}
                <a href={zone.source.url} target="_blank" rel="noopener noreferrer">
                  Fonte: {zone.source.label} ({zone.source.referenceYear})
                </a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
