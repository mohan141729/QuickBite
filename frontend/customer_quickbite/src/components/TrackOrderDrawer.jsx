import React, { useEffect, useState } from "react"
import { X, CheckCircle2, Bike, UtensilsCrossed, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useSocket } from "../context/SocketContext"
import L from 'leaflet'

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const steps = [
  { label: "Order Placed", icon: <Clock className="w-5 h-5" /> },
  { label: "Being Prepared", icon: <UtensilsCrossed className="w-5 h-5" /> },
  { label: "Out for Delivery", icon: <Bike className="w-5 h-5" /> },
  { label: "Delivered", icon: <CheckCircle2 className="w-5 h-5" /> },
]

// Component to center map on marker
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const TrackOrderDrawer = ({ order, onClose }) => {
  const { socket } = useSocket();
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('driver-location-updated', (data) => {
        console.log("📍 Driver location received:", data);
        if (data.orderId === order._id && data.location) {
          setDriverLocation([data.location.lat, data.location.lng]);
        }
      });

      return () => {
        socket.off('driver-location-updated');
      };
    }
  }, [socket, order]);

  if (!order) return null

  // Map order status to progress step
  const stepIndex = {
    processing: 1,
    preparing: 2,
    out_for_delivery: 3,
    delivered: 4,
  }[order.orderStatus] || 1

  // Default center (Bangalore or Order Address)
  // Ideally use order.address.location if available
  const defaultCenter = [12.9716, 77.5946];
  const mapCenter = driverLocation || (order.address?.location ? [order.address.location.lat, order.address.location.lng] : defaultCenter);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex justify-end"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="w-full sm:w-[440px] h-full bg-white shadow-2xl rounded-l-2xl flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Track Your Order
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Map Section */}
          {order.orderStatus === 'out_for_delivery' && (
            <div className="h-64 w-full relative z-0">
              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={mapCenter} />
                {driverLocation && (
                  <Marker position={driverLocation}>
                    <Popup>
                      Delivery Partner is here! 🚴
                    </Popup>
                  </Marker>
                )}
                {/* Destination Marker */}
                {order.address?.location && (
                  <Marker position={[order.address.location.lat, order.address.location.lng]}>
                    <Popup>
                      Your Location 🏠
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          )}

          {/* Details */}
          <div className="p-5 border-b bg-gray-50">
            <p className="font-semibold text-gray-900">
              {order.restaurant?.name || "Restaurant"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: {order._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total: ₹{order.totalAmount}
            </p>
          </div>

          {/* Timeline */}
          <div className="flex-1 p-6 space-y-6">
            {steps.map((step, idx) => {
              const active = idx + 1 <= stepIndex
              return (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${active
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-300 text-gray-400"
                      }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${active ? "text-gray-900" : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </p>
                    {active && (
                      <p className="text-xs text-gray-500 mt-1">
                        {idx === 0
                          ? "Your order has been placed successfully."
                          : idx === 1
                            ? "The restaurant is preparing your food."
                            : idx === 2
                              ? "Our delivery partner is on the way."
                              : "Enjoy your meal!"}
                      </p>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-[34px] h-10 border-l-2 ${active ? "border-orange-400" : "border-gray-200"
                        }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-5 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Estimated delivery:{" "}
              <span className="font-semibold text-gray-900">
                25–35 mins
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TrackOrderDrawer
