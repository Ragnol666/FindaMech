import React from 'react';
import {
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaLock,
  FaMobileAlt,
  FaWhatsapp
} from 'react-icons/fa';

// Re-export under friendly names for the project
export const LocationIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaMapMarkerAlt {...props} />
);
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaStar {...props} />
);
export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaCalendarAlt {...props} />
);
export const MoneyIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaMoneyBillAlt {...props} />
);
export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaLock {...props} />
);
export const MobileIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaMobileAlt {...props} />
);
export const WhatsappIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <FaWhatsapp {...props} />
);
