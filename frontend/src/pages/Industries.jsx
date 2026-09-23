import {
  Laptop,
  Code,
  BarChart3,
  Landmark,
  Shield,
  Briefcase,
  Plane,
  Car,
  House,
  Heart,
  FlaskConical,
  Fuel,
  Zap,
  Building2,
  Factory,
  Truck,
  Warehouse,
  ShoppingBag,
  Radio,
  GraduationCap,
  Settings,
  Users,
  Megaphone,
  TrendingUp,
  ClipboardList,
  Calculator,
  Scale,
  Lock,
  Wrench,
  Home,
  Pickaxe,
  Ship,
  Leaf,
  Utensils,
  Package,
  Globe,
  HardHat,
  UserCheck,
  BarChart
} from "lucide-react";

import "./Industries.css";

const industries = [
  ["Information Technology (IT)", Laptop],
  ["Software Development", Code],
  ["AI & Data Science", BarChart3],
  ["Banking & Financial Services", Landmark],
  ["Insurance", Shield],
  ["BPO & KPO", Briefcase],
  ["Aviation & Airports", Plane],
  ["Airlines & Ground Handling", Plane],

  ["Hospitality & Hotels", House],
  ["Healthcare & Hospitals", Heart],
  ["Pharmaceuticals", FlaskConical],
  ["Oil & Gas", Fuel],
  ["Power Plant & Energy", Zap],
  ["Construction & Infrastructure", Building2],
  ["Manufacturing", Factory],
  ["Automobile Industry", Car],

  ["Logistics & Supply Chain", Truck],
  ["Warehousing", Warehouse],
  ["Retail & E-commerce", ShoppingBag],
  ["Telecommunications", Radio],
  ["Education", GraduationCap],
  ["Engineering", Settings],
  ["Human Resources", Users],
  ["Sales & Marketing", Megaphone],

  ["Business Development", TrendingUp],
  ["Administration", ClipboardList],
  ["Finance & Accounts", Calculator],
  ["Legal", Scale],
  ["Security Services", Lock],
  ["Facility Management", Wrench],
  ["Real Estate", Home],
  ["Mining", Pickaxe],

  ["Marine & Shipping", Ship],
  ["Agriculture", Leaf],
  ["Food Processing", Utensils],
  ["FMCG", Package],
  ["Government & Public Sector", Landmark],
  ["Overseas Skilled & Unskilled Jobs", Globe],
  ["Blue & White Collar Recruitment", HardHat],
  ["Executive & Leadership Hiring", UserCheck],
];

function Industries() {
  return (
    <main className="industries-page">

      <section className="industries-main">

        {/* HEADER */}

        <div className="industries-heading">

          <p className="industries-eyebrow">
            40+ VERTICALS
          </p>

          <h1>
            Industries We Serve
          </h1>

          <p className="industries-description">
            Every card carries an accessible text label alongside its icon —
            filterable by keyword, and each links to industry-specific job
            listings for faster discovery.
          </p>

        </div>

        <div className="industries-grid">

          {industries.map(([title, Icon], index) => (

            <div
              className="industry-service-card"
              key={index}
            >

              <div className="industry-service-icon">
                <Icon size={15} />
              </div>

              <h3>
                {title}
              </h3>

              <a href="#current-openings">
                View Openings →
              </a>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

export default Industries;